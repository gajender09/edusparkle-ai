
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, level } = await req.json();
    
    if (!title || !level) {
      return new Response(
        JSON.stringify({ error: 'Title and level are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating course for: ${title}, Level: ${level}`);

    // Generate course content using Gemini API
    const courseStructure = await generateCourseStructure(title, level);
    
    // Find related YouTube videos
    const youtubeVideos = await findYouTubeVideos(title, level);

    // Combine all data into a complete course
    const generatedCourse = {
      title,
      level,
      description: courseStructure.description,
      content: courseStructure.content,
      glossary: courseStructure.glossary,
      roadmap: courseStructure.roadmap,
      resources: {
        articles: courseStructure.resources.articles,
        videos: youtubeVideos
      }
    };

    return new Response(
      JSON.stringify(generatedCourse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating course:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate course' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateCourseStructure(title: string, level: string) {
  try {
    const prompt = `
      Create a comprehensive learning curriculum for "${title}" at a ${level} level. 
      Include the following:
      
      1. A detailed course description (100-150 words)
      2. Course content with modules and lessons (2-3 modules, each with 3-4 lessons)
      3. A glossary of key terms (4-6 terms with definitions)
      4. A learning roadmap with stages and milestones (3 stages, each with 3 milestones)
      5. Resource articles (3-4 article recommendations with titles and hypothetical URLs)
      
      Format the response as JSON with these keys: description, content, glossary, roadmap, resources.
      Keep the response concise and focused on creating a practical learning path.
    `;

    console.log("Sending request to Gemini API");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    const data = await response.json();
    console.log("Received response from Gemini API");
    
    if (data.error) {
      throw new Error(`Gemini API error: ${data.error.message}`);
    }
    
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Extract the JSON from the response text
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Gemini response");
    }
    
    const courseData = JSON.parse(jsonMatch[0]);
    console.log("Successfully parsed course data from Gemini");
    
    return courseData;
  } catch (error) {
    console.error("Error in generateCourseStructure:", error);
    // Return a basic structure if generation fails
    return {
      description: `A comprehensive ${level} level course on ${title}.`,
      content: {
        modules: [
          {
            title: "Getting Started with " + title,
            description: "Learn the fundamentals and key concepts.",
            lessons: [
              { title: "Introduction to " + title, description: "An overview of the subject and its importance." },
              { title: "Core Concepts", description: "Understanding the essential principles." },
              { title: "Setup Your Learning Environment", description: "Prepare the tools and resources you'll need." }
            ]
          },
          {
            title: "Building Your Knowledge",
            description: "Develop deeper understanding through hands-on practice.",
            lessons: [
              { title: "Practical Applications", description: "Applying concepts to real-world scenarios." },
              { title: "Problem Solving Techniques", description: "Develop your analytical thinking." },
              { title: "Advanced Implementation", description: "Take your skills to the next level." }
            ]
          }
        ]
      },
      glossary: [
        { term: title + " Architecture", definition: "The foundational structure that defines how components work together." },
        { term: "Implementation Patterns", definition: "Standardized approaches to solving common problems in the field." },
        { term: "Best Practices", definition: "Recommended methods and techniques widely accepted by experts." },
        { term: "Optimization Strategies", definition: "Approaches to improve efficiency and performance." }
      ],
      roadmap: [
        { 
          stage: "Foundation", 
          milestones: [
            "Understand basic principles",
            "Complete introductory exercises",
            "Pass the knowledge assessment"
          ] 
        },
        { 
          stage: "Application", 
          milestones: [
            "Apply concepts to a small project",
            "Receive feedback and iterate",
            "Document your learning process"
          ] 
        },
        { 
          stage: "Mastery", 
          milestones: [
            "Complete an advanced project",
            "Teach concepts to others",
            "Contribute to the community"
          ] 
        }
      ],
      resources: {
        articles: [
          { title: "Comprehensive Guide to " + title, url: "https://example.com/guide" },
          { title: title + " for " + level + "s", url: "https://example.com/level-guide" },
          { title: "Latest Trends in " + title, url: "https://example.com/trends" }
        ]
      }
    };
  }
}

async function findYouTubeVideos(title: string, level: string) {
  try {
    const query = encodeURIComponent(`${title} ${level} tutorial`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${query}&type=video&key=${YOUTUBE_API_KEY}`;
    
    console.log("Fetching YouTube videos");
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`YouTube API error: ${data.error.message}`);
    }
    
    return data.items.map((item: any) => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
  } catch (error) {
    console.error("Error in findYouTubeVideos:", error);
    // Return fallback videos if API call fails
    return [
      { title: title + " Crash Course", url: "https://example.com/crash-course" },
      { title: "Deep Dive into " + title, url: "https://example.com/deep-dive" },
      { title: "Expert Tips for " + title, url: "https://example.com/tips" }
    ];
  }
}

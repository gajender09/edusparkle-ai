import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CourseRequest {
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, level }: CourseRequest = await req.json();
    console.log('Generating course:', { title, level });

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
    const googleCseId = Deno.env.get('GOOGLE_CSE_ID');
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
    const newsApiKey = Deno.env.get('NEWS_API_KEY');

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Step 1: Generate course content with Gemini AI
    console.log('Calling Gemini API for course generation...');
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a comprehensive ${level} level course about "${title}". 

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Course Title",
  "description": "Brief course description",
  "content": {
    "modules": [
      {
        "id": 1,
        "title": "Module Title",
        "description": "Module description",
        "lessons": [
          {
            "id": 1,
            "title": "Lesson Title",
            "content": "Detailed lesson content with explanations, examples, and key concepts",
            "duration": "estimated duration in minutes",
            "keyPoints": ["key point 1", "key point 2"]
          }
        ]
      }
    ]
  },
  "glossary": [
    {
      "term": "Technical Term",
      "definition": "Clear definition"
    }
  ],
  "roadmap": [
    {
      "stage": "Stage Name",
      "description": "What to focus on",
      "timeframe": "Estimated time",
      "skills": ["skill 1", "skill 2"]
    }
  ],
  "resources": {
    "books": ["Book recommendations"],
    "articles": ["Article suggestions"],
    "tools": ["Recommended tools"],
    "communities": ["Helpful communities"]
  }
}

Make sure the course has 3-5 modules with 2-4 lessons each. Include practical examples and real-world applications.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 4000,
        }
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response received');

    let courseData;
    try {
      const generatedText = geminiData.candidates[0].content.parts[0].text;
      // Clean up the response to extract JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }
      courseData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse course data from Gemini');
    }

    // Step 2: Enhance with Google Search results (if available)
    if (googleApiKey && googleCseId) {
      try {
        console.log('Fetching related articles...');
        const searchResponse = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCseId}&q=${encodeURIComponent(title + ' tutorial guide')}&num=5`
        );
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.items) {
            const articles = searchData.items.map((item: any) => ({
              title: item.title,
              url: item.link,
              snippet: item.snippet
            }));
            courseData.resources.articles = articles;
            console.log('Added search results to resources');
          }
        }
      } catch (searchError) {
        console.error('Search API error:', searchError);
        // Continue without search results
      }
    }

    // Step 3: Add YouTube videos (if available)
    if (youtubeApiKey) {
      try {
        console.log('Fetching YouTube videos...');
        const youtubeResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(title + ' tutorial')}&type=video&key=${youtubeApiKey}`
        );
        
        if (youtubeResponse.ok) {
          const youtubeData = await youtubeResponse.json();
          if (youtubeData.items) {
            const videos = youtubeData.items.map((item: any) => ({
              id: item.id.videoId,
              title: item.snippet.title,
              description: item.snippet.description,
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              thumbnail: {
                default: item.snippet.thumbnails.default.url,
                medium: item.snippet.thumbnails.medium?.url,
                high: item.snippet.thumbnails.high?.url
              },
              channelTitle: item.snippet.channelTitle,
              publishedAt: item.snippet.publishedAt
            }));
            courseData.resources.videos = videos;
            console.log('Added YouTube videos to resources');
          }
        }
      } catch (youtubeError) {
        console.error('YouTube API error:', youtubeError);
        // Continue without YouTube results
      }
    }

    // Step 4: Add relevant news (if available)
    if (newsApiKey) {
      try {
        console.log('Fetching relevant news...');
        const newsResponse = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(title)}&sortBy=relevancy&pageSize=3&apiKey=${newsApiKey}`
        );
        
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          if (newsData.articles) {
            const news = newsData.articles.map((article: any) => ({
              title: article.title,
              url: article.url,
              description: article.description,
              source: article.source.name,
              publishedAt: article.publishedAt,
              urlToImage: article.urlToImage
            }));
            courseData.resources.news = news;
            console.log('Added news articles to resources');
          }
        }
      } catch (newsError) {
        console.error('News API error:', newsError);
        // Continue without news results
      }
    }

    console.log('Course generation completed successfully');
    return new Response(JSON.stringify(courseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-course function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate course',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
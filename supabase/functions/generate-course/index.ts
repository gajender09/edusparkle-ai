
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CourseLevel } from "../../../src/types/course.ts";

// Define CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample data for the course content based on different topics
const courseSamples: Record<string, any> = {
  // Sample templates would be defined here
};

interface RequestData {
  title: string;
  level: CourseLevel;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Function invoked: generate-course");
    // Get the request body
    const requestData = await req.json() as RequestData;
    const { title, level } = requestData;

    console.log(`Generating course for title: ${title}, level: ${level}`);
    
    // Generate a sample description based on the title
    const description = `A comprehensive ${level} level course on ${title} designed to help you master the subject through structured learning and practical exercises.`;
    
    // Generate modules based on the title
    const moduleCount = level === "beginner" ? 3 : level === "intermediate" ? 4 : 5;
    const modules = Array.from({ length: moduleCount }).map((_, i) => ({
      title: `Module ${i + 1}: ${getModuleTitle(title, i)}`,
      description: `Learn the ${i === 0 ? "fundamentals" : i === 1 ? "intermediate concepts" : "advanced techniques"} of ${title} in this comprehensive module.`,
      lessons: Array.from({ length: 3 }).map((_, j) => ({
        title: `Lesson ${j + 1}: ${getLessonTitle(title, i, j)}`,
        description: `${getRandomLessonDescription(title, level)}`
      }))
    }));

    // Generate glossary items
    const glossaryItems = generateGlossaryItems(title, 8);
    
    // Generate roadmap
    const roadmap = generateRoadmap(title, level);
    
    // Generate resources
    const resources = generateResources(title);

    // Create the response
    const generatedCourse = {
      title,
      level,
      description,
      content: {
        modules
      },
      glossary: glossaryItems,
      roadmap,
      resources
    };
    
    console.log("Course generated successfully");
    
    // Return the generated course
    return new Response(JSON.stringify(generatedCourse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error generating course:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to generate course", 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions to generate course content
function getModuleTitle(title: string, index: number): string {
  const modules = [
    `Introduction to ${title}`,
    `Core Principles of ${title}`,
    `Practical Applications in ${title}`,
    `Advanced Concepts in ${title}`,
    `Mastering ${title} Techniques`,
  ];
  return modules[index % modules.length];
}

function getLessonTitle(title: string, moduleIndex: number, lessonIndex: number): string {
  const baseLessons = [
    [`Understanding ${title} Basics`, `Key Concepts in ${title}`, `Getting Started with ${title}`],
    [`Building Your First ${title} Project`, `${title} Best Practices`, `Problem Solving with ${title}`],
    [`Real-world ${title} Case Studies`, `${title} in Industry`, `Optimizing Your ${title} Workflow`],
    [`${title} Design Patterns`, `Advanced ${title} Techniques`, `${title} Architecture`],
    [`Expert ${title} Strategies`, `Innovation in ${title}`, `Future Trends in ${title}`],
  ];
  
  return baseLessons[moduleIndex % baseLessons.length][lessonIndex % 3];
}

function getRandomLessonDescription(title: string, level: string): string {
  const descriptions = [
    `Explore the foundational elements of ${title} and how they apply in various contexts.`,
    `Gain hands-on experience by implementing ${title} concepts in practical scenarios.`,
    `Learn how to apply ${title} principles to solve real-world problems efficiently.`,
    `Understand the theoretical underpinnings of ${title} and their practical applications.`,
    `Master the essential techniques needed to excel in ${title}.`,
    `Develop critical thinking skills by analyzing complex ${title} problems and solutions.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateGlossaryItems(title: string, count: number) {
  const baseTerms = [
    { term: "Algorithm", definition: `A step-by-step procedure for solving a problem or accomplishing a task in ${title}.` },
    { term: "Framework", definition: `A structured approach or platform used to develop ${title} applications.` },
    { term: "Methodology", definition: `A system of methods used in ${title} to achieve specific outcomes.` },
    { term: "Paradigm", definition: `A fundamental pattern or model that shapes the approach to ${title}.` },
    { term: "Integration", definition: `The process of combining different components or systems in ${title}.` },
    { term: "Optimization", definition: `The process of making ${title} processes more efficient and effective.` },
    { term: "Implementation", definition: `The execution or application of ${title} principles in practice.` },
    { term: "Scalability", definition: `The capability of ${title} systems to handle growing amounts of work.` },
    { term: "Architecture", definition: `The structure and organization of ${title} systems or components.` },
    { term: "Deployment", definition: `The process of making ${title} applications available for use.` },
  ];
  
  return baseTerms.slice(0, count);
}

function generateRoadmap(title: string, level: CourseLevel) {
  const beginnerRoadmap = [
    { 
      stage: "Foundation", 
      milestones: [
        `Learn the basics of ${title}`,
        `Complete introductory exercises`,
        `Build your first simple project`
      ] 
    },
    { 
      stage: "Development", 
      milestones: [
        `Apply core concepts in practice`,
        `Explore common patterns in ${title}`,
        `Participate in community discussions`
      ] 
    },
    { 
      stage: "Mastery", 
      milestones: [
        `Complete a capstone project`,
        `Review and reinforce learning`,
        `Prepare for intermediate studies`
      ] 
    }
  ];
  
  const intermediateRoadmap = [
    ...beginnerRoadmap,
    { 
      stage: "Advanced Applications", 
      milestones: [
        `Implement complex ${title} solutions`,
        `Optimize performance and efficiency`,
        `Contribute to open source projects`
      ] 
    }
  ];
  
  const advancedRoadmap = [
    ...intermediateRoadmap,
    { 
      stage: "Expertise", 
      milestones: [
        `Research and innovate new approaches`,
        `Lead projects and mentor others`,
        `Stay updated with cutting-edge developments`
      ] 
    }
  ];
  
  switch(level) {
    case "beginner": return beginnerRoadmap;
    case "intermediate": return intermediateRoadmap;
    case "advanced": return advancedRoadmap;
    default: return beginnerRoadmap;
  }
}

function generateResources(title: string) {
  return {
    articles: [
      { title: `Introduction to ${title}`, url: `https://example.com/intro-${encodeURIComponent(title.toLowerCase())}` },
      { title: `${title} Best Practices`, url: `https://example.com/${encodeURIComponent(title.toLowerCase())}-best-practices` },
      { title: `${title} in Industry`, url: `https://example.com/${encodeURIComponent(title.toLowerCase())}-industry-applications` },
    ],
    videos: [
      { title: `${title} for Beginners`, url: `https://example.com/videos/${encodeURIComponent(title.toLowerCase())}-beginners` },
      { title: `Advanced ${title} Techniques`, url: `https://example.com/videos/${encodeURIComponent(title.toLowerCase())}-advanced` },
      { title: `${title} Case Studies`, url: `https://example.com/videos/${encodeURIComponent(title.toLowerCase())}-case-studies` },
    ]
  };
}

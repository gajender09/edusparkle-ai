
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import NavigationHeader from "@/components/NavigationHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, BookOpen, List, FileText, Video } from "lucide-react";
import CourseContent from "@/components/CourseContent";
import CourseGlossary from "@/components/CourseGlossary";
import CourseRoadmap from "@/components/CourseRoadmap";
import CourseResources from "@/components/CourseResources";

type CourseLevel = "beginner" | "intermediate" | "advanced";

interface GeneratedCourse {
  title: string;
  level: CourseLevel;
  description: string;
  content: {
    modules: {
      title: string;
      description: string;
      lessons: {
        title: string;
        description: string;
      }[];
    }[];
  };
  glossary: {
    term: string;
    definition: string;
  }[];
  roadmap: {
    stage: string;
    milestones: string[];
  }[];
  resources: {
    articles: {
      title: string;
      url: string;
    }[];
    videos: {
      title: string;
      url: string;
    }[];
  };
}

const CreateCourse = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<CourseLevel>("beginner");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
  const [activeTab, setActiveTab] = useState("content");

  const handleGenerateCourse = async () => {
    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a course title",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // In a real implementation, this would be an API call to an AI service
    setTimeout(() => {
      // Mock data - in a real app this would come from the AI service
      const mockCourse: GeneratedCourse = {
        title,
        level,
        description: `A comprehensive ${level} level course on ${title}. This AI-generated curriculum provides structured learning materials to help you master the subject.`,
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
          ],
          videos: [
            { title: title + " Crash Course", url: "https://example.com/crash-course" },
            { title: "Deep Dive into " + title, url: "https://example.com/deep-dive" },
            { title: "Expert Tips for " + title, url: "https://example.com/tips" }
          ]
        }
      };
      
      setGeneratedCourse(mockCourse);
      setIsGenerating(false);
      
      toast({
        title: "Course Generated!",
        description: "Your AI-generated course is ready to explore.",
      });
    }, 2000);
  };

  const handleSaveCourse = () => {
    // In a real app, this would save to a database
    toast({
      title: "Course Saved",
      description: "Your course has been added to your library.",
    });
    
    // Navigate to home or course page
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-secondary to-white p-8 rounded-lg mb-8">
            <div className="mb-6 flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">AI Course Generator</h1>
            </div>
            <p className="text-gray-600 mb-6">
              Create a customized course with AI-generated content, glossary, roadmap, and resources.
              Just provide a course title and select the difficulty level.
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <Label htmlFor="course-title">Course Title</Label>
                  <Input 
                    id="course-title"
                    placeholder="e.g., Machine Learning, Web Development, Photography"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                    disabled={isGenerating}
                  />
                </div>
                <div>
                  <Label htmlFor="course-level">Level</Label>
                  <Select 
                    disabled={isGenerating}
                    value={level} 
                    onValueChange={(value) => setLevel(value as CourseLevel)}
                  >
                    <SelectTrigger id="course-level" className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleGenerateCourse} 
                disabled={isGenerating} 
                className="w-full"
                size="lg"
              >
                {isGenerating ? "Generating Course..." : "Generate AI Course"}
              </Button>
            </div>
          </div>
          
          {generatedCourse && (
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">{generatedCourse.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {generatedCourse.level.charAt(0).toUpperCase() + generatedCourse.level.slice(1)}
                  </span>
                </div>
                <p className="mt-4 text-gray-600">{generatedCourse.description}</p>
              </div>
              
              <div className="border-b">
                <nav className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("content")}
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 ${activeTab === "content" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                  >
                    <BookOpen className="h-4 w-4" />
                    Course Content
                  </button>
                  <button
                    onClick={() => setActiveTab("glossary")}
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 ${activeTab === "glossary" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                  >
                    <FileText className="h-4 w-4" />
                    Glossary
                  </button>
                  <button
                    onClick={() => setActiveTab("roadmap")}
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 ${activeTab === "roadmap" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                  >
                    <List className="h-4 w-4" />
                    Roadmap
                  </button>
                  <button
                    onClick={() => setActiveTab("resources")}
                    className={`px-4 py-2 font-medium text-sm flex items-center gap-2 border-b-2 ${activeTab === "resources" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                  >
                    <Video className="h-4 w-4" />
                    Resources
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === "content" && <CourseContent content={generatedCourse.content} />}
                {activeTab === "glossary" && <CourseGlossary glossary={generatedCourse.glossary} />}
                {activeTab === "roadmap" && <CourseRoadmap roadmap={generatedCourse.roadmap} />}
                {activeTab === "resources" && <CourseResources resources={generatedCourse.resources} />}
              </div>
              
              <div className="p-6 border-t bg-gray-50">
                <Button onClick={handleSaveCourse} className="w-full">
                  Save Course to My Library
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateCourse;

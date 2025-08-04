import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import NavigationHeader from "@/components/NavigationHeader";
import CourseModuleViewer from "@/components/CourseModuleViewer";
import CourseGlossary from "@/components/CourseGlossary";
import CourseRoadmap from "@/components/CourseRoadmap";
import CourseResources from "@/components/CourseResources";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, BookOpen, Map, MessageSquare, Globe, Brain, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  content: any;
  glossary: any;
  roadmap: any;
  resources: any;
}

interface Chapter {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  completed: boolean;
}

interface CourseModule {
  id: number;
  title: string;
  description: string;
  chapters: Chapter[];
  progress: number;
}

const CourseViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<{
    moduleId: number;
    chapterId: number;
    title: string;
    content?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingContent, setGeneratingContent] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    fetchCourse();
  }, [id, user, navigate]);

  const fetchCourse = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setCourse(data);
      
      // Convert course content to module format
      if ((data.content as any)?.modules) {
        const transformedModules = (data.content as any).modules.map((module: any, moduleIndex: number) => ({
          id: moduleIndex,
          title: module.title,
          description: module.description,
          chapters: module.lessons?.map((lesson: any, lessonIndex: number) => ({
            id: lessonIndex,
            title: lesson.title,
            description: lesson.description || lesson.content?.substring(0, 100) + "...",
            duration: lesson.duration || "15 min",
            difficulty: lesson.difficulty || "Beginner",
            completed: false
          })) || [],
          progress: 0
        }));
        setModules(transformedModules);
      }
    } catch (error: any) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = async (moduleId: number, chapterId: number, chapterTitle: string) => {
    setSelectedChapter({ moduleId, chapterId, title: chapterTitle });
    setGeneratingContent(true);

    try {
      // Generate content using Gemini API
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { 
          topic: `${course?.title} - ${chapterTitle}`,
          context: `This is chapter ${chapterId + 1} of module ${moduleId + 1} in a course about ${course?.title}. Generate detailed educational content for this specific topic.`
        },
      });

      if (error) throw error;

      setSelectedChapter(prev => prev ? { ...prev, content: data.content } : null);
      
      // Mark chapter as completed
      setModules(prev => prev.map(module => 
        module.id === moduleId 
          ? {
              ...module,
              chapters: module.chapters.map(chapter =>
                chapter.id === chapterId ? { ...chapter, completed: true } : chapter
              ),
              progress: Math.round(((module.chapters.filter(c => c.completed).length + 1) / module.chapters.length) * 100)
            }
          : module
      ));

    } catch (error: any) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content");
    } finally {
      setGeneratingContent(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course not found</h1>
            <Button onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const levelColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800"
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <Badge className={levelColors[course.level as keyof typeof levelColors] || "bg-gray-100 text-gray-800"}>
              {course.level}
            </Badge>
          </div>
          
          <p className="text-lg text-muted-foreground mb-4">{course.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Course Modules */}
          <div className="lg:col-span-1">
            <CourseModuleViewer 
              modules={modules}
              onChapterClick={handleChapterClick}
            />
          </div>

          {/* Right Panel - Content Display */}
          <div className="lg:col-span-2">
            {selectedChapter ? (
              <Card className="glass border border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    {selectedChapter.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatingContent ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Generating content...</p>
                      </div>
                    </div>
                  ) : selectedChapter.content ? (
                    <ScrollArea className="h-96">
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            code({ className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              const isInline = !match;
                              return !isInline ? (
                                <SyntaxHighlighter
                                  style={oneDark as any}
                                  language={match[1]}
                                  PreTag="div"
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {selectedChapter.content}
                        </ReactMarkdown>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Content will be generated when you click on the chapter</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="glass border border-primary/10">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Chapter</h3>
                  <p className="text-muted-foreground text-center">
                    Choose a chapter from the course modules on the left to start learning
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Additional Tabs for Other Content */}
            <div className="mt-8">
              <Tabs defaultValue="glossary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="glossary" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Glossary
                  </TabsTrigger>
                  <TabsTrigger value="roadmap" className="flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    Roadmap
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Resources
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="glossary" className="mt-6">
                  <CourseGlossary glossary={course.glossary} />
                </TabsContent>

                <TabsContent value="roadmap" className="mt-6">
                  <CourseRoadmap roadmap={course.roadmap} />
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  <CourseResources resources={course.resources} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
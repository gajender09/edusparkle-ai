import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Play, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  content: string;
  duration: string;
  keyPoints: string[];
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  level: string;
  content: {
    modules: Module[];
  };
}

const CourseViewer = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<CourseData | null>(location.state?.course || null);
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [selectedLesson, setSelectedLesson] = useState<number>(0);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (!course && courseId) {
      fetchCourse();
    }
  }, [courseId, course]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error) throw error;
      setCourse({
        ...data,
        content: (data.content as unknown) as { modules: Module[] }
      });
    } catch (error: any) {
      toast.error("Failed to fetch course: " + error.message);
      navigate("/dashboard");
    }
  };

  const generateDetailedContent = async (lesson: Lesson) => {
    if (generatedContent) return; // Don't regenerate if already exists
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-course", {
        body: { 
          title: `${lesson.title} - Detailed Explanation`,
          level: course?.level || "beginner",
          type: "lesson_detail"
        },
      });

      if (error) throw error;

      // Extract the content from the generated course structure
      const detailedContent = data?.content?.modules?.[0]?.lessons?.[0]?.content || 
                            `# ${lesson.title}\n\n${lesson.content}\n\n## Key Learning Points\n\n${lesson.keyPoints.map(point => `- ${point}`).join('\n')}`;
      
      setGeneratedContent(detailedContent);
    } catch (error: any) {
      console.error("Error generating content:", error);
      // Fallback to basic content
      setGeneratedContent(`# ${lesson.title}\n\n${lesson.content}\n\n## Key Learning Points\n\n${lesson.keyPoints.map(point => `- ${point}`).join('\n')}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const markLessonComplete = (moduleIndex: number, lessonIndex: number) => {
    const lessonKey = `${moduleIndex}-${lessonIndex}`;
    setCompletedLessons(prev => new Set([...prev, lessonKey]));
    
    // Check if module is complete (all lessons done)
    const currentModule = course?.content.modules[moduleIndex];
    if (currentModule) {
      const moduleComplete = currentModule.lessons.every((_, idx) => 
        completedLessons.has(`${moduleIndex}-${idx}`) || idx === lessonIndex
      );
      
      if (moduleComplete) {
        toast.success("Module completed! 🎉");
        setShowQuiz(true);
      }
    }
  };

  const isLessonComplete = (moduleIndex: number, lessonIndex: number) => {
    return completedLessons.has(`${moduleIndex}-${lessonIndex}`);
  };

  const getCurrentLesson = () => {
    return course?.content.modules[selectedModule]?.lessons[selectedLesson];
  };

  const handleLessonSelect = (moduleIndex: number, lessonIndex: number) => {
    setSelectedModule(moduleIndex);
    setSelectedLesson(lessonIndex);
    setGeneratedContent(""); // Clear previous content
    setShowQuiz(false);
  };

  const calculateProgress = () => {
    if (!course) return 0;
    const totalLessons = course.content.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    return totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <NavigationHeader />
        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentLesson = getCurrentLesson();

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <main className="pt-20">
        {/* Header */}
        <div className="border-b bg-gray-50/50">
          <div className="container mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {course.content.modules.length} modules • {course.content.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                  </span>
                </div>
              </div>
              
              <div className="w-full lg:w-80">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(calculateProgress())}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Course Structure */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Course Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {course.content.modules.map((module, moduleIndex) => (
                      <div key={module.id} className="border-b last:border-b-0">
                        <div className="p-4 bg-gray-50/50">
                          <h4 className="font-medium text-sm">{module.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{module.lessons.length} lessons</p>
                        </div>
                        <div className="space-y-1">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <button
                              key={lesson.id}
                              onClick={() => handleLessonSelect(moduleIndex, lessonIndex)}
                              className={`w-full text-left p-3 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                                selectedModule === moduleIndex && selectedLesson === lessonIndex
                                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                                  : ""
                              }`}
                            >
                              {isLessonComplete(moduleIndex, lessonIndex) ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                              ) : (
                                <Play className="h-4 w-4 text-gray-400 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="truncate">{lesson.title}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {currentLesson ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{currentLesson.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Clock className="h-4 w-4" />
                          {currentLesson.duration}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateDetailedContent(currentLesson)}
                        disabled={isGenerating}
                        className="gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        {isGenerating ? "Generating..." : "Get AI Explanation"}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {isGenerating ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Generating detailed explanation...</p>
                      </div>
                    ) : generatedContent ? (
                      <div className="prose prose-blue max-w-none">
                        <ReactMarkdown
                           components={{
                             code({ className, children, ...props }) {
                               const match = /language-(\w+)/.exec(className || '');
                               const isInline = !match;
                                return !isInline ? (
                                  <div>
                                    <SyntaxHighlighter
                                      style={tomorrow as any}
                                      language={match[1]}
                                      PreTag="div"
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  </div>
                                ) : (
                                  <code className={className}>
                                    {children}
                                  </code>
                                );
                             },
                           }}
                        >
                          {generatedContent}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 mb-6">{currentLesson.content}</p>
                        
                        <Separator className="my-6" />
                        
                        <div>
                          <h3 className="font-semibold mb-3">Key Learning Points:</h3>
                          <ul className="space-y-2">
                            {currentLesson.keyPoints.map((point, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {selectedModule > 0 || selectedLesson > 0 ? (
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (selectedLesson > 0) {
                                handleLessonSelect(selectedModule, selectedLesson - 1);
                              } else if (selectedModule > 0) {
                                const prevModule = course.content.modules[selectedModule - 1];
                                handleLessonSelect(selectedModule - 1, prevModule.lessons.length - 1);
                              }
                            }}
                          >
                            Previous Lesson
                          </Button>
                        ) : null}
                      </div>

                      <div className="flex gap-2">
                        {!isLessonComplete(selectedModule, selectedLesson) && (
                          <Button
                            onClick={() => markLessonComplete(selectedModule, selectedLesson)}
                            className="gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Mark as Complete
                          </Button>
                        )}
                        
                        {(selectedModule < course.content.modules.length - 1 || 
                          selectedLesson < course.content.modules[selectedModule].lessons.length - 1) && (
                          <Button
                            variant={isLessonComplete(selectedModule, selectedLesson) ? "default" : "outline"}
                            onClick={() => {
                              if (selectedLesson < course.content.modules[selectedModule].lessons.length - 1) {
                                handleLessonSelect(selectedModule, selectedLesson + 1);
                              } else if (selectedModule < course.content.modules.length - 1) {
                                handleLessonSelect(selectedModule + 1, 0);
                              }
                            }}
                          >
                            Next Lesson
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a lesson to start learning</h3>
                    <p className="text-gray-600">Choose a lesson from the course content on the left to begin.</p>
                  </CardContent>
                </Card>
              )}

              {/* Quiz Modal/Section */}
              {showQuiz && (
                <Card className="mt-6 border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800">🎉 Module Complete!</CardTitle>
                    <CardDescription className="text-green-700">
                      Great job! You've completed this module. Ready for a quick quiz?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => {
                          toast.success("Quiz feature coming soon!");
                          setShowQuiz(false);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Take Quiz
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowQuiz(false)}
                      >
                        Skip for Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseViewer;
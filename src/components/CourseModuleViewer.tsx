import { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Circle,
  Play,
  ChevronRight
} from "lucide-react";

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

interface CourseModuleViewerProps {
  modules: CourseModule[];
  onChapterClick: (moduleId: number, chapterId: number, chapterTitle: string) => void;
  className?: string;
}

const CourseModuleViewer = ({ modules, onChapterClick, className = "" }: CourseModuleViewerProps) => {
  const [expandedModule, setExpandedModule] = useState<string>("module-0");

  const getDifficultyColor = (difficulty: Chapter["difficulty"]) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const totalChapters = modules.reduce((acc, module) => acc + module.chapters.length, 0);
  const completedChapters = modules.reduce((acc, module) => 
    acc + module.chapters.filter(chapter => chapter.completed).length, 0
  );
  const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Progress */}
      <div className="glass p-6 rounded-xl border border-primary/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Course Progress</h3>
          <span className="text-sm text-muted-foreground">
            {completedChapters}/{totalChapters} chapters completed
          </span>
        </div>
        <Progress value={overallProgress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          {Math.round(overallProgress)}% Complete
        </p>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Course Modules
        </h3>
        
        <Accordion 
          type="single" 
          collapsible 
          value={expandedModule || undefined} 
          onValueChange={setExpandedModule}
          className="space-y-4"
        >
          {modules.map((module, moduleIndex) => (
            <AccordionItem 
              key={`module-${moduleIndex}`} 
              value={`module-${moduleIndex}`}
              className="glass border border-primary/10 rounded-xl overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline px-6 py-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-bold">
                      {moduleIndex + 1}
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-lg">{module.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {module.chapters.length} chapters
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full gradient-primary transition-all duration-300"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {Math.round(module.progress)}%
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 pb-6">
                <div className="mt-4 mb-6 text-muted-foreground">
                  {module.description}
                </div>
                
                <div className="space-y-3">
                  {module.chapters.map((chapter, chapterIndex) => (
                    <div 
                      key={`chapter-${moduleIndex}-${chapterIndex}`}
                      className="group border border-border rounded-lg p-4 hover:border-primary/30 transition-all duration-200 cursor-pointer bg-card/50 hover:bg-card"
                      onClick={() => onChapterClick(moduleIndex, chapterIndex, chapter.title)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {chapter.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h5 className="font-medium text-foreground group-hover:text-primary transition-colors">
                              Chapter {chapterIndex + 1}: {chapter.title}
                            </h5>
                            <p className="text-sm text-muted-foreground mt-1">
                              {chapter.description}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{chapter.duration}</span>
                              </div>
                              
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getDifficultyColor(chapter.difficulty)}`}
                              >
                                {chapter.difficulty}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={chapter.completed ? "outline" : "default"}
                              className="h-8 px-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                onChapterClick(moduleIndex, chapterIndex, chapter.title);
                              }}
                            >
                              {chapter.completed ? "Review" : "Start"}
                              {chapter.completed ? (
                                <CheckCircle className="ml-1 h-3 w-3" />
                              ) : (
                                <Play className="ml-1 h-3 w-3" />
                              )}
                            </Button>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default CourseModuleViewer;
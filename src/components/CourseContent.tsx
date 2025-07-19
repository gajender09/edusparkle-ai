
import { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

interface Lesson {
  id: number;
  title: string;
  content: string;
  duration: string;
  keyPoints: string[];
  description?: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface CourseContentProps {
  content: {
    modules: Module[];
  };
}

const CourseContent = ({ content }: CourseContentProps) => {
  const [expandedModule, setExpandedModule] = useState<string | null>("module-0");

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Course Curriculum</h3>
      
      <Accordion type="single" collapsible value={expandedModule || undefined} onValueChange={setExpandedModule}>
        {content.modules.map((module, moduleIndex) => (
          <AccordionItem key={`module-${moduleIndex}`} value={`module-${moduleIndex}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-col text-left">
                <span className="font-medium">{module.title}</span>
                <span className="text-sm text-gray-500 font-normal">{module.lessons.length} lessons</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="mt-2 mb-4 text-gray-600">
                {module.description}
              </div>
              
              <ul className="space-y-4">
                {module.lessons.map((lesson, lessonIndex) => (
                  <li key={`lesson-${moduleIndex}-${lessonIndex}`} className="border rounded-md p-4 bg-gray-50">
                    <h4 className="font-medium mb-1">
                      Lesson {lessonIndex + 1}: {lesson.title}
                    </h4>
                    <p className="text-sm text-gray-600">{lesson.description}</p>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CourseContent;

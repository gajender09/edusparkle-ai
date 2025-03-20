
import { useState } from "react";
import { BookOpen, FileText, List, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseContent from "@/components/CourseContent";
import CourseGlossary from "@/components/CourseGlossary";
import CourseRoadmap from "@/components/CourseRoadmap";
import CourseResources from "@/components/CourseResources";
import { GeneratedCourse } from "@/types/course";

interface CoursePreviewProps {
  course: GeneratedCourse;
  onSave: () => void;
}

const CoursePreview = ({ course, onSave }: CoursePreviewProps) => {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">{course.title}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
        </div>
        <p className="mt-4 text-gray-600">{course.description}</p>
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
        {activeTab === "content" && <CourseContent content={course.content} />}
        {activeTab === "glossary" && <CourseGlossary glossary={course.glossary} />}
        {activeTab === "roadmap" && <CourseRoadmap roadmap={course.roadmap} />}
        {activeTab === "resources" && <CourseResources resources={course.resources} />}
      </div>
      
      <div className="p-6 border-t bg-gray-50">
        <Button onClick={onSave} className="w-full">
          Save Course to My Library
        </Button>
      </div>
    </div>
  );
};

export default CoursePreview;

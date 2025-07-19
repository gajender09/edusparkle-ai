
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CourseLevel, GeneratedCourse } from "@/types/course";

export const useCourseGenerator = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [level, setLevel] = useState<CourseLevel>("beginner");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCourse = async () => {
    if (!title) {
      setError("Please enter a course title");
      return;
    }

    if (!user) {
      toast.error("You need to sign in to generate courses");
      return;
    }

    setError(null);
    setIsGenerating(true);
    setGeneratedCourse(null);

    try {
      console.log("Calling generate course function");
      const { data, error } = await supabase.functions.invoke("generate-course", {
        body: { title, level },
      });

      if (error) {
        console.error("Error generating course:", error);
        throw new Error(error.message || "Failed to generate course");
      }

      if (!data) {
        throw new Error("No data returned from course generation");
      }

      console.log("Course generated successfully:", data);

      // Validate course data
      if (
        !data.title ||
        !data.description ||
        !data.content ||
        !data.glossary ||
        !data.roadmap ||
        !data.resources
      ) {
        throw new Error("Generated course data is incomplete");
      }

      const generatedCourse: GeneratedCourse = {
        title: data.title,
        description: data.description,
        level,
        content: data.content,
        glossary: data.glossary,
        roadmap: data.roadmap,
        resources: data.resources,
      };

      setGeneratedCourse(generatedCourse);
      toast.success("Course generated successfully!");
    } catch (err: any) {
      console.error("Error in course generation:", err);
      setError(err.message || "Failed to generate course. Please try again.");
      toast.error("Failed to generate course");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCourse = async () => {
    if (!generatedCourse || !user) {
      toast.error("Unable to save course");
      return;
    }

    try {
      toast.loading("Saving course...");

      // Fix: Correctly format the object for insertion
      const { error } = await supabase.from("courses").insert({
        title: generatedCourse.title,
        description: generatedCourse.description,
        level: generatedCourse.level,
        content: generatedCourse.content as any,
        glossary: generatedCourse.glossary as any,
        roadmap: generatedCourse.roadmap as any,
        resources: generatedCourse.resources as any,
        user_id: user.id
      });

      if (error) {
        throw error;
      }

      toast.dismiss();
      toast.success("Course saved successfully!");
    } catch (error: any) {
      toast.dismiss();
      toast.error("Failed to save course: " + error.message);
    }
  };

  return {
    title,
    setTitle,
    level,
    setLevel,
    isGenerating,
    generatedCourse,
    error,
    handleGenerateCourse,
    handleSaveCourse,
  };
};

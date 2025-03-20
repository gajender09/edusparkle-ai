
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedCourse, CourseLevel } from "@/types/course";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function useCourseGenerator() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<CourseLevel>("beginner");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleGenerateCourse = async () => {
    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a course title",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate courses",
        variant: "destructive",
      });
      navigate("/sign-in");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Invoking generate-course function with:", { title, level });
      
      // Improved error handling with more descriptive messages
      const { data, error: functionError } = await supabase.functions.invoke('generate-course', {
        body: { title, level },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (functionError) {
        console.error("Edge function error details:", functionError);
        throw new Error(functionError.message || 'Failed to connect to course generation service');
      }
      
      console.log("Response from edge function:", data);
      
      if (!data) {
        throw new Error('No data returned from course generation service');
      }

      console.log("Generated course data:", data);
      
      setGeneratedCourse(data as GeneratedCourse);
      toast({
        title: "Course Generated!",
        description: "Your AI-generated course is ready to explore.",
      });
    } catch (error) {
      console.error("Error generating course:", error);
      setError(error instanceof Error 
        ? error.message 
        : "Failed to connect to course generation service. Please try again later.");
      toast({
        title: "Generation Failed",
        description: error instanceof Error 
          ? error.message 
          : "Failed to connect to course generation service. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCourse = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save courses",
        variant: "destructive",
      });
      navigate("/sign-in");
      return;
    }

    if (!generatedCourse) {
      toast({
        title: "No Course to Save",
        description: "Please generate a course first",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          user_id: user.id,
          title: generatedCourse.title,
          level: generatedCourse.level,
          description: generatedCourse.description,
          content: generatedCourse.content,
          glossary: generatedCourse.glossary,
          roadmap: generatedCourse.roadmap,
          resources: generatedCourse.resources
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Course Saved",
        description: "Your course has been added to your library.",
      });
      
      // Navigate to home or course page
      setTimeout(() => navigate("/my-learning"), 1500);
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Failed to Save",
        description: "There was an error saving your course. Please try again.",
        variant: "destructive",
      });
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
    handleSaveCourse
  };
}

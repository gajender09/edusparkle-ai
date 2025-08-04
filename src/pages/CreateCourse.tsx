
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavigationHeader from "@/components/NavigationHeader";
import CourseForm from "@/components/CourseGenerator/CourseForm";
import CoursePreview from "@/components/CourseGenerator/CoursePreview";
import { useCourseGenerator } from "@/hooks/use-course-generator";
import Footer from "@/components/Footer";

const CreateCourse = () => {
  const location = useLocation();
  const {
    title,
    setTitle,
    level,
    setLevel,
    isGenerating,
    generatedCourse,
    error,
    handleGenerateCourse,
    handleSaveCourse
  } = useCourseGenerator();

  // Pre-fill form if topic was passed from landing page
  useEffect(() => {
    if (location.state?.topic) {
      setTitle(location.state.topic);
    }
  }, [location.state, setTitle]);

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
              Create Your AI-Powered Course
            </h1>
            <p className="text-lg text-muted-foreground">
              Generate comprehensive learning modules with structured content in seconds
            </p>
          </div>
          
          <CourseForm
            title={title}
            setTitle={setTitle}
            level={level}
            setLevel={setLevel}
            onGenerate={handleGenerateCourse}
            isGenerating={isGenerating}
            error={error}
          />
          
          {generatedCourse && (
            <CoursePreview 
              course={generatedCourse} 
              onSave={handleSaveCourse} 
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateCourse;

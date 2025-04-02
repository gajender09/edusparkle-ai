
import NavigationHeader from "@/components/NavigationHeader";
import CourseForm from "@/components/CourseGenerator/CourseForm";
import CoursePreview from "@/components/CourseGenerator/CoursePreview";
import { useCourseGenerator } from "@/hooks/use-course-generator";
import Footer from "@/components/Footer";

const CreateCourse = () => {
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

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
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

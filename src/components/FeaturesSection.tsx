
import { Brain, BookOpen, Sparkles, GraduationCap } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => (
  <div className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Course Generation",
      description: "Create detailed, structured courses with just a title and difficulty level using our advanced AI technology."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Comprehensive Curriculum",
      description: "Each generated course includes modules, lessons, glossary, roadmap, and recommended resources."
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Personalized Learning",
      description: "Courses are tailored to your chosen difficulty level - beginner, intermediate, or advanced."
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with our intuitive progress tracking system for each course."
    },
  ];

  return (
    <section className="py-16 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform helps you create customized learning experiences in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;


import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-secondary to-white pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">AI-Powered Learning Platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Create Custom Courses with
            <span className="text-blue-600"> AI Technology</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Generate comprehensive, structured courses in seconds with our AI course generator.
            Just enter a topic and difficulty level to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg" onClick={() => navigate('/create-course')}>
              Create a Course
            </Button>
            <Button size="lg" variant="outline" className="text-lg" onClick={() => navigate('/my-learning')}>
              My Learning
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>
    </div>
  );
};

export default HeroSection;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Sparkles, 
  BookOpen, 
  Users, 
  Target, 
  Zap,
  ArrowRight,
  Play,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const ModernHeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demoTopic, setDemoTopic] = useState("");

  const handleDemoGenerate = () => {
    if (!demoTopic.trim()) {
      toast.error("Please enter a topic to generate a demo course");
      return;
    }
    
    if (!user) {
      toast.error("Please sign in to generate courses");
      navigate("/signin");
      return;
    }
    
    navigate("/create-course", { state: { topic: demoTopic } });
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Advanced AI creates personalized learning paths"
    },
    {
      icon: BookOpen,
      title: "Structured Learning",
      description: "Organized modules with 5-6 chapters each"
    },
    {
      icon: Target,
      title: "Adaptive Content",
      description: "Content adjusts to your learning pace"
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description: "Create complete courses in seconds"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl floating" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl floating-delayed" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-secondary/20 rounded-full blur-3xl floating" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white">
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full border animate-fade-in">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Next-Gen AI Learning Platform
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-6 animate-scale-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Learn Anything with
              <span className="block text-gradient">AI-Powered Courses</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Generate comprehensive, structured courses in seconds. From beginner to expert, 
              our AI creates personalized learning paths tailored to your goals.
            </p>
          </div>

          {/* Demo Course Generator */}
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="glass p-8 rounded-2xl border-2 border-primary/20 shadow-glow">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Try it now - Free Demo</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Enter any topic (e.g., Machine Learning, Web Development, Digital Marketing...)"
                    value={demoTopic}
                    onChange={(e) => setDemoTopic(e.target.value)}
                    className="flex-1 h-14 text-lg border-2 border-primary/20 focus:border-primary/50 bg-white/50"
                  />
                  <Button 
                    size="lg" 
                    onClick={handleDemoGenerate}
                    className="h-14 px-8 gradient-primary text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Generate Course
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  ✨ Instant AI-generated curriculum • 📚 5-6 modules • 🎯 Personalized content
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!user ? (
              <>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="text-lg px-8 py-4 gradient-primary text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Get Started Free
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/signin')}
                  className="text-lg px-8 py-4 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="text-lg px-8 py-4 gradient-primary text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/create-course')}
                  className="text-lg px-8 py-4 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                >
                  Create New Course
                  <BookOpen className="ml-2 h-5 w-5" />
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {[
              { number: "10K+", label: "Courses Generated" },
              { number: "5K+", label: "Active Learners" },
              { number: "50+", label: "Topics Covered" },
              { number: "98%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="max-w-6xl mx-auto mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground">
              Experience the future of personalized learning
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="w-12 h-12 rounded-lg gradient-primary p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default ModernHeroSection;
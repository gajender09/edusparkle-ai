import { useState, useEffect } from "react";
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
  ChevronDown,
  Rocket,
  Star,
  Cpu,
  Globe,
  Lightbulb,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const ModernHeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demoTopic, setDemoTopic] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentText, setCurrentText] = useState("");

  const typewriterTexts = [
    "Machine Learning",
    "Web Development", 
    "Digital Marketing",
    "Data Science",
    "UI/UX Design",
    "Python Programming"
  ];

  useEffect(() => {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typeEffect = () => {
      const currentFullText = typewriterTexts[textIndex];
      
      if (!isDeleting) {
        setCurrentText(currentFullText.substring(0, charIndex + 1));
        charIndex++;
        
        if (charIndex === currentFullText.length) {
          setTimeout(() => { isDeleting = true; }, 2000);
        }
      } else {
        setCurrentText(currentFullText.substring(0, charIndex - 1));
        charIndex--;
        
        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % typewriterTexts.length;
        }
      }
    };

    const timer = setInterval(typeEffect, isDeleting ? 50 : 100);
    return () => clearInterval(timer);
  }, []);

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
      title: "AI-Powered Learning",
      description: "Advanced AI creates personalized learning paths tailored to your goals",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Rocket,
      title: "Instant Generation",
      description: "Create complete courses with structured modules in seconds",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Target,
      title: "Adaptive Content",
      description: "Content dynamically adjusts to your learning pace and style",
      color: "from-pink-500 to-red-600"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Real-time analytics and progress tracking for optimal learning",
      color: "from-green-500 to-blue-600"
    }
  ];

  const stats = [
    { number: "50K+", label: "Courses Generated", icon: BookOpen },
    { number: "25K+", label: "Active Learners", icon: Users },
    { number: "100+", label: "Topics Covered", icon: Globe },
    { number: "99%", label: "Success Rate", icon: Star }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Modern Mesh Gradient Background */}
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl floating" />
        <div className="absolute top-60 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl floating-delayed" />
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl floating-slow" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl floating" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Hero Content */}
        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full border animate-fade-in glow-hover">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-gradient">
              🚀 Next-Gen AI Learning Platform - Now Live!
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-6 animate-scale-in">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-tight">
              Master{" "}
              <span className="relative">
                <span className="text-gradient">{currentText}</span>
                <span className="animate-pulse text-primary">|</span>
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400">
                with AI-Powered Courses
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Generate comprehensive, structured learning paths in seconds. From beginner to expert, 
              our AI creates personalized courses with interactive modules, quizzes, and real-time progress tracking.
            </p>
          </div>

          {/* Demo Course Generator */}
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="glass-card p-8 rounded-3xl border-2 border-primary/20 shadow-glow scale-hover">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-primary p-2 shadow-lg">
                    <Brain className="w-full h-full text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gradient">AI Course Generator</h3>
                    <p className="text-sm text-muted-foreground">Try it free - No signup required for demo</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Enter any topic (e.g., Machine Learning, React.js, Digital Marketing...)"
                    value={demoTopic}
                    onChange={(e) => setDemoTopic(e.target.value)}
                    className="flex-1 h-16 text-lg border-2 border-primary/20 focus:border-primary/50 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm"
                  />
                  <Button 
                    size="lg" 
                    onClick={handleDemoGenerate}
                    className="h-16 px-8 gradient-primary text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl glow-hover"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Generate Course
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI-Generated Curriculum
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-primary" />
                    5-6 Interactive Modules
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-primary" />
                    Personalized Content
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {!user ? (
              <>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="text-lg px-12 py-6 gradient-primary text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl scale-hover"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Learning Free
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/signin')}
                  className="text-lg px-12 py-6 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 rounded-xl backdrop-blur-sm"
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
                  className="text-lg px-12 py-6 gradient-primary text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl scale-hover"
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  My Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/create-course')}
                  className="text-lg px-12 py-6 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 rounded-xl backdrop-blur-sm"
                >
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Create New Course
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl text-center scale-hover group">
                <div className="w-12 h-12 rounded-xl gradient-primary p-2 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-full h-full text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gradient">
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
        <div className="max-w-7xl mx-auto mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="text-gradient">Eduspark</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of personalized learning with cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass-card p-8 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl group scale-hover"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gradient">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-primary/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHeroSection;
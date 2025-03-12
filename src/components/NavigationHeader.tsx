
import { GraduationCap, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const NavigationHeader = () => {
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold text-primary">EduAI</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-4">
            <Button variant="ghost">Courses</Button>
            <Button variant="ghost">My Learning</Button>
            <Button variant="ghost">Resources</Button>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button>Get Started</Button>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default NavigationHeader;

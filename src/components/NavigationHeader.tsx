
import { GraduationCap, Search, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NavigationHeader = () => {
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-primary">EduAI</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/courses">Courses</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/my-learning">My Learning</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/resources">Resources</Link>
            </Button>
            <Button variant="ghost" asChild className="flex items-center gap-1">
              <Link to="/create-course">
                <Plus className="h-4 w-4" />
                Create Course
              </Link>
            </Button>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button asChild>
              <Link to="/get-started">Get Started</Link>
            </Button>
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

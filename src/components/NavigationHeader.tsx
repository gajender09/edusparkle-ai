
import { GraduationCap, Search, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import AuthLinks from "./AuthLinks";

const NavigationHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
            <AuthLinks />
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white border-b border-gray-100 animate-fade-in">
          <nav className="flex flex-col space-y-2">
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/courses">Courses</Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/my-learning">My Learning</Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/resources">Resources</Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start flex items-center gap-1">
              <Link to="/create-course">
                <Plus className="h-4 w-4" />
                Create Course
              </Link>
            </Button>
            <div className="pt-2 border-t border-gray-100">
              <AuthLinks className="flex flex-col space-y-2" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavigationHeader;

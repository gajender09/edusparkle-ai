
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LogIn, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthLinksProps {
  className?: string;
}

const AuthLinks = ({ className }: AuthLinksProps) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  if (user) {
    return (
      <div className={`relative ${className}`}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full" 
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        >
          <User className="h-5 w-5" />
        </Button>
        
        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in z-50">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                Profile
              </Link>
              <Link to="/my-learning" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                My Learning
              </Link>
              <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                Settings
              </Link>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                role="menuitem"
                onClick={() => {
                  signOut();
                  setIsProfileMenuOpen(false);
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button variant="ghost" asChild>
        <Link to="/sign-in" className="flex items-center gap-1">
          <LogIn className="h-4 w-4" />
          Sign In
        </Link>
      </Button>
      <Button asChild>
        <Link to="/sign-up">Sign Up</Link>
      </Button>
    </div>
  );
};

export default AuthLinks;

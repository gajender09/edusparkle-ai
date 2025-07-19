import { BookOpen, Clock, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Course {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  modules?: number;
  duration?: string;
  rating?: number;
  students?: number;
  thumbnail?: string;
}

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  onEnroll?: () => void;
}

const CourseCard = ({ course, onClick, onEnroll }: CourseCardProps) => {
  const levelColors = {
    beginner: "bg-green-100 text-green-800 border-green-200",
    intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    advanced: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
      <div 
        onClick={onClick}
        className="relative overflow-hidden"
      >
        {course.thumbnail ? (
          <div className="h-48 w-full bg-gradient-to-r from-blue-500 to-purple-600 relative">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
            <BookOpen className="h-16 w-16 text-white/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}
        
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className={`${levelColors[course.level]} font-medium`}>
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
          {course.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {course.modules && (
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.modules} modules</span>
              </div>
            )}
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {course.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.rating}</span>
              </div>
            )}
            {course.students && (
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.students}+</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="flex-1"
          >
            View Details
          </Button>
          {onEnroll && (
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onEnroll();
              }}
              className="flex-1"
            >
              Start Learning
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
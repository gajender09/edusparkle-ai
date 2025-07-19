
import { useEffect, useState } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from "@/components/CourseCard";
import { BookOpen, Clock, Star, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Footer from "@/components/Footer";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  created_at: string;
  progress?: number;
}

const MyLearning = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [savedCourses, setEnrolledSaved] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, description, level, created_at')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        // For this version, we'll treat all courses as "enrolled" 
        // In a real app, you might have a separate enrollments table
        const formattedCourses = data.map(course => ({
          ...course,
          // Add a placeholder image since we don't store images yet
          image: `https://source.unsplash.com/random/800x600?${encodeURIComponent(course.title)}`,
          category: course.level.charAt(0).toUpperCase() + course.level.slice(1),
          progress: Math.floor(Math.random() * 100) // Mock progress for now
        }));

        setEnrolledCourses(formattedCourses);
        setEnrolledSaved([]);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load your courses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Learning</h1>
            <p className="text-gray-600">Track your progress and continue learning</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Recent
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Star className="h-4 w-4" /> Favorites
            </Button>
            <Button asChild className="flex items-center gap-2">
              <Link to="/create-course">
                <Plus className="h-4 w-4" /> Create Course
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="enrolled" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="enrolled" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Enrolled ({enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger value="saved">Saved ({savedCourses.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed (0)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enrolled" className="animate-fade-in">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard 
                    key={`enrolled-${course.id}`} 
                    course={{
                      id: course.id,
                      title: course.title,
                      description: course.description || "",
                      level: course.level as "beginner" | "intermediate" | "advanced",
                    }}
                    onClick={() => console.log("View course:", course.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Create your first AI-generated course to get started on your learning journey.
                </p>
                <Button asChild>
                  <Link to="/create-course">Create a Course</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="animate-fade-in">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <Star className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No saved courses</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Save courses to access them later and build your learning library.
              </p>
              <Button asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="animate-fade-in">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No completed courses yet</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                When you complete courses, they'll appear here to track your achievements.
              </p>
              <Button asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default MyLearning;

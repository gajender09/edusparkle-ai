
import { useState, useEffect } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, description, level')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const formattedCourses = data.map(course => ({
          ...course,
          image: `https://source.unsplash.com/random/800x600?${encodeURIComponent(course.title)}`,
          category: course.level.charAt(0).toUpperCase() + course.level.slice(1)
        }));

        setCourses(formattedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Explore Courses</h1>
            <p className="text-gray-600">Discover AI-generated courses across various topics</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                title={course.title}
                description={course.description || ""}
                image={`https://source.unsplash.com/random/800x600?${encodeURIComponent(course.title)}`}
                category={course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {searchQuery ? "No courses match your search criteria." : "No courses available yet. Be the first to create one!"}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Courses;

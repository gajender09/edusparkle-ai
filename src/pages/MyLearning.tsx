
import NavigationHeader from "@/components/NavigationHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from "@/components/CourseCard";
import { BookOpen, Clock, Star } from "lucide-react";

const enrolledCourses = [
  {
    title: "Introduction to Artificial Intelligence",
    description: "Learn the fundamentals of AI and machine learning with hands-on projects.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    category: "Technology",
    progress: 45,
  },
  {
    title: "Data Science Fundamentals",
    description: "Master the essential tools and techniques of modern data science.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    category: "Data Science",
    progress: 25,
  },
];

const savedCourses = [
  {
    title: "Web Development Bootcamp",
    description: "Build modern web applications from scratch with the latest technologies.",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
    category: "Programming",
    progress: 0,
  },
  {
    title: "UX/UI Design Fundamentals",
    description: "Master the principles of user experience and interface design.",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
    category: "Design",
    progress: 0,
  },
];

const MyLearning = () => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course, index) => (
                <CourseCard key={`enrolled-${index}`} {...course} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCourses.map((course, index) => (
                <CourseCard key={`saved-${index}`} {...course} />
              ))}
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
                <a href="/courses">Browse Courses</a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyLearning;

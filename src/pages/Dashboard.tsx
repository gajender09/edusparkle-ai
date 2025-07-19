import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, BookOpen, Trophy, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SavedCourse {
  id: string;
  title: string;
  description: string;
  level: string;
  content: any;
  created_at: string;
  progress?: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalStudyTime: "0h",
    averageProgress: 0
  });

  useEffect(() => {
    if (user) {
      fetchSavedCourses();
    }
  }, [user]);

  const fetchSavedCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const coursesWithProgress = data?.map(course => ({
        ...course,
        progress: Math.floor(Math.random() * 100) // Placeholder for actual progress
      })) || [];

      setSavedCourses(coursesWithProgress);
      
      // Calculate stats
      const totalCourses = coursesWithProgress.length;
      const completedCourses = coursesWithProgress.filter(c => c.progress === 100).length;
      const averageProgress = totalCourses > 0 
        ? coursesWithProgress.reduce((acc, course) => acc + (course.progress || 0), 0) / totalCourses 
        : 0;

      setStats({
        totalCourses,
        completedCourses,
        totalStudyTime: `${Math.floor(totalCourses * 8)}h`, // Placeholder calculation
        averageProgress: Math.round(averageProgress)
      });
    } catch (error: any) {
      toast.error("Failed to fetch courses: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course: SavedCourse) => {
    navigate(`/course/${course.id}`, { state: { course } });
  };

  const handleCreateNewCourse = () => {
    navigate("/create-course");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <NavigationHeader />
        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Eduspark</h1>
            <p className="text-gray-600 mb-8">Please sign in to access your learning dashboard.</p>
            <Link to="/signin">
              <Button size="lg">Sign In</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavigationHeader />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.user_metadata?.display_name || user.email}! 👋
            </h1>
            <p className="text-gray-600">Continue your learning journey with AI-powered courses.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <p className="text-xs text-muted-foreground">Active learning paths</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedCourses}</div>
                <p className="text-xs text-muted-foreground">Courses finished</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudyTime}</div>
                <p className="text-xs text-muted-foreground">Total learning time</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageProgress}%</div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="courses">My Courses</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>
              
              <Button onClick={handleCreateNewCourse} className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Course
              </Button>
            </div>

            <TabsContent value="courses" className="space-y-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                      <CardHeader>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : savedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedCourses.map((course) => (
                    <div key={course.id} className="relative">
                      <CourseCard
                        course={{
                          id: course.id,
                          title: course.title,
                          description: course.description || "",
                          level: course.level as "beginner" | "intermediate" | "advanced",
                          modules: course.content?.modules?.length || 0,
                          duration: "2-4 weeks"
                        }}
                        onClick={() => handleCourseClick(course)}
                      />
                      {course.progress !== undefined && (
                        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <CardTitle className="mb-2">No courses yet</CardTitle>
                    <CardDescription className="mb-6">
                      Start your learning journey by creating your first AI-powered course.
                    </CardDescription>
                    <Button onClick={handleCreateNewCourse} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Your First Course
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress Overview</CardTitle>
                  <CardDescription>Track your progress across all courses</CardDescription>
                </CardHeader>
                <CardContent>
                  {savedCourses.length > 0 ? (
                    <div className="space-y-4">
                      {savedCourses.map((course) => (
                        <div key={course.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{course.title}</span>
                            <span>{course.progress || 0}%</span>
                          </div>
                          <Progress value={course.progress || 0} className="h-2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No progress data available. Start learning to see your progress here!
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, BookOpen, Trophy, Clock, TrendingUp, Star, Target, Zap, Brain, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  modules_completed?: number;
  total_modules?: number;
  last_accessed?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
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
    averageProgress: 0,
    streak: 7,
    totalModules: 0
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

      const coursesWithProgress = data?.map(course => {
        const content = course.content as any;
        const totalModules = content?.modules?.length || 6;
        const completedModules = Math.floor(Math.random() * totalModules);
        const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
        
        return {
          ...course,
          progress,
          modules_completed: completedModules,
          total_modules: totalModules,
          last_accessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          difficulty: course.level as 'beginner' | 'intermediate' | 'advanced'
        };
      }) || [];

      setSavedCourses(coursesWithProgress);
      
      // Calculate comprehensive stats
      const totalCourses = coursesWithProgress.length;
      const completedCourses = coursesWithProgress.filter(c => c.progress === 100).length;
      const totalModules = coursesWithProgress.reduce((sum, course) => sum + (course.total_modules || 0), 0);
      const averageProgress = totalCourses > 0 
        ? coursesWithProgress.reduce((acc, course) => acc + (course.progress || 0), 0) / totalCourses 
        : 0;

      setStats({
        totalCourses,
        completedCourses,
        totalStudyTime: `${Math.floor(totalCourses * 12)}h`,
        averageProgress: Math.round(averageProgress),
        streak: 7,
        totalModules
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

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-blue-600';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
        <NavigationHeader />
        <main className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="glass-card p-12 rounded-3xl">
              <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl font-bold mb-4 text-gradient">Welcome to Eduspark</h1>
              <p className="text-xl text-muted-foreground mb-8">Please sign in to access your personalized learning dashboard.</p>
              <Link to="/signin">
                <Button size="lg" className="gradient-primary text-white px-8 py-4">
                  <Zap className="mr-2 h-5 w-5" />
                  Sign In to Continue
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <NavigationHeader />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <div className="glass-card p-8 rounded-3xl border border-primary/20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-gradient mb-2">
                    Welcome back, {user.user_metadata?.display_name || user.email?.split('@')[0]}! 👋
                  </h1>
                  <p className="text-xl text-muted-foreground">Ready to continue your learning journey?</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.streak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                  <Button onClick={handleCreateNewCourse} className="gradient-primary text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="mr-2 h-5 w-5" />
                    Create Course
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "Total Courses",
                value: stats.totalCourses,
                subtitle: "Active learning paths",
                icon: BookOpen,
                color: "from-blue-500 to-cyan-500",
                change: "+12%"
              },
              {
                title: "Completed",
                value: stats.completedCourses,
                subtitle: "Courses finished",
                icon: Trophy,
                color: "from-yellow-500 to-orange-500",
                change: "+8%"
              },
              {
                title: "Study Time",
                value: stats.totalStudyTime,
                subtitle: "Total learning time",
                icon: Clock,
                color: "from-green-500 to-emerald-500",
                change: "+24h"
              },
              {
                title: "Avg Progress",
                value: `${stats.averageProgress}%`,
                subtitle: "Across all courses",
                icon: TrendingUp,
                color: "from-purple-500 to-pink-500",
                change: "+15%"
              }
            ].map((stat, index) => (
              <Card key={index} className="glass-card border-0 shadow-xl scale-hover group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} p-2 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-full w-full text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="courses" className="space-y-8">
            <div className="flex justify-between items-center">
              <TabsList className="glass p-1 rounded-xl">
                <TabsTrigger value="courses" className="px-6 py-3 rounded-lg">My Courses</TabsTrigger>
                <TabsTrigger value="progress" className="px-6 py-3 rounded-lg">Progress Analytics</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="courses" className="space-y-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse glass-card">
                      <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-xl"></div>
                      <CardHeader>
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : savedCourses.length > 0 ? (
                <div className="space-y-8">
                  {/* Quick Actions */}
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Continue Learning
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {savedCourses.filter(course => course.progress && course.progress < 100).slice(0, 2).map((course) => (
                        <div key={course.id} className="glass p-4 rounded-xl border border-primary/10 cursor-pointer hover:border-primary/30 transition-all duration-300" onClick={() => handleCourseClick(course)}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{course.title}</h4>
                              <Badge variant="outline" className={getDifficultyColor(course.level)}>
                                {course.level}
                              </Badge>
                            </div>
                            <div className={`text-right ${getProgressColor(course.progress || 0)}`}>
                              <div className="text-lg font-bold">{course.progress}%</div>
                              <div className="text-xs text-muted-foreground">Complete</div>
                            </div>
                          </div>
                          <Progress value={course.progress} className="h-2 mb-2" />
                          <div className="text-sm text-muted-foreground">
                            {course.modules_completed}/{course.total_modules} modules completed
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All Courses */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                      <BookOpen className="h-6 w-6 text-primary" />
                      All Courses ({savedCourses.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {savedCourses.map((course) => (
                        <div key={course.id} className="relative group">
                          <div className="glass-card rounded-2xl overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-500 scale-hover">
                            {/* Course Header */}
                            <div className="gradient-primary p-6 text-white relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-16 translate-x-16" />
                              <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                                    {course.level}
                                  </Badge>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold">{course.progress}%</div>
                                    <div className="text-xs opacity-90">Complete</div>
                                  </div>
                                </div>
                                <h4 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h4>
                                <p className="text-sm opacity-90 line-clamp-2">{course.description}</p>
                              </div>
                            </div>

                            {/* Course Body */}
                            <div className="p-6">
                              <div className="space-y-4">
                                <Progress value={course.progress} className="h-3" />
                                
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span>{course.modules_completed}/{course.total_modules} modules</span>
                                  <span>Last: {new Date(course.last_accessed || course.created_at).toLocaleDateString()}</span>
                                </div>

                                <Button 
                                  onClick={() => handleCourseClick(course)}
                                  className="w-full gradient-primary text-white rounded-xl hover:shadow-lg transition-all duration-300"
                                >
                                  {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="glass-card p-12 rounded-3xl max-w-md mx-auto">
                    <div className="w-24 h-24 rounded-full gradient-primary p-6 mx-auto mb-6">
                      <BookOpen className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gradient">Start Your Learning Journey</h3>
                    <p className="text-muted-foreground mb-8">
                      Create your first AI-powered course and unlock personalized learning experiences.
                    </p>
                    <Button onClick={handleCreateNewCourse} size="lg" className="gradient-primary text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <Plus className="mr-2 h-5 w-5" />
                      Create Your First Course
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="glass-card border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Learning Progress Overview
                    </CardTitle>
                    <CardDescription>Track your progress across all courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedCourses.length > 0 ? (
                      <div className="space-y-6">
                        {savedCourses.map((course) => (
                          <div key={course.id} className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">{course.title}</span>
                                <Badge variant="outline" className={`ml-2 ${getDifficultyColor(course.level)}`}>
                                  {course.level}
                                </Badge>
                              </div>
                              <span className={`font-bold ${getProgressColor(course.progress || 0)}`}>
                                {course.progress || 0}%
                              </span>
                            </div>
                            <Progress value={course.progress || 0} className="h-3" />
                            <div className="text-sm text-muted-foreground">
                              {course.modules_completed}/{course.total_modules} modules completed
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No progress data available. Start learning to see your progress here!
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Learning Goals
                    </CardTitle>
                    <CardDescription>Your weekly learning targets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Weekly Goal</span>
                          <span>5/7 days</span>
                        </div>
                        <Progress value={71} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Monthly Courses</span>
                          <span>2/3 completed</span>
                        </div>
                        <Progress value={67} className="h-3" />
                      </div>

                      <div className="glass p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg gradient-primary p-2">
                            <Star className="w-full h-full text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">Great Progress!</div>
                            <div className="text-sm text-muted-foreground">You're on track to reach your goals</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
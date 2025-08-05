import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ProgressData {
  course_id: string;
  module_index: number;
  chapter_index: number;
  progress_percentage: number;
  completed_at?: string;
  time_spent?: number;
}

interface UserProgress {
  [courseId: string]: {
    [moduleIndex: number]: {
      [chapterIndex: number]: {
        completed: boolean;
        completedAt?: string;
        timeSpent: number;
      };
    };
  };
}

export const useProgressTracker = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(false);

  // Initialize progress from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`progress_${user.id}`);
      if (savedProgress) {
        try {
          setUserProgress(JSON.parse(savedProgress));
        } catch (error) {
          console.error('Error parsing saved progress:', error);
        }
      }
    }
  }, [user]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (user && Object.keys(userProgress).length > 0) {
      localStorage.setItem(`progress_${user.id}`, JSON.stringify(userProgress));
    }
  }, [user, userProgress]);

  const markChapterComplete = async (courseId: string, moduleIndex: number, chapterIndex: number, timeSpent: number = 0) => {
    if (!user) return;

    try {
      setLoading(true);

      // Update local state
      setUserProgress(prev => ({
        ...prev,
        [courseId]: {
          ...prev[courseId],
          [moduleIndex]: {
            ...prev[courseId]?.[moduleIndex],
            [chapterIndex]: {
              completed: true,
              completedAt: new Date().toISOString(),
              timeSpent
            }
          }
        }
      }));

      // Calculate overall progress for the course
      const courseProgress = calculateCourseProgress(courseId);

      toast.success('Progress saved!', {
        description: `Chapter completed. Course is ${courseProgress}% complete.`
      });

    } catch (error) {
      console.error('Error marking chapter complete:', error);
      toast.error('Failed to save progress');
    } finally {
      setLoading(false);
    }
  };

  const markChapterIncomplete = (courseId: string, moduleIndex: number, chapterIndex: number) => {
    if (!user) return;

    setUserProgress(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [moduleIndex]: {
          ...prev[courseId]?.[moduleIndex],
          [chapterIndex]: {
            completed: false,
            timeSpent: prev[courseId]?.[moduleIndex]?.[chapterIndex]?.timeSpent || 0
          }
        }
      }
    }));
  };

  const isChapterCompleted = (courseId: string, moduleIndex: number, chapterIndex: number): boolean => {
    return userProgress[courseId]?.[moduleIndex]?.[chapterIndex]?.completed || false;
  };

  const getChapterProgress = (courseId: string, moduleIndex: number, chapterIndex: number) => {
    return userProgress[courseId]?.[moduleIndex]?.[chapterIndex] || {
      completed: false,
      timeSpent: 0
    };
  };

  const calculateModuleProgress = (courseId: string, moduleIndex: number, totalChapters: number): number => {
    if (!userProgress[courseId]?.[moduleIndex]) return 0;

    const moduleData = userProgress[courseId][moduleIndex];
    const completedChapters = Object.values(moduleData).filter(chapter => chapter.completed).length;
    
    return Math.round((completedChapters / totalChapters) * 100);
  };

  const calculateCourseProgress = (courseId: string, totalModules: number = 6, chaptersPerModule: number = 6): number => {
    if (!userProgress[courseId]) return 0;

    let totalChapters = 0;
    let completedChapters = 0;

    for (let moduleIndex = 0; moduleIndex < totalModules; moduleIndex++) {
      const moduleData = userProgress[courseId][moduleIndex];
      if (moduleData) {
        for (let chapterIndex = 0; chapterIndex < chaptersPerModule; chapterIndex++) {
          totalChapters++;
          if (moduleData[chapterIndex]?.completed) {
            completedChapters++;
          }
        }
      } else {
        totalChapters += chaptersPerModule;
      }
    }

    return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  };

  const getTotalStudyTime = (courseId?: string): number => {
    if (courseId) {
      // Get study time for specific course
      const courseData = userProgress[courseId];
      if (!courseData) return 0;

      let totalTime = 0;
      Object.values(courseData).forEach(moduleData => {
        Object.values(moduleData).forEach(chapterData => {
          totalTime += chapterData.timeSpent || 0;
        });
      });
      return totalTime;
    } else {
      // Get total study time across all courses
      let totalTime = 0;
      Object.values(userProgress).forEach(courseData => {
        Object.values(courseData).forEach(moduleData => {
          Object.values(moduleData).forEach(chapterData => {
            totalTime += chapterData.timeSpent || 0;
          });
        });
      });
      return totalTime;
    }
  };

  const getCompletedCoursesCount = (): number => {
    return Object.keys(userProgress).filter(courseId => 
      calculateCourseProgress(courseId) === 100
    ).length;
  };

  const getStreakDays = (): number => {
    // This is a simplified implementation
    // In a real app, you'd track daily activity
    const recentActivity = Object.values(userProgress).some(courseData =>
      Object.values(courseData).some(moduleData =>
        Object.values(moduleData).some(chapterData =>
          chapterData.completedAt && 
          new Date(chapterData.completedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
        )
      )
    );
    
    return recentActivity ? 7 : 0; // Placeholder streak
  };

  return {
    userProgress,
    loading,
    markChapterComplete,
    markChapterIncomplete,
    isChapterCompleted,
    getChapterProgress,
    calculateModuleProgress,
    calculateCourseProgress,
    getTotalStudyTime,
    getCompletedCoursesCount,
    getStreakDays
  };
};
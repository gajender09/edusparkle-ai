export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface CourseModule {
  id: number;
  title: string;
  description: string;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: number;
  title: string;
  content: string;
  duration: string;
  keyPoints: string[];
}

export interface CourseContent {
  modules: CourseModule[];
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface RoadmapStage {
  stage: string;
  description: string;
  timeframe: string;
  skills: string[];
}

export interface CourseResources {
  books?: string[];
  articles?: string[];
  tools?: string[];
  communities?: string[];
}

export interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  displayLink?: string;
  formattedUrl?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: {
    default: string;
    medium?: string;
    high?: string;
  };
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
  likeCount?: string;
}

export interface NewsArticle {
  title: string;
  url: string;
  description: string;
  source?: string;
  publishedAt: string;
  urlToImage?: string;
}

export interface EnhancedCourseResources {
  books?: string[];
  tools?: string[];
  communities?: string[];
  articles?: (string | SearchResult)[];
  videos?: YouTubeVideo[];
  news?: NewsArticle[];
}

export interface GeneratedCourse {
  title: string;
  description: string;
  level: CourseLevel;
  content: CourseContent;
  glossary: GlossaryItem[];
  roadmap: RoadmapStage[];
  resources: EnhancedCourseResources;
}

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface CourseModule {
  title: string;
  description: string;
  lessons: {
    title: string;
    description: string;
  }[];
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface RoadmapStage {
  stage: string;
  milestones: string[];
}

export interface Resource {
  title: string;
  url: string;
}

export interface GeneratedCourse {
  title: string;
  level: CourseLevel;
  description: string;
  content: {
    modules: CourseModule[];
  };
  glossary: GlossaryItem[];
  roadmap: RoadmapStage[];
  resources: {
    articles: Resource[];
    videos: Resource[];
  };
}

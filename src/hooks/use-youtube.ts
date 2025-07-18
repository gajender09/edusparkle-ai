import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { YouTubeVideo } from "@/types/course";

export const useYouTube = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  const searchVideos = async (query: string, maxResults = 10) => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsLoading(true);
    setVideos([]);

    try {
      console.log("Searching YouTube videos:", query);
      const { data, error } = await supabase.functions.invoke("get-youtube-videos", {
        body: { query, maxResults },
      });

      if (error) {
        console.error("YouTube search error:", error);
        throw new Error(error.message || "YouTube search failed");
      }

      if (!data || !data.videos) {
        throw new Error("No videos returned");
      }

      console.log("YouTube videos found:", data.videos);
      setVideos(data.videos);
      toast.success(`Found ${data.videos.length} videos`);
    } catch (err: any) {
      console.error("Error in YouTube search:", err);
      toast.error("YouTube search failed: " + (err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    videos,
    searchVideos,
    clearVideos: () => setVideos([]),
  };
};
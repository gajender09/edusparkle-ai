import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SearchResult, NewsArticle } from "@/types/course";

export interface SearchResults {
  webResults: SearchResult[];
  newsResults: NewsArticle[];
}

export const useSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);

  const searchArticles = async (query: string, limit = 10) => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    setSearchResults(null);

    try {
      console.log("Searching for articles:", query);
      const { data, error } = await supabase.functions.invoke("search-articles", {
        body: { query, limit },
      });

      if (error) {
        console.error("Search error:", error);
        throw new Error(error.message || "Search failed");
      }

      if (!data) {
        throw new Error("No search results returned");
      }

      console.log("Search results:", data);
      setSearchResults(data);
      toast.success(`Found ${data.webResults.length + data.newsResults.length} results`);
    } catch (err: any) {
      console.error("Error in article search:", err);
      toast.error("Search failed: " + (err.message || "Unknown error"));
    } finally {
      setIsSearching(false);
    }
  };

  return {
    isSearching,
    searchResults,
    searchArticles,
    clearResults: () => setSearchResults(null),
  };
};
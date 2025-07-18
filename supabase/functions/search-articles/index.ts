import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, limit = 10 }: SearchRequest = await req.json();
    console.log('Searching for:', query);

    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
    const googleCseId = Deno.env.get('GOOGLE_CSE_ID');
    const newsApiKey = Deno.env.get('NEWS_API_KEY');

    if (!googleApiKey || !googleCseId) {
      throw new Error('Google Search API credentials not configured');
    }

    // Perform Google Custom Search
    console.log('Performing Google Custom Search...');
    const searchResponse = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCseId}&q=${encodeURIComponent(query)}&num=${Math.min(limit, 10)}`
    );

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Google Search API error:', errorText);
      throw new Error(`Google Search API error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    console.log('Google Search completed');

    let results = {
      webResults: [],
      newsResults: []
    };

    // Process web search results
    if (searchData.items) {
      results.webResults = searchData.items.map((item: any) => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet,
        displayLink: item.displayLink,
        formattedUrl: item.formattedUrl
      }));
    }

    // Get news results if News API is available
    if (newsApiKey) {
      try {
        console.log('Fetching news results...');
        const newsResponse = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&pageSize=${Math.min(limit, 10)}&apiKey=${newsApiKey}`
        );
        
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          if (newsData.articles) {
            results.newsResults = newsData.articles.map((article: any) => ({
              title: article.title,
              url: article.url,
              description: article.description,
              source: article.source.name,
              publishedAt: article.publishedAt,
              urlToImage: article.urlToImage
            }));
          }
        }
      } catch (newsError) {
        console.error('News API error:', newsError);
        // Continue without news results
      }
    }

    console.log('Search completed successfully');
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in search-articles function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Search failed',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
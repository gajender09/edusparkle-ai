import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface YouTubeRequest {
  query: string;
  maxResults?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, maxResults = 10 }: YouTubeRequest = await req.json();
    console.log('Searching YouTube for:', query);

    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');

    if (!youtubeApiKey) {
      throw new Error('YouTube API key not configured');
    }

    // Search for videos
    console.log('Calling YouTube Data API...');
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${youtubeApiKey}`
    );

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('YouTube API error:', errorText);
      throw new Error(`YouTube API error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    console.log('YouTube search completed');

    // Get video details including duration and statistics
    const videoIds = searchData.items.map((item: any) => item.id.videoId);
    
    console.log('Getting video details...');
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(',')}&key=${youtubeApiKey}`
    );

    let videoDetails = {};
    if (detailsResponse.ok) {
      const detailsData = await detailsResponse.json();
      videoDetails = detailsData.items.reduce((acc: any, item: any) => {
        acc[item.id] = {
          duration: item.contentDetails.duration,
          viewCount: item.statistics.viewCount,
          likeCount: item.statistics.likeCount
        };
        return acc;
      }, {});
    }

    // Format results
    const videos = searchData.items.map((item: any) => {
      const details = videoDetails[item.id.videoId] || {};
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: {
          default: item.snippet.thumbnails.default.url,
          medium: item.snippet.thumbnails.medium?.url,
          high: item.snippet.thumbnails.high?.url
        },
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: details.duration,
        viewCount: details.viewCount,
        likeCount: details.likeCount
      };
    });

    console.log('YouTube search completed successfully');
    return new Response(JSON.stringify({ videos }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in get-youtube-videos function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'YouTube search failed',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
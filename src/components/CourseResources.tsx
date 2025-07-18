import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Book, FileText, Wrench, Users, Play, Globe, Calendar } from "lucide-react";
import { EnhancedCourseResources } from "@/types/course";

interface CourseResourcesProps {
  resources: EnhancedCourseResources;
}

const CourseResources = ({ resources }: CourseResourcesProps) => {
  const formatDuration = (duration: string) => {
    if (!duration) return "";
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return duration;
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Articles with Search Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Articles & Web Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resources.articles?.map((article, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium mb-2 line-clamp-2">
                      {typeof article === 'string' ? article : article.title}
                    </h4>
                    {typeof article === 'object' && article.snippet && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {article.snippet}
                      </p>
                    )}
                    {typeof article === 'object' && article.displayLink && (
                      <Badge variant="outline" className="text-xs">{article.displayLink}</Badge>
                    )}
                  </div>
                  {typeof article === 'object' && article.url && (
                    <Button variant="outline" size="sm" asChild className="ml-4">
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* YouTube Videos */}
      {resources.videos && resources.videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Video Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.videos.map((video, index) => (
                <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100">
                    <img 
                      src={video.thumbnail?.medium || video.thumbnail?.default}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-sm mb-2 line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {video.channelTitle}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      {video.duration && (
                        <span>{formatDuration(video.duration)}</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href={video.url} target="_blank" rel="noopener noreferrer">
                        <Play className="h-4 w-4 mr-2" />
                        Watch
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* News Articles */}
      {resources.news && resources.news.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Latest News & Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resources.news.map((article, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {article.urlToImage && (
                      <div className="w-20 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">{article.source}</Badge>
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Books */}
      {resources.books && resources.books.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Recommended Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resources.books.map((book, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>{book}</span>
                  <Badge variant="secondary">Recommended</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tools */}
      {resources.tools && resources.tools.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Recommended Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resources.tools.map((tool, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>{tool}</span>
                  <Badge variant="outline">Tool</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Communities */}
      {resources.communities && resources.communities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Communities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resources.communities.map((community, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>{community}</span>
                  <Badge variant="outline">Community</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseResources;
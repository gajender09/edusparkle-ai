
import { ExternalLink, FileText, Video } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Resource {
  title: string;
  url: string;
}

interface CourseResourcesProps {
  resources: {
    articles: Resource[];
    videos: Resource[];
  };
}

const CourseResources = ({ resources }: CourseResourcesProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Supplementary Resources</h3>
      
      <Tabs defaultValue="articles">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Videos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles">
          <ul className="space-y-3">
            {resources.articles.map((article, index) => (
              <li key={`article-${index}`} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start justify-between group"
                >
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="font-medium group-hover:text-blue-600 transition-colors">{article.title}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </a>
              </li>
            ))}
          </ul>
        </TabsContent>
        
        <TabsContent value="videos">
          <ul className="space-y-3">
            {resources.videos.map((video, index) => (
              <li key={`video-${index}`} className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start justify-between group"
                >
                  <div className="flex items-start space-x-3">
                    <Video className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="font-medium group-hover:text-blue-600 transition-colors">{video.title}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </a>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseResources;

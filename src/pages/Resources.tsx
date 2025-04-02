
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Book, Video, Globe, FileText, ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'book' | 'video' | 'article' | 'website';
  url: string;
}

const resources: Resource[] = [
  {
    id: 1,
    title: "Machine Learning Fundamentals",
    description: "A comprehensive guide to machine learning basics and applications",
    type: "book",
    url: "https://example.com/ml-book"
  },
  {
    id: 2,
    title: "Web Development in 2023",
    description: "Learn modern web development practices and frameworks",
    type: "video",
    url: "https://example.com/web-dev-video"
  },
  {
    id: 3,
    title: "Introduction to Python Programming",
    description: "A beginner-friendly guide to Python programming language",
    type: "article",
    url: "https://example.com/python-article"
  },
  {
    id: 4,
    title: "Data Science Hub",
    description: "A collection of data science tools, tutorials, and resources",
    type: "website",
    url: "https://example.com/data-science-hub"
  },
  {
    id: 5,
    title: "Advanced JavaScript Techniques",
    description: "Master advanced JavaScript concepts and patterns",
    type: "book",
    url: "https://example.com/js-book"
  },
  {
    id: 6,
    title: "UI/UX Design Principles",
    description: "Learn essential principles for creating effective user interfaces",
    type: "video",
    url: "https://example.com/ui-ux-video"
  }
];

const ResourceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'book':
      return <Book className="h-5 w-5 text-blue-500" />;
    case 'video':
      return <Video className="h-5 w-5 text-red-500" />;
    case 'article':
      return <FileText className="h-5 w-5 text-green-500" />;
    case 'website':
      return <Globe className="h-5 w-5 text-purple-500" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Learning Resources</h1>
            <p className="text-gray-600">Curated resources to enhance your learning experience</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ResourceIcon type={resource.type} />
                  <span className="text-sm font-medium text-gray-500 capitalize">
                    {resource.type}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2" asChild>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    Visit Resource <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Resources;

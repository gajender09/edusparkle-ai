import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import SearchInterface from "@/components/SearchInterface";

const Resources = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Learning Resources</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover helpful resources, articles, videos, and current news to enhance your learning journey. 
            Search for any topic to find relevant educational content.
          </p>
        </div>
        <SearchInterface />
      </div>
      <Footer />
    </div>
  );
};

export default Resources;
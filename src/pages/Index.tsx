
import NavigationHeader from "@/components/NavigationHeader";
import HeroSection from "@/components/HeroSection";
import CourseCard from "@/components/CourseCard";

const featuredCourses = [
  {
    title: "Introduction to Artificial Intelligence",
    description: "Learn the fundamentals of AI and machine learning with hands-on projects.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    category: "Technology",
    progress: 45,
  },
  {
    title: "Data Science Fundamentals",
    description: "Master the essential tools and techniques of modern data science.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    category: "Data Science",
  },
  {
    title: "Web Development Bootcamp",
    description: "Build modern web applications from scratch with the latest technologies.",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
    category: "Programming",
    progress: 75,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <main>
        <HeroSection />
        
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Featured Courses</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;

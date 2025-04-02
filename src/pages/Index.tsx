
import NavigationHeader from "@/components/NavigationHeader";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DevelopersSection from "@/components/DevelopersSection";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <DevelopersSection />
      </main>
    </div>
  );
};

export default Index;

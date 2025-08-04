
import NavigationHeader from "@/components/NavigationHeader";
import ModernHeroSection from "@/components/ModernHeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DevelopersSection from "@/components/DevelopersSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main>
        <ModernHeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <DevelopersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;


import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { Brain, GraduationCap, Users, Rocket, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-b from-secondary to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About EduAI</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to transform education through artificial intelligence, 
              making personalized learning accessible to everyone.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  EduAI was founded in 2023 by a team of educators and AI enthusiasts who saw the potential 
                  of artificial intelligence to revolutionize how people learn. We recognized that 
                  traditional education often follows a one-size-fits-all approach, which doesn't 
                  address the unique learning needs of each individual.
                </p>
                <p className="text-gray-600 mb-4">
                  Our AI-powered platform was designed to bridge this gap by creating personalized, 
                  comprehensive courses tailored to each learner's interests and skill level.
                </p>
                <p className="text-gray-600">
                  Today, we're proud to help thousands of students and professionals enhance their 
                  knowledge and skills through our AI-generated courses and resources.
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-8">
                <div className="flex items-center mb-6">
                  <GraduationCap className="h-12 w-12 text-primary" />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">Our Vision</h3>
                    <p className="text-gray-600">A world where quality education is accessible to everyone</p>
                  </div>
                </div>
                <div className="flex items-center mb-6">
                  <Brain className="h-12 w-12 text-primary" />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">Our Mission</h3>
                    <p className="text-gray-600">To leverage AI in creating personalized learning experiences</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-12 w-12 text-primary" />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">Our Values</h3>
                    <p className="text-gray-600">Innovation, accessibility, quality, and continuous improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose EduAI</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
                <p className="text-gray-600">
                  Our platform uses advanced AI technologies to create customized courses that adapt to your learning style and pace.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Diverse Topics</h3>
                <p className="text-gray-600">
                  Explore courses across a wide range of subjects, from programming and data science to art and literature.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <Rocket className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Continuous Improvement</h3>
                <p className="text-gray-600">
                  We're constantly enhancing our AI technology to provide more accurate, relevant, and engaging learning experiences.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;


import { Star } from "lucide-react";

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

const Testimonial = ({ name, role, content, avatar, rating }: TestimonialProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex gap-1 mb-2">
      {Array(5).fill(0).map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
    <p className="text-gray-700 mb-6">"{content}"</p>
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full overflow-hidden">
        <img src={avatar} alt={name} className="h-full w-full object-cover" />
      </div>
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "David Williams",
      role: "Software Developer",
      content: "The AI-generated courses have been a game changer for my professional development. I created a Python machine learning course that was surprisingly comprehensive.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      rating: 5
    },
    {
      name: "Jennifer Lopez",
      role: "Marketing Manager",
      content: "I needed to learn digital marketing quickly, and this platform made it so easy. The personalized roadmap helped me track my progress effectively.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      rating: 4
    },
    {
      name: "Michael Chen",
      role: "Student",
      content: "As a student on a budget, having access to quality learning resources is invaluable. The AI course generator helped me create study materials for difficult subjects.",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop",
      rating: 5
    }
  ];

  return (
    <section className="py-16" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our AI course generator is transforming learning experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

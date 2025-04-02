
import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeveloperProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const Developer = ({ name, role, bio, image, links }: DeveloperProps) => (
  <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover"
      />
    </div>
    <h3 className="text-xl font-bold">{name}</h3>
    <p className="text-primary mb-2">{role}</p>
    <p className="text-gray-600 mb-4">{bio}</p>
    <div className="flex gap-3">
      {links.github && (
        <a href={links.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
          <Github className="h-5 w-5" />
        </a>
      )}
      {links.linkedin && (
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
          <Linkedin className="h-5 w-5" />
        </a>
      )}
      {links.twitter && (
        <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
          <Twitter className="h-5 w-5" />
        </a>
      )}
    </div>
  </div>
);

const DevelopersSection = () => {
  const developers = [
    {
      name: "Alex Morgan",
      role: "Lead Developer",
      bio: "Full-stack developer with a passion for AI and education technology.",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop",
      links: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    },
    {
      name: "Sarah Chen",
      role: "AI Specialist",
      bio: "ML engineer focused on natural language processing and educational content generation.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
      links: {
        github: "https://github.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      name: "Marcus Johnson",
      role: "UX/UI Designer",
      bio: "Designer with experience in creating intuitive and accessible learning interfaces.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      links: {
        github: "https://github.com",
        twitter: "https://twitter.com"
      }
    },
    {
      name: "Elena Rodriguez",
      role: "Education Consultant",
      bio: "Former teacher bringing practical educational expertise to our platform design.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop",
      links: {
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    }
  ];

  return (
    <section className="py-16 bg-white" id="team">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the talented individuals behind our AI course generation platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {developers.map((developer, index) => (
            <Developer key={index} {...developer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Interested in joining our team?</p>
          <Button variant="outline">View Career Opportunities</Button>
        </div>
      </div>
    </section>
  );
};

export default DevelopersSection;

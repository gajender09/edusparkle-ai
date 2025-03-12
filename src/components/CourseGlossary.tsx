
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

interface GlossaryItem {
  term: string;
  definition: string;
}

interface CourseGlossaryProps {
  glossary: GlossaryItem[];
}

const CourseGlossary = ({ glossary }: CourseGlossaryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredGlossary = glossary.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Key Terms & Definitions</h3>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <Input
          type="search"
          placeholder="Search glossary..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="space-y-4">
        {filteredGlossary.length > 0 ? (
          filteredGlossary.map((item, index) => (
            <div key={`glossary-${index}`} className="border-b pb-4 last:border-b-0">
              <dt className="font-medium text-primary">{item.term}</dt>
              <dd className="mt-1 text-gray-600">{item.definition}</dd>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            No matching terms found
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseGlossary;

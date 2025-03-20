
import { Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseLevel } from "@/types/course";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CourseFormProps {
  title: string;
  setTitle: (title: string) => void;
  level: CourseLevel;
  setLevel: (level: CourseLevel) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

const CourseForm = ({
  title,
  setTitle,
  level,
  setLevel,
  onGenerate,
  isGenerating,
  error
}: CourseFormProps) => {
  return (
    <div className="bg-gradient-to-r from-secondary to-white p-8 rounded-lg mb-8">
      <div className="mb-6 flex items-center gap-3">
        <Brain className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">AI Course Generator</h1>
      </div>
      <p className="text-gray-600 mb-6">
        Create a customized course with AI-generated content, glossary, roadmap, and resources.
        Just provide a course title and select the difficulty level.
      </p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <Label htmlFor="course-title">Course Title</Label>
            <Input 
              id="course-title"
              placeholder="e.g., Machine Learning, Web Development, Photography"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              disabled={isGenerating}
            />
          </div>
          <div>
            <Label htmlFor="course-level">Level</Label>
            <Select 
              disabled={isGenerating}
              value={level} 
              onValueChange={(value) => setLevel(value as CourseLevel)}
            >
              <SelectTrigger id="course-level" className="mt-1">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating} 
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <span className="animate-pulse mr-2">⚙️</span>
              Generating Course...
            </>
          ) : "Generate AI Course"}
        </Button>
        
        {isGenerating && (
          <p className="text-sm text-gray-500 text-center mt-2">
            This may take up to 30 seconds as we create your customized course
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseForm;

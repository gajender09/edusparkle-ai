
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  progress?: number;
}

const CourseCard = ({ title, description, image, category, progress = 0 }: CourseCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Badge className="mb-2" variant="secondary">{category}</Badge>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </CardContent>
      {progress > 0 && (
        <CardFooter className="p-4 pt-0">
          <div className="w-full">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CourseCard;

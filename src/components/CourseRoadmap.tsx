
import { CheckCircle2 } from "lucide-react";

interface RoadmapStage {
  stage: string;
  description: string;
  timeframe: string;
  skills: string[];
  milestones?: string[];
}

interface CourseRoadmapProps {
  roadmap: RoadmapStage[];
}

const CourseRoadmap = ({ roadmap }: CourseRoadmapProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Learning Roadmap</h3>
      
      <div className="relative border-l-2 border-blue-200 pl-8 py-2 ml-4">
        {roadmap.map((stage, stageIndex) => (
          <div 
            key={`stage-${stageIndex}`} 
            className="mb-8 last:mb-0"
          >
            {/* Stage marker */}
            <div className="absolute -left-3.5 mt-1.5 rounded-full border-4 border-white">
              <div className={`h-6 w-6 rounded-full ${getStageColor(stageIndex)}`} />
            </div>
            
            <div className="mb-2">
              <h4 className="text-lg font-medium">{stage.stage}</h4>
              <p className="text-sm text-gray-500">
                {stageIndex === 0 ? "Start here" : 
                 stageIndex === roadmap.length - 1 ? "Final stage" : 
                 `Stage ${stageIndex + 1}`}
              </p>
            </div>
            
            <div className="mb-3 text-gray-600">
              <p>{stage.description}</p>
              <span className="text-sm text-blue-600 font-medium">Duration: {stage.timeframe}</span>
            </div>
            
            <ul className="mt-4 space-y-3">
              {stage.skills.map((skill, skillIndex) => (
                <li 
                  key={`skill-${stageIndex}-${skillIndex}`}
                  className="flex items-start gap-2"
                >
                  <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get different colors for each stage
function getStageColor(index: number): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-amber-500",
    "bg-rose-500",
  ];
  return colors[index % colors.length];
}

export default CourseRoadmap;

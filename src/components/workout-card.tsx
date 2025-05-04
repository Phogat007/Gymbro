
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Exercise } from "@/lib/store";
import { Link } from "react-router-dom";
import { Clock, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkoutCardProps {
  title: string;
  exercises: Exercise[];
  cta?: {
    label: string;
    to: string;
  };
  className?: string;
  date?: string;
  completed?: boolean;
  onClick?: () => void;
}

export function WorkoutCard({ title, exercises, cta, className, date, completed, onClick }: WorkoutCardProps) {
  // Calculate estimated time: about 5 minutes per exercise
  const estimatedTime = exercises.length * 5;
  
  const getTargetMuscleGroups = () => {
    const muscleGroups = new Set(
      exercises.flatMap(exercise => exercise.targetMuscles || [])
    );
    return Array.from(muscleGroups).slice(0, 3); // Show max 3 muscle groups
  };

  const targetMuscles = getTargetMuscleGroups();
  
  return (
    <Card className={cn("border-orange/20 hover:border-orange/30 transition-colors", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 border-orange/50 text-orange">
            <Clock className="h-3.5 w-3.5" />
            {estimatedTime} min
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Dumbbell className="h-3.5 w-3.5" />
              <span>{exercises.length} exercises</span>
            </div>
            {targetMuscles.length > 0 && (
              <>
                <span className="mx-1 hidden xs:inline">·</span>
                <span className="flex-wrap">
                  <span className="mr-1 xs:hidden">•</span>
                  <span>Targets: {targetMuscles.join(", ")}</span>
                </span>
              </>
            )}
          </div>
          
          <ul className="space-y-2 mt-3">
            {exercises.map((exercise, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange/10 text-orange text-xs">
                  {index + 1}
                </span>
                <span className="flex-1 truncate">{exercise.name}</span>
                <span className="text-muted-foreground whitespace-nowrap">
                  3 × 10-12
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {cta && (
          <Button asChild className="w-full" size="sm">
            <Link to={cta.to}>
              {cta.label}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

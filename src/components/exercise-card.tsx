
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Exercise } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  exercise: Exercise;
  className?: string;
  onClick?: () => void;
}

export function ExerciseCard({ exercise, className, onClick }: ExerciseCardProps) {
  return (
    <Card 
      className={cn("h-full", className, onClick && "cursor-pointer hover:shadow-md transition-all duration-200")}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{exercise.name}</CardTitle>
          <Badge className="capitalize">
            {exercise.category.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <p className="text-sm text-muted-foreground">Target muscles:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {exercise.targetMuscles.map((muscle, index) => (
              <Badge key={index} variant="outline" className="capitalize">
                {muscle}
              </Badge>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {exercise.instructions}
        </p>
      </CardContent>
    </Card>
  );
}

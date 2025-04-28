
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Exercise } from "@/lib/store";
import { cn } from "@/lib/utils";

interface WorkoutCardProps {
  title: string;
  exercises: Exercise[];
  completed?: boolean;
  date?: string;
  className?: string;
  cta?: {
    label: string;
    to: string;
  };
}

export function WorkoutCard({ title, exercises, completed, date, className, cta }: WorkoutCardProps) {
  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          {completed && (
            <Badge variant="default" className="bg-green text-white">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        {date && <p className="text-sm text-muted-foreground">{date}</p>}
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {exercises.slice(0, 4).map((exercise) => (
            <li key={exercise.id} className="flex items-center text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-orange mr-2"></span>
              <span>{exercise.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {exercise.category.replace('_', ' ')}
              </span>
            </li>
          ))}
          {exercises.length > 4 && (
            <li className="text-xs text-muted-foreground pl-4">
              +{exercises.length - 4} more exercises
            </li>
          )}
        </ul>
      </CardContent>
      {cta && (
        <CardFooter>
          <Button asChild variant="outline" className="w-full group">
            <Link to={cta.to}>
              {cta.label}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

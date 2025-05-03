
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Exercise } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface WorkoutCardProps {
  title: string;
  exercises: Exercise[];
  completed?: boolean;
  date?: string;
  className?: string;
  onClick?: () => void;
  cta?: {
    label: string;
    to: string;
  };
}

export function WorkoutCard({ title, exercises, completed, date, className, cta, onClick }: WorkoutCardProps) {
  const categoryColors = {
    'upper_body': 'text-blue',
    'lower_body': 'text-green',
    'full_body': 'text-purple',
    'core': 'text-orange',
    'cardio': 'text-red-500'
  };

  const exerciseLength = exercises.length;

  return (
    <Card className={cn("h-full flex flex-col transition-all duration-200 hover:shadow-card-hover", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2 group">
            {title}
            {completed && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="default" className="bg-green text-white ml-2">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You've completed this workout!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardTitle>
        </div>
        {date && <p className="text-sm text-muted-foreground">{date}</p>}
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <ul className="space-y-3">
          {exercises.slice(0, 4).map((exercise) => (
            <li key={exercise.id} className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-md transition-colors">
              <div className="flex items-center">
                <span className={cn("h-2 w-2 rounded-full mr-2", 
                  {
                    "bg-blue": exercise.category === "upper_body",
                    "bg-green": exercise.category === "lower_body",
                    "bg-purple": exercise.category === "full_body",
                    "bg-orange": exercise.category === "core",
                    "bg-red-500": exercise.category === "cardio"
                  }
                )}></span>
                <span>{exercise.name}</span>
              </div>
              
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Badge variant="outline" className={cn(
                    "ml-auto text-xs font-normal cursor-pointer", 
                    categoryColors[exercise.category as keyof typeof categoryColors]
                  )}>
                    {exercise.category.replace('_', ' ')}
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{exercise.name}</h4>
                      <p className="text-sm">
                        {exercise.description || "Focuses on the " + exercise.category.replace('_', ' ') + " muscles."}
                      </p>
                      <div className="flex items-center pt-2">
                        <Info className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">
                          {exercise.difficulty === 'easy' ? 'Beginner friendly' : 
                          exercise.difficulty === 'medium' ? 'Intermediate level' : 
                          'Advanced exercise'}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </li>
          ))}
          {exerciseLength > 4 && (
            <li className="text-xs text-muted-foreground pl-4 pt-1">
              +{exerciseLength - 4} more exercises
            </li>
          )}
        </ul>
      </CardContent>
      {cta && (
        <CardFooter className="pt-2">
          <Button asChild variant="default" className="w-full group" onClick={onClick}>
            <Link to={cta.to} className="flex items-center justify-center">
              {cta.label}
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

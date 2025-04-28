
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { Challenge } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  challenge: Challenge;
  className?: string;
  onJoin?: (id: string) => void;
  onUpdate?: (id: string, progress: number) => void;
}

export function ChallengeCard({ challenge, className, onJoin, onUpdate }: ChallengeCardProps) {
  const isActive = !!challenge.startDate && !challenge.completed;
  const isCompleted = challenge.completed;

  const handleUpdateProgress = () => {
    if (onUpdate && isActive) {
      // Increment progress by 10% (for demo purposes)
      const newProgress = Math.min(100, challenge.progress + 10);
      onUpdate(challenge.id, newProgress);
    }
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          {challenge.name}
          {isCompleted && <Trophy className="h-4 w-4 ml-2 text-orange" />}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{challenge.duration} days</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm">{challenge.description}</p>
        
        {isActive && (
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs">Progress</span>
              <span className="text-xs font-bold">{challenge.progress}%</span>
            </div>
            <Progress value={challenge.progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isActive && !isCompleted && (
          <Button 
            onClick={() => onJoin && onJoin(challenge.id)} 
            className="w-full"
            variant="outline"
          >
            Start Challenge
          </Button>
        )}
        {isActive && (
          <Button 
            onClick={handleUpdateProgress} 
            className="w-full"
            variant={challenge.progress < 100 ? "default" : "outline"}
          >
            {challenge.progress < 100 ? "Update Progress" : "Complete Challenge"}
          </Button>
        )}
        {isCompleted && (
          <Button 
            className="w-full bg-green hover:bg-green-dark" 
            disabled
          >
            Challenge Completed!
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

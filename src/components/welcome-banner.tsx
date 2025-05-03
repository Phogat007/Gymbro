
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomeBannerProps {
  userName?: string;
  streakDays: number;
}

export function WelcomeBanner({ userName = "Fitness Enthusiast", streakDays }: WelcomeBannerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Get the current day and date
  const currentDate = new Date();
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentDate);
  const date = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(currentDate);

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 border-orange/20 bg-gradient-to-r from-orange/5 to-orange/10",
      isExpanded ? "mb-6" : "mb-4 cursor-pointer"
    )}>
      <div 
        className={cn(
          "flex items-center justify-between p-4",
          !isExpanded && "border-b-0"
        )}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">{greeting}, {userName}!</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span className="sr-only">{isExpanded ? "Collapse" : "Expand"}</span>
        </Button>
      </div>
      
      {isExpanded && (
        <CardContent className="animate-fade-in pt-2 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-muted-foreground">It's {day}, {date}</p>
              {streakDays > 0 && (
                <p className="flex items-center mt-2 text-orange font-medium">
                  <Calendar className="h-4 w-4 mr-1" />
                  {streakDays} day{streakDays !== 1 ? "s" : ""} streak! Keep it up!
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-orange/50 hover:bg-orange/10">
                View Progress
              </Button>
              <Button size="sm">Start Workout</Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

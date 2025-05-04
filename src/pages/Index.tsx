
import { useGym, FitnessGoal } from "@/lib/store";
import { useEffect, useState } from "react";
import { WorkoutCard } from "@/components/workout-card";
import { StatsCard } from "@/components/stats-card";
import { QuoteBanner } from "@/components/quote-banner";
import { 
  Dumbbell, 
  BarChart, 
  Calendar, 
  Flame, 
  Trophy,
  Apple
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const goalLabels: Record<FitnessGoal, string> = {
  gain_muscle: "Build Muscle",
  lose_fat: "Lose Fat",
  stay_fit: "Stay Fit"
};

export default function Index() {
  const { 
    userData, 
    updateUserGoal, 
    getRecommendedWorkout 
  } = useGym();
  
  const [activeTab, setActiveTab] = useState<FitnessGoal>(userData.fitnessGoal);
  const recommendedWorkout = getRecommendedWorkout();
  
  // Update user goal when tab changes
  useEffect(() => {
    updateUserGoal(activeTab);
    
    toast({
      title: "Fitness goal updated",
      description: `Your goal is now set to: ${goalLabels[activeTab]}`,
    });
  }, [activeTab]);

  const totalWorkouts = userData.workouts.length;
  const completedChallenges = userData.challenges.filter(c => c.completed).length;
  const streakDays = userData.streakDays;
  
  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome to Gym Mate</h1>
          <p className="text-muted-foreground">Your personal fitness companion</p>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as FitnessGoal)} 
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="gain_muscle">Build Muscle</TabsTrigger>
            <TabsTrigger value="lose_fat">Lose Fat</TabsTrigger>
            <TabsTrigger value="stay_fit">Stay Fit</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Workouts" 
          value={totalWorkouts} 
          icon={<Dumbbell className="h-4 w-4" />}
        />
        <StatsCard 
          title="Active Streak" 
          value={`${streakDays} days`} 
          icon={<Flame className="h-4 w-4" />}
        />
        <StatsCard 
          title="Challenges Completed" 
          value={completedChallenges} 
          icon={<Trophy className="h-4 w-4" />}
        />
        <StatsCard 
          title="Workout History" 
          value="View Stats" 
          icon={<BarChart className="h-4 w-4" />}
          className="cursor-pointer hover:shadow-md transition-all"
        />
      </div>

      <QuoteBanner />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={cn("md:col-span-2", "h-full")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recommended Workout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WorkoutCard 
              title={recommendedWorkout.title}
              exercises={recommendedWorkout.exercises}
              cta={{
                label: "Start Workout",
                to: "/workouts"
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/exercises">
                <Dumbbell className="h-4 w-4 mr-2" />
                Browse Exercises
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/progress">
                <BarChart className="h-4 w-4 mr-2" />
                View Progress
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/challenges">
                <Trophy className="h-4 w-4 mr-2" />
                Join Challenges
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/diet">
                <Apple className="h-4 w-4 mr-2" />
                Diet Suggestions
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

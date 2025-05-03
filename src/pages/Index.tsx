
import { useGym, FitnessGoal } from "@/lib/store";
import { useEffect, useState } from "react";
import { WorkoutCard } from "@/components/workout-card";
import { StatsCard } from "@/components/stats-card";
import { QuoteBanner } from "@/components/quote-banner";
import { WelcomeBanner } from "@/components/welcome-banner";
import { 
  Dumbbell, 
  BarChart, 
  Calendar, 
  Flame, 
  Trophy,
  Apple,
  Zap,
  Clock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const goalLabels: Record<FitnessGoal, string> = {
  gain_muscle: "Build Muscle",
  lose_fat: "Lose Fat",
  stay_fit: "Stay Fit"
};

const goalDescriptions: Record<FitnessGoal, string> = {
  gain_muscle: "Focus on resistance training and progressive overload",
  lose_fat: "Combine cardio with strength training for optimal results",
  stay_fit: "Maintain a balanced approach to fitness and activity"
};

const goalIcons: Record<FitnessGoal, React.ReactNode> = {
  gain_muscle: <Dumbbell className="h-5 w-5 text-purple" />,
  lose_fat: <Flame className="h-5 w-5 text-orange" />,
  stay_fit: <Zap className="h-5 w-5 text-blue" />
};

export default function Index() {
  const { 
    userData, 
    updateUserGoal, 
    getRecommendedWorkout 
  } = useGym();
  
  const [activeTab, setActiveTab] = useState<FitnessGoal>(userData.fitnessGoal);
  const [isLoading, setIsLoading] = useState(false);
  const recommendedWorkout = getRecommendedWorkout();
  
  // Update user goal when tab changes
  useEffect(() => {
    if (activeTab !== userData.fitnessGoal) {
      setIsLoading(true);
      
      // Simulate a loading state for better UX
      setTimeout(() => {
        updateUserGoal(activeTab);
        
        toast({
          title: "Fitness goal updated",
          description: `Your goal is now set to: ${goalLabels[activeTab]}`,
          duration: 3000,
        });
        
        setIsLoading(false);
      }, 500);
    }
  }, [activeTab]);

  const totalWorkouts = userData.workouts.length;
  const completedChallenges = userData.challenges.filter(c => c.completed).length;
  const streakDays = userData.streakDays;
  
  const lastWorkoutDate = userData.workouts.length > 0 
    ? new Date(userData.workouts[userData.workouts.length - 1].date).toLocaleDateString() 
    : null;
  
  return (
    <div className="container py-6 space-y-6">
      <WelcomeBanner streakDays={streakDays} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-orange/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 text-orange mr-2" />
              Fitness Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={(v) => setActiveTab(v as FitnessGoal)} 
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full mb-4">
                <TabsTrigger value="gain_muscle" disabled={isLoading}>Build Muscle</TabsTrigger>
                <TabsTrigger value="lose_fat" disabled={isLoading}>Lose Fat</TabsTrigger>
                <TabsTrigger value="stay_fit" disabled={isLoading}>Stay Fit</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="animate-fade-in">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-md bg-muted/50">
                    {goalIcons[activeTab]}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{goalLabels[activeTab]}</h3>
                    <p className="text-muted-foreground">{goalDescriptions[activeTab]}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 text-orange mr-2" />
              Latest Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastWorkoutDate ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last workout</p>
                    <p className="text-lg font-medium">{lastWorkoutDate}</p>
                  </div>
                  <Badge variant="outline" className="border-green text-green">Completed</Badge>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/progress">
                    View Workout History
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">No workouts completed yet</p>
                <Button asChild size="sm">
                  <Link to="/workouts">Start Your First Workout</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Workouts" 
          value={totalWorkouts} 
          icon={<Dumbbell className="h-4 w-4" />}
          className="animate-fade-in [animation-delay:100ms]"
        />
        <StatsCard 
          title="Active Streak" 
          value={`${streakDays} days`} 
          icon={<Flame className="h-4 w-4" />}
          className="animate-fade-in [animation-delay:200ms]"
        />
        <StatsCard 
          title="Challenges Completed" 
          value={completedChallenges} 
          icon={<Trophy className="h-4 w-4" />}
          className="animate-fade-in [animation-delay:300ms]"
        />
        <StatsCard 
          title="Workout History" 
          value="View Stats" 
          icon={<BarChart className="h-4 w-4" />}
          className="cursor-pointer hover:shadow-md transition-all animate-fade-in [animation-delay:400ms]"
          onClick={() => window.location.href = "/progress"}
        />
      </div>

      <QuoteBanner />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={cn("md:col-span-2", "h-full border-orange/20 hover:border-orange/30 transition-colors")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange" />
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
              className="border-none shadow-none"
            />
          </CardContent>
        </Card>
        
        <Card className="h-full border-orange/20 hover:border-orange/30 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-orange" />
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start group" variant="outline">
              <Link to="/exercises">
                <Dumbbell className="h-4 w-4 mr-2 group-hover:text-orange transition-colors" />
                Browse Exercises
              </Link>
            </Button>
            <Button asChild className="w-full justify-start group" variant="outline">
              <Link to="/progress">
                <BarChart className="h-4 w-4 mr-2 group-hover:text-orange transition-colors" />
                View Progress
              </Link>
            </Button>
            <Button asChild className="w-full justify-start group" variant="outline">
              <Link to="/challenges">
                <Trophy className="h-4 w-4 mr-2 group-hover:text-orange transition-colors" />
                Join Challenges
              </Link>
            </Button>
            <Button asChild className="w-full justify-start group" variant="outline">
              <Link to="/diet">
                <Apple className="h-4 w-4 mr-2 group-hover:text-orange transition-colors" />
                Diet Suggestions
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

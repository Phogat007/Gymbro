
import { useGym, WorkoutCategory } from "@/lib/store";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/stats-card";
import { 
  Calendar,
  Trophy, 
  Dumbbell,
  Activity,
  PieChart as ChartPieIcon,
  LineChart as ChartLineIcon,
  Radar as RadarIcon,
} from "lucide-react";
import { format, subDays, eachDayOfInterval, startOfWeek } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProgressWorkoutFrequency } from "@/components/progress/workout-frequency";
import { ProgressVolumeByCategory } from "@/components/progress/volume-by-category";
import { ProgressWeightOverTime } from "@/components/progress/weight-over-time";
import { ProgressWorkoutDistribution } from "@/components/progress/workout-distribution";
import { ProgressMuscleCoverage } from "@/components/progress/muscle-coverage";
import { ProgressWorkoutHeatmap } from "@/components/progress/workout-heatmap";

type TimeRange = '7days' | '30days' | '90days' | 'all';

export interface ProgressChartData {
  workoutFrequencyData: Array<{ date: string; workouts: number }>;
  volumeData: Array<{ category: string; volume: number }>;
  workoutDistribution: Array<{ name: string; value: number }>;
  weightProgressionData: Array<{ date: string; [exerciseId: string]: number }>;
  muscleCoverageData: Array<{ muscle: string; coverage: number }>;
  heatmapData: Array<{ date: string; count: number }>;
  totalWorkouts: number;
  completedWorkouts: number;
  totalVolume: number;
  activeDays: number;
}

export default function Progress() {
  const { userData, exercises } = useGym();
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [selectedTab, setSelectedTab] = useState('frequency');
  
  // Calculate data for charts
  const chartData = useMemo<ProgressChartData>(() => {
    const now = new Date();
    let startDate: Date;
    
    switch(timeRange) {
      case '7days':
        startDate = subDays(now, 7);
        break;
      case '30days':
        startDate = subDays(now, 30);
        break;
      case '90days':
        startDate = subDays(now, 90);
        break;
      case 'all':
      default:
        startDate = new Date(0); // Beginning of time
    }
    
    // Filter workouts within time range
    const filteredWorkouts = userData.workouts.filter(w => 
      new Date(w.date) >= startDate && new Date(w.date) <= now
    );

    // Workouts by date
    const workoutsByDate = filteredWorkouts.reduce((acc, workout) => {
      const date = workout.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Workout volume by category
    const volumeByCategory: Record<WorkoutCategory, number> = {
      upper_body: 0,
      lower_body: 0,
      full_body: 0,
      core: 0,
      cardio: 0
    };
    
    // Calculate volume (weight × reps)
    filteredWorkouts.forEach(workout => {
      workout.exercises.forEach(workoutEx => {
        const exercise = exercises.find(ex => ex.id === workoutEx.exerciseId);
        if (exercise) {
          const category = exercise.category;
          const volume = workoutEx.sets.reduce((sum, set) => 
            sum + (set.weight * set.reps), 0
          );
          volumeByCategory[category] += volume;
        }
      });
    });
    
    // Format data for charts
    const workoutFrequencyData = Object.entries(workoutsByDate)
      .map(([date, count]) => ({
        date: format(new Date(date), 'MMM d'),
        workouts: count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    const volumeData = Object.entries(volumeByCategory)
      .map(([category, volume]) => ({
        category: category.replace('_', ' '),
        volume
      }))
      .sort((a, b) => b.volume - a.volume);
    
    // Workout distribution for pie chart
    const totalWorkoutsByCategory: Record<string, number> = {};
    
    filteredWorkouts.forEach(workout => {
      workout.exercises.forEach(workoutEx => {
        const exercise = exercises.find(ex => ex.id === workoutEx.exerciseId);
        if (exercise) {
          const category = exercise.category.replace('_', ' ');
          if (!totalWorkoutsByCategory[category]) {
            totalWorkoutsByCategory[category] = 0;
          }
          totalWorkoutsByCategory[category] += 1;
        }
      });
    });
    
    const workoutDistribution = Object.entries(totalWorkoutsByCategory)
      .map(([name, value]) => ({ name, value }));
      
    // Weight progression over time for line chart
    const exerciseProgress: Record<string, Record<string, number>> = {};
    
    filteredWorkouts.forEach(workout => {
      const workoutDate = format(new Date(workout.date), 'MMM d');
      
      workout.exercises.forEach(workoutEx => {
        const exercise = exercises.find(ex => ex.id === workoutEx.exerciseId);
        if (exercise) {
          if (!exerciseProgress[workoutDate]) {
            exerciseProgress[workoutDate] = {};
          }
          
          // Find the max weight for this exercise on this date
          const maxWeight = Math.max(...workoutEx.sets.map(set => set.weight));
          exerciseProgress[workoutDate][exercise.id] = maxWeight;
        }
      });
    });
    
    const weightProgressionData = Object.entries(exerciseProgress)
      .map(([date, exercises]) => ({
        date,
        ...exercises
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Muscle coverage data for radar chart
    const muscleUsage: Record<string, number> = {};
    
    filteredWorkouts.forEach(workout => {
      workout.exercises.forEach(workoutEx => {
        const exercise = exercises.find(ex => ex.id === workoutEx.exerciseId);
        if (exercise) {
          exercise.targetMuscles.forEach(muscle => {
            if (!muscleUsage[muscle]) {
              muscleUsage[muscle] = 0;
            }
            muscleUsage[muscle] += 1;
          });
        }
      });
    });
    
    // Normalize to 0-100 scale
    const maxMuscleUsage = Math.max(1, ...Object.values(muscleUsage));
    const muscleCoverageData = Object.entries(muscleUsage)
      .map(([muscle, count]) => ({
        muscle,
        coverage: Math.round((count / maxMuscleUsage) * 100)
      }));
    
    // Calendar heatmap data
    let dateInterval = eachDayOfInterval({
      start: startDate,
      end: now
    });
    
    const heatmapData = dateInterval.map(date => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      return {
        date: formattedDate,
        count: workoutsByDate[formattedDate] || 0
      };
    });
    
    return {
      workoutFrequencyData,
      volumeData,
      workoutDistribution,
      weightProgressionData,
      muscleCoverageData,
      heatmapData,
      totalWorkouts: filteredWorkouts.length,
      completedWorkouts: filteredWorkouts.filter(w => w.completed).length,
      totalVolume: Object.values(volumeByCategory).reduce((sum, val) => sum + val, 0),
      activeDays: Object.keys(workoutsByDate).length,
    };
  }, [userData.workouts, timeRange, exercises]);
  
  const completionRate = chartData.totalWorkouts > 0 
    ? Math.round((chartData.completedWorkouts / chartData.totalWorkouts) * 100) 
    : 0;
  
  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <p className="text-muted-foreground">Track your fitness journey over time</p>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="time-range">Time Range:</Label>
        </div>
        <Select 
          value={timeRange} 
          onValueChange={(value: TimeRange) => setTimeRange(value)}
        >
          <SelectTrigger id="time-range" className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Workouts"
          value={chartData.totalWorkouts}
          icon={<Dumbbell className="h-4 w-4" />}
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={<Trophy className="h-4 w-4" />}
          trend={completionRate > 80 ? { value: completionRate - 80, positive: true } : undefined}
        />
        <StatsCard
          title="Active Days"
          value={chartData.activeDays}
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Volume"
          value={chartData.totalVolume.toLocaleString()}
          description="Weight × Reps"
          icon={<Activity className="h-4 w-4" />}
        />
      </div>
      
      {chartData.totalWorkouts > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Progress Charts</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                <TabsTrigger value="frequency">Frequency</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
                <TabsTrigger value="weights">Weight Progress</TabsTrigger>
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
                <TabsTrigger value="muscles">Muscle Coverage</TabsTrigger>
                <TabsTrigger value="heatmap">Calendar View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="frequency" className="h-80">
                <ProgressWorkoutFrequency data={chartData.workoutFrequencyData} />
              </TabsContent>
              
              <TabsContent value="volume" className="h-80">
                <ProgressVolumeByCategory data={chartData.volumeData} />
              </TabsContent>
              
              <TabsContent value="weights" className="h-80">
                <ProgressWeightOverTime 
                  data={chartData.weightProgressionData} 
                  exercises={exercises}
                />
              </TabsContent>
              
              <TabsContent value="distribution" className="h-80">
                <ProgressWorkoutDistribution data={chartData.workoutDistribution} />
              </TabsContent>
              
              <TabsContent value="muscles" className="h-80">
                <ProgressMuscleCoverage data={chartData.muscleCoverageData} />
              </TabsContent>
              
              <TabsContent value="heatmap" className="h-80">
                <ProgressWorkoutHeatmap data={chartData.heatmapData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            No workout data available for the selected time range.
          </p>
          <p>Complete some workouts to see your progress charts here!</p>
        </Card>
      )}
    </div>
  );
}


import { useGym, WorkoutCategory } from "@/lib/store";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/stats-card";
import { 
  BarChart as BarChartIcon, 
  Calendar, 
  Trophy, 
  Dumbbell,
  Activity
} from "lucide-react";
import { format, subDays } from "date-fns";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar, Tooltip, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type TimeRange = '7days' | '30days' | '90days' | 'all';

export default function Progress() {
  const { userData, exercises } = useGym();
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  
  // Calculate data for charts
  const chartData = useMemo(() => {
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
    
    return {
      workoutFrequencyData,
      volumeData,
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={cn("lg:col-span-2", chartData.workoutFrequencyData.length === 0 && "hidden")}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChartIcon className="h-5 w-5 mr-2" />
              Workout Frequency
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData.workoutFrequencyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.workoutFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="workouts" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">No workout data available for the selected time range.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className={chartData.volumeData.some(d => d.volume > 0) ? "" : "hidden"}>
          <CardHeader>
            <CardTitle>Volume By Body Part</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {chartData.volumeData.some(d => d.volume > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData.volumeData} 
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#10B981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">No volume data available for the selected time range.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* If we had more data points, we could add more charts here */}
        
        {chartData.totalWorkouts === 0 && (
          <Card className="lg:col-span-2 p-6 text-center">
            <p className="text-muted-foreground mb-4">
              No workout data available for the selected time range.
            </p>
            <p>Complete some workouts to see your progress charts here!</p>
          </Card>
        )}
      </div>
    </div>
  );
}

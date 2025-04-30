
import { Calendar, Trophy, Dumbbell, Activity } from "lucide-react";
import { StatsCard } from "@/components/stats-card";

interface ProgressStatsProps {
  totalWorkouts: number;
  completionRate: number;
  activeDays: number;
  totalVolume: number;
}

export function ProgressStats({ totalWorkouts, completionRate, activeDays, totalVolume }: ProgressStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Workouts"
        value={totalWorkouts}
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
        value={activeDays}
        icon={<Calendar className="h-4 w-4" />}
      />
      <StatsCard
        title="Total Volume"
        value={totalVolume.toLocaleString()}
        description="Weight × Reps"
        icon={<Activity className="h-4 w-4" />}
      />
    </div>
  );
}

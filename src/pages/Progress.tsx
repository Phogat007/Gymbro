
import { useState } from "react";
import { useProgressData, TimeRange } from "@/hooks/use-progress-data";
import { useGym } from "@/lib/store";
import { TimeRangeSelector } from "@/components/progress/time-range-selector";
import { ProgressStats } from "@/components/progress/progress-stats";
import { ProgressCharts } from "@/components/progress/progress-charts";

export default function Progress() {
  const { exercises } = useGym();
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  
  const chartData = useProgressData(timeRange);
  
  const completionRate = chartData.totalWorkouts > 0 
    ? Math.round((chartData.completedWorkouts / chartData.totalWorkouts) * 100) 
    : 0;
  
  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <p className="text-muted-foreground">Track your fitness journey over time</p>
      </div>
      
      <TimeRangeSelector 
        timeRange={timeRange} 
        onTimeRangeChange={(value: TimeRange) => setTimeRange(value)} 
      />
      
      <ProgressStats 
        totalWorkouts={chartData.totalWorkouts}
        completionRate={completionRate}
        activeDays={chartData.activeDays}
        totalVolume={chartData.totalVolume}
      />
      
      <ProgressCharts chartData={chartData} exercises={exercises} />
    </div>
  );
}


export interface ProgressChartData {
  workoutFrequencyData: Array<{ date: string; workouts: number }>;
  volumeData: Array<{ category: string; volume: number }>;
  workoutDistribution: Array<{ name: string; value: number }>;
  weightProgressionData: Array<{ 
    date: string; 
    [exerciseId: string]: number | string; // Allow string (for date property)
  }>;
  muscleCoverageData: Array<{ muscle: string; coverage: number }>;
  heatmapData: Array<{ date: string; count: number }>;
  totalWorkouts: number;
  completedWorkouts: number;
  totalVolume: number;
  activeDays: number;
}

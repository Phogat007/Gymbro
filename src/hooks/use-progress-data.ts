
import { useMemo } from "react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { useGym, WorkoutCategory } from "@/lib/store";
import { ProgressChartData } from "@/components/progress/types";

export type TimeRange = '7days' | '30days' | '90days' | 'all';

export function useProgressData(timeRange: TimeRange): ProgressChartData {
  const { userData, exercises } = useGym();
  
  return useMemo<ProgressChartData>(() => {
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
      }));
    
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
}

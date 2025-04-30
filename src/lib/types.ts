
// Types for the gym application
export type FitnessGoal = 'gain_muscle' | 'lose_fat' | 'stay_fit';
export type WorkoutCategory = 'upper_body' | 'lower_body' | 'full_body' | 'cardio' | 'core';

export interface Exercise {
  id: string;
  name: string;
  category: WorkoutCategory;
  targetMuscles: string[];
  instructions: string;
  imageUrl?: string;
  recommendedFor: FitnessGoal[];
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  date: string;
  name: string;
  completed: boolean;
  exercises: WorkoutExercise[];
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  startDate?: string;
  completed: boolean;
  progress: number; // 0-100%
}

export interface UserData {
  fitnessGoal: FitnessGoal;
  workouts: Workout[];
  challenges: Challenge[];
  lastWorkout?: string; // Date string
  streakDays: number;
}

export interface GymContextType {
  exercises: Exercise[];
  userData: UserData;
  getMotivationalQuote: () => string;
  updateUserGoal: (goal: FitnessGoal) => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  joinChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  getSuggestedExercises: (goal: FitnessGoal, count?: number) => Exercise[];
  getRecommendedWorkout: () => { title: string; exercises: Exercise[] };
}

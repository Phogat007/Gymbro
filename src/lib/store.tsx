
import React, { createContext, useContext, useEffect, useState } from 'react';

// Types
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

// Default data
const defaultExercises: Exercise[] = [
  {
    id: 'ex1',
    name: 'Push-Ups',
    category: 'upper_body',
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    instructions: 'Start in a plank position, lower your body until your chest nearly touches the floor, then push back up.',
    recommendedFor: ['gain_muscle', 'stay_fit'],
  },
  {
    id: 'ex2',
    name: 'Squats',
    category: 'lower_body',
    targetMuscles: ['quadriceps', 'hamstrings', 'glutes'],
    instructions: 'Stand with feet shoulder-width apart, lower your hips back and down, then return to standing.',
    recommendedFor: ['gain_muscle', 'lose_fat', 'stay_fit'],
  },
  {
    id: 'ex3',
    name: 'Lunges',
    category: 'lower_body',
    targetMuscles: ['quadriceps', 'hamstrings', 'glutes'],
    instructions: 'Step forward with one leg, lowering your hips until both knees are bent at about a 90-degree angle.',
    recommendedFor: ['gain_muscle', 'lose_fat', 'stay_fit'],
  },
  {
    id: 'ex4',
    name: 'Pull-Ups',
    category: 'upper_body',
    targetMuscles: ['back', 'biceps', 'shoulders'],
    instructions: 'Hang from a bar with hands shoulder-width apart, pull your body up until your chin is over the bar.',
    recommendedFor: ['gain_muscle', 'stay_fit'],
  },
  {
    id: 'ex5',
    name: 'Plank',
    category: 'core',
    targetMuscles: ['abdominals', 'lower back'],
    instructions: 'Hold a position similar to a push-up, but with your weight on your forearms.',
    recommendedFor: ['gain_muscle', 'lose_fat', 'stay_fit'],
  },
  {
    id: 'ex6',
    name: 'Jumping Jacks',
    category: 'cardio',
    targetMuscles: ['full body'],
    instructions: 'Jump while spreading your legs and raising your arms above your head, then return to standing.',
    recommendedFor: ['lose_fat', 'stay_fit'],
  },
  {
    id: 'ex7',
    name: 'Bicycle Crunches',
    category: 'core',
    targetMuscles: ['abdominals', 'obliques'],
    instructions: 'Lie on your back, bring your knees to your chest, and alternate bringing each elbow to the opposite knee.',
    recommendedFor: ['lose_fat', 'stay_fit'],
  },
  {
    id: 'ex8',
    name: 'Bench Press',
    category: 'upper_body',
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    instructions: 'Lie on a bench, lower a barbell to your chest, then push it back up.',
    recommendedFor: ['gain_muscle'],
  },
  {
    id: 'ex9',
    name: 'Deadlift',
    category: 'full_body',
    targetMuscles: ['lower back', 'hamstrings', 'glutes', 'traps'],
    instructions: 'Stand with a barbell at your shins, hinge at the hips to grip the bar, then stand up straight.',
    recommendedFor: ['gain_muscle'],
  },
  {
    id: 'ex10',
    name: 'Mountain Climbers',
    category: 'cardio',
    targetMuscles: ['core', 'shoulders', 'legs'],
    instructions: 'Start in a plank position, then alternate bringing each knee to your chest.',
    recommendedFor: ['lose_fat', 'stay_fit'],
  }
];

const defaultChallenges: Challenge[] = [
  {
    id: 'ch1',
    name: '30-Day Push-Up Challenge',
    description: 'Increase your push-up count each day for 30 days.',
    duration: 30,
    completed: false,
    progress: 0,
  },
  {
    id: 'ch2',
    name: '7-Day Plank Challenge',
    description: 'Increase your plank time each day for a week.',
    duration: 7,
    completed: false,
    progress: 0,
  },
  {
    id: 'ch3',
    name: '21-Day Squat Challenge',
    description: 'Do more squats each day for 3 weeks.',
    duration: 21,
    completed: false,
    progress: 0,
  }
];

const defaultUserData: UserData = {
  fitnessGoal: 'stay_fit',
  workouts: [],
  challenges: [],
  streakDays: 0,
};

// Quotes
const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "No matter how slow you go, you're still lapping everyone on the couch.",
  "If it doesn't challenge you, it doesn't change you.",
  "You're only one workout away from a good mood.",
  "Make yourself stronger than your excuses.",
  "The hardest lift of all is lifting your butt off the couch.",
  "Your health is an investment, not an expense.",
  "Don't stop when you're tired. Stop when you're done.",
  "Sweat is just fat crying.",
];

// Context
interface GymContextType {
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

const GymContext = createContext<GymContextType | null>(null);

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default values
  const [exercises] = useState<Exercise[]>(defaultExercises);
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('gymMateUserData');
    return saved ? JSON.parse(saved) : defaultUserData;
  });

  // Initialize challenges if not existing
  useEffect(() => {
    if (userData.challenges.length === 0) {
      setUserData(prevData => ({
        ...prevData,
        challenges: defaultChallenges
      }));
    }
  }, []);

  // Save to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem('gymMateUserData', JSON.stringify(userData));
  }, [userData]);

  // Get a random motivational quote
  const getMotivationalQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  };

  // Update user's fitness goal
  const updateUserGoal = (goal: FitnessGoal) => {
    setUserData(prevData => ({
      ...prevData,
      fitnessGoal: goal
    }));
  };

  // Add a new workout
  const addWorkout = (workout: Workout) => {
    const today = new Date().toISOString().split('T')[0];
    const lastWorkoutDate = userData.lastWorkout;
    
    // Update streak
    let newStreakDays = userData.streakDays;
    if (lastWorkoutDate) {
      const lastDate = new Date(lastWorkoutDate);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day, increment streak
        newStreakDays += 1;
      } else if (diffDays > 1) {
        // Streak broken
        newStreakDays = 1;
      }
    } else {
      // First workout
      newStreakDays = 1;
    }

    setUserData(prevData => ({
      ...prevData,
      workouts: [...prevData.workouts, workout],
      lastWorkout: today,
      streakDays: newStreakDays
    }));
  };

  // Update an existing workout
  const updateWorkout = (workout: Workout) => {
    setUserData(prevData => ({
      ...prevData,
      workouts: prevData.workouts.map(w => 
        w.id === workout.id ? workout : w
      )
    }));
  };

  // Join a challenge
  const joinChallenge = (challengeId: string) => {
    setUserData(prevData => ({
      ...prevData,
      challenges: prevData.challenges.map(c => 
        c.id === challengeId 
          ? { ...c, startDate: new Date().toISOString().split('T')[0], progress: 0 } 
          : c
      )
    }));
  };

  // Update challenge progress
  const updateChallengeProgress = (challengeId: string, progress: number) => {
    setUserData(prevData => ({
      ...prevData,
      challenges: prevData.challenges.map(c => 
        c.id === challengeId 
          ? { 
              ...c, 
              progress: progress, 
              completed: progress >= 100
            } 
          : c
      )
    }));
  };

  // Get exercises based on user's fitness goal
  const getSuggestedExercises = (goal: FitnessGoal, count = 5): Exercise[] => {
    const filtered = exercises.filter(ex => ex.recommendedFor.includes(goal));
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Get recommended workout based on history and goal
  const getRecommendedWorkout = () => {
    const { fitnessGoal, workouts } = userData;
    
    // Determine what body part to focus on based on recent workouts
    let recommendation = { title: '', exercises: [] as Exercise[] };
    
    if (workouts.length === 0) {
      // First workout
      recommendation.title = "Welcome Workout 💪";
      recommendation.exercises = getSuggestedExercises(fitnessGoal, 4);
    } else {
      // Check what was worked on recently
      const recentCategories = new Set(
        workouts.slice(-3).flatMap(workout => 
          workout.exercises.map(ex => {
            const exercise = exercises.find(e => e.id === ex.exerciseId);
            return exercise?.category;
          })
        )
      );
      
      // Recommend something different
      const categories: WorkoutCategory[] = ['upper_body', 'lower_body', 'full_body', 'core', 'cardio'];
      const availableCategories = categories.filter(c => !recentCategories.has(c));
      
      if (availableCategories.length > 0) {
        const categoryToFocus = availableCategories[0];
        const categoryName = categoryToFocus.replace('_', ' ');
        recommendation.title = `It's your ${categoryName} day! 💪`;
        
        // Get exercises for that category that match the user's goal
        const categoryExercises = exercises.filter(
          ex => ex.category === categoryToFocus && ex.recommendedFor.includes(fitnessGoal)
        );
        
        recommendation.exercises = categoryExercises.length >= 3 
          ? categoryExercises.slice(0, 4) 
          : [...categoryExercises, ...getSuggestedExercises(fitnessGoal, 4 - categoryExercises.length)];
      } else {
        // Fallback
        recommendation.title = "Mix it up workout 🔄";
        recommendation.exercises = getSuggestedExercises(fitnessGoal, 4);
      }
    }
    
    return recommendation;
  };

  const contextValue = {
    exercises,
    userData,
    getMotivationalQuote,
    updateUserGoal,
    addWorkout,
    updateWorkout,
    joinChallenge,
    updateChallengeProgress,
    getSuggestedExercises,
    getRecommendedWorkout
  };

  return (
    <GymContext.Provider value={contextValue}>
      {children}
    </GymContext.Provider>
  );
};

// Custom hook to use the gym context
export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};

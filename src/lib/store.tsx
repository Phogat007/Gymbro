
import React, { useState, useEffect } from 'react';
import { FitnessGoal, UserData } from './types';
import { defaultExercises } from './data/default-exercises';
import { defaultChallenges } from './data/default-challenges';
import { getMotivationalQuote, getSuggestedExercises, getRecommendedWorkout } from './utils/workout-utils';
import { GymContext, GymProvider as BaseGymProvider } from './gym-context';

// Default user data
const defaultUserData: UserData = {
  fitnessGoal: 'stay_fit',
  workouts: [],
  challenges: [],
  streakDays: 0,
};

// The actual implementation of the GymProvider
export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default values
  const [exercises] = useState(defaultExercises);
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

  // Update user's fitness goal
  const updateUserGoal = (goal: FitnessGoal) => {
    setUserData(prevData => ({
      ...prevData,
      fitnessGoal: goal
    }));
  };

  // Add a new workout
  const addWorkout = (workout) => {
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
  const updateWorkout = (workout) => {
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

  const contextValue = {
    exercises,
    userData,
    getMotivationalQuote,
    updateUserGoal,
    addWorkout,
    updateWorkout,
    joinChallenge,
    updateChallengeProgress,
    getSuggestedExercises: (goal, count) => getSuggestedExercises(goal, count),
    getRecommendedWorkout: () => getRecommendedWorkout(userData.fitnessGoal, userData.workouts)
  };

  return (
    <GymContext.Provider value={contextValue}>
      {children}
    </GymContext.Provider>
  );
};

// Re-export types and hooks for easier imports
export * from './types';
export { useGym } from './gym-context';

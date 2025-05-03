
import { defaultExercises } from '../data/default-exercises';
import { motivationalQuotes } from '../data/motivational-quotes';
import { Exercise, FitnessGoal, WorkoutCategory } from '../types';

// Get exercises based on user's fitness goal with better randomization
export function getSuggestedExercises(goal: FitnessGoal, count = 5): Exercise[] {
  const filtered = defaultExercises.filter(ex => ex.recommendedFor.includes(goal));
  
  // Improved randomization for more variety
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  
  // Add score boost to exercises that match user's primary goal
  const scored = shuffled.map(ex => ({
    ...ex,
    score: ex.recommendedFor[0] === goal ? 1.5 : 1
  }));
  
  // Sort by score and then pick the top ones
  return scored.sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ score, ...exercise }) => exercise);
}

// Get random motivational quote
export function getMotivationalQuote(): string {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
}

// Get recommended workout based on history and goal with improved variety
export function getRecommendedWorkout(
  fitnessGoal: FitnessGoal, 
  workouts: any[]
): { title: string; exercises: Exercise[] } {
  let recommendation = { title: '', exercises: [] as Exercise[] };
  
  if (workouts.length === 0) {
    // First workout - more personalized greeting
    recommendation.title = "Welcome Workout 💪";
    recommendation.exercises = getSuggestedExercises(fitnessGoal, 4);
  } else {
    // Check what was worked on recently
    const recentCategories = new Set(
      workouts.slice(-3).flatMap(workout => 
        workout.exercises.map(ex => {
          const exercise = defaultExercises.find(e => e.id === ex.exerciseId);
          return exercise?.category;
        })
      )
    );
    
    // Recommend something different with better naming
    const categories: WorkoutCategory[] = ['upper_body', 'lower_body', 'full_body', 'core', 'cardio'];
    const availableCategories = categories.filter(c => !recentCategories.has(c));
    
    if (availableCategories.length > 0) {
      const categoryToFocus = availableCategories[0];
      
      // More engaging title based on category
      const titles = {
        'upper_body': "Upper Body Blast 💪",
        'lower_body': "Leg Day Champion 🏆",
        'full_body': "Total Body Transformation 🔄",
        'core': "Core Crusher 🔥",
        'cardio': "Cardio Kickstart ⚡"
      };
      
      recommendation.title = titles[categoryToFocus] || `It's your ${categoryToFocus.replace('_', ' ')} day! 💪`;
      
      // Get exercises for that category that match the user's goal
      const categoryExercises = defaultExercises.filter(
        ex => ex.category === categoryToFocus && ex.recommendedFor.includes(fitnessGoal)
      );
      
      recommendation.exercises = categoryExercises.length >= 3 
        ? categoryExercises.slice(0, 4) 
        : [...categoryExercises, ...getSuggestedExercises(fitnessGoal, 4 - categoryExercises.length)];
    } else {
      // Fallback with better naming
      recommendation.title = "Mix It Up Challenge 🔄";
      recommendation.exercises = getSuggestedExercises(fitnessGoal, 4);
    }
  }
  
  return recommendation;
}

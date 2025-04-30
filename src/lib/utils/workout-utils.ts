
import { defaultExercises } from '../data/default-exercises';
import { motivationalQuotes } from '../data/motivational-quotes';
import { Exercise, FitnessGoal, WorkoutCategory } from '../types';

// Get exercises based on user's fitness goal
export function getSuggestedExercises(goal: FitnessGoal, count = 5): Exercise[] {
  const filtered = defaultExercises.filter(ex => ex.recommendedFor.includes(goal));
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Get random motivational quote
export function getMotivationalQuote(): string {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
}

// Get recommended workout based on history and goal
export function getRecommendedWorkout(
  fitnessGoal: FitnessGoal, 
  workouts: any[]
): { title: string; exercises: Exercise[] } {
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
          const exercise = defaultExercises.find(e => e.id === ex.exerciseId);
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
      const categoryExercises = defaultExercises.filter(
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
}

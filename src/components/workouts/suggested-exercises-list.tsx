
import { Exercise } from "@/lib/store";
import { ExerciseCard } from "@/components/exercise-card";

interface SuggestedExercisesListProps {
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
}

export function SuggestedExercisesList({ exercises, onSelect }: SuggestedExercisesListProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Suggested Exercises</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise) => (
          <ExerciseCard 
            key={exercise.id} 
            exercise={exercise} 
            onClick={() => onSelect(exercise)}
          />
        ))}
      </div>
    </div>
  );
}

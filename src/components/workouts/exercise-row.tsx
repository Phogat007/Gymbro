
import { Exercise, WorkoutExercise } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ExerciseRowProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  onRemove: () => void;
  onSetUpdate: (setIndex: number, field: 'reps' | 'weight' | 'completed', value: any) => void;
}

export function ExerciseRow({ exercise, workoutExercise, onRemove, onSetUpdate }: ExerciseRowProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{exercise.name}</CardTitle>
          <CardDescription>{exercise.category.replace('_', ' ')}</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="pb-2">Set</th>
                <th className="pb-2">Reps</th>
                <th className="pb-2">Weight (kg)</th>
                <th className="pb-2">Done</th>
              </tr>
            </thead>
            <tbody>
              {workoutExercise.sets.map((set, j) => (
                <tr key={j} className="border-t">
                  <td className="py-2">{j + 1}</td>
                  <td className="py-2">
                    <Input
                      type="number"
                      min="0"
                      value={set.reps}
                      onChange={(e) => onSetUpdate(j, 'reps', e.target.value)}
                      className="h-8 w-16"
                    />
                  </td>
                  <td className="py-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      value={set.weight}
                      onChange={(e) => onSetUpdate(j, 'weight', e.target.value)}
                      className="h-8 w-16"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="checkbox"
                      checked={set.completed}
                      onChange={(e) => onSetUpdate(j, 'completed', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

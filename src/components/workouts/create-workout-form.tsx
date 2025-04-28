
import { useState } from "react";
import { Exercise, WorkoutExercise, useGym } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { ExerciseRow } from "./exercise-row";

interface CreateWorkoutFormProps {
  onCancel: () => void;
}

export function CreateWorkoutForm({ onCancel }: CreateWorkoutFormProps) {
  const { exercises, userData, addWorkout, getSuggestedExercises } = useGym();
  const [workoutName, setWorkoutName] = useState("New Workout");
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [suggestedExercises, setSuggestedExercises] = useState<Exercise[]>(
    getSuggestedExercises(userData.fitnessGoal, 6)
  );

  const handleAddExercise = (exercise: Exercise) => {
    const newWorkoutExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      sets: [
        { reps: 10, weight: 0, completed: false },
        { reps: 10, weight: 0, completed: false },
        { reps: 10, weight: 0, completed: false },
      ],
    };

    setSelectedExercises([...selectedExercises, newWorkoutExercise]);
    
    setSuggestedExercises(suggestedExercises.filter(ex => ex.id !== exercise.id));
    
    toast({
      description: `${exercise.name} added to your workout`,
    });
  };

  const handleRemoveExercise = (index: number) => {
    const exerciseId = selectedExercises[index].exerciseId;
    const exerciseToAdd = exercises.find(ex => ex.id === exerciseId);
    
    if (exerciseToAdd) {
      setSuggestedExercises([...suggestedExercises, exerciseToAdd]);
    }
    
    const newExercises = [...selectedExercises];
    newExercises.splice(index, 1);
    setSelectedExercises(newExercises);
  };

  const handleUpdateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight' | 'completed', value: any) => {
    const newExercises = [...selectedExercises];
    if (field === 'completed') {
      newExercises[exerciseIndex].sets[setIndex].completed = value;
    } else {
      newExercises[exerciseIndex].sets[setIndex][field] = parseInt(value) || 0;
    }
    setSelectedExercises(newExercises);
  };

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const newWorkout = {
      id: uuidv4(),
      name: workoutName,
      date: today,
      completed: selectedExercises.every(ex => ex.sets.every(set => set.completed)),
      exercises: selectedExercises,
    };
    
    addWorkout(newWorkout);
    
    toast({
      title: "Workout saved!",
      description: "Your workout has been saved successfully.",
    });
    
    onCancel();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Create New Workout</CardTitle>
            <CardDescription>Add exercises and track your sets</CardDescription>
          </div>
          <Button variant="outline" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="workoutName">Workout Name</Label>
            <Input 
              id="workoutName" 
              value={workoutName} 
              onChange={(e) => setWorkoutName(e.target.value)} 
              className="max-w-md"
            />
          </div>
          
          {selectedExercises.length > 0 ? (
            <div className="space-y-6">
              {selectedExercises.map((workoutEx, i) => {
                const exercise = exercises.find(ex => ex.id === workoutEx.exerciseId);
                if (!exercise) return null;
                
                return (
                  <ExerciseRow
                    key={i}
                    exercise={exercise}
                    workoutExercise={workoutEx}
                    onRemove={() => handleRemoveExercise(i)}
                    onSetUpdate={(setIndex, field, value) => 
                      handleUpdateSet(i, setIndex, field, value)}
                  />
                );
              })}
              
              <div>
                <Button onClick={handleSubmit} className="mr-2">
                  <Save className="h-4 w-4 mr-2" />
                  Save Workout
                </Button>
                <Button variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No exercises added yet. Select from the suggested exercises below.
            </p>
          )}
        </CardContent>
      </Card>

      <SuggestedExercisesList exercises={suggestedExercises} onSelect={handleAddExercise} />
    </div>
  );
}

// Import the SuggestedExercisesList component at the top
import { SuggestedExercisesList } from "./suggested-exercises-list";

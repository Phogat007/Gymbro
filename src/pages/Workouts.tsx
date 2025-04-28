
import { useState } from "react";
import { useGym, Workout, Exercise, WorkoutExercise } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkoutCard } from "@/components/workout-card";
import { ExerciseCard } from "@/components/exercise-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, X, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "@tanstack/react-query";

export default function Workouts() {
  const { exercises, userData, addWorkout, getSuggestedExercises, updateWorkout } = useGym();
  const [isCreating, setIsCreating] = useState(false);
  const [workoutName, setWorkoutName] = useState("New Workout");
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [suggestedExercises, setSuggestedExercises] = useState<Exercise[]>(
    getSuggestedExercises(userData.fitnessGoal, 6)
  );

  // For pagination of past workouts
  const [page, setPage] = useState(0);
  const workoutsPerPage = 4;
  const totalWorkouts = userData.workouts.length;
  const totalPages = Math.ceil(totalWorkouts / workoutsPerPage);
  const displayedWorkouts = userData.workouts
    .slice()
    .reverse()
    .slice(page * workoutsPerPage, (page + 1) * workoutsPerPage);

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
    
    // Remove from suggested list
    setSuggestedExercises(suggestedExercises.filter(ex => ex.id !== exercise.id));
    
    toast({
      description: `${exercise.name} added to your workout`,
    });
  };

  const handleRemoveExercise = (index: number) => {
    // Get the exercise that's being removed
    const exerciseId = selectedExercises[index].exerciseId;
    const exerciseToAdd = exercises.find(ex => ex.id === exerciseId);
    
    if (exerciseToAdd) {
      setSuggestedExercises([...suggestedExercises, exerciseToAdd]);
    }
    
    // Remove from selected
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
    const newWorkout: Workout = {
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
    
    // Reset state
    setWorkoutName("New Workout");
    setSelectedExercises([]);
    setIsCreating(false);
    setSuggestedExercises(getSuggestedExercises(userData.fitnessGoal, 6));
  };

  const handleCompleteWorkout = (workout: Workout) => {
    const updatedWorkout = {
      ...workout,
      completed: true,
      exercises: workout.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(set => ({ ...set, completed: true }))
      }))
    };
    
    updateWorkout(updatedWorkout);
    
    toast({
      title: "Workout completed!",
      description: "Great job! Your workout has been marked as completed.",
    });
  };

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Workouts</h1>
          <p className="text-muted-foreground">Track and manage your workouts</p>
        </div>
        
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="sm:self-end">
            <Plus className="h-4 w-4 mr-2" />
            New Workout
          </Button>
        )}
      </div>

      {isCreating ? (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Create New Workout</CardTitle>
                <CardDescription>Add exercises and track your sets</CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={() => setIsCreating(false)}>
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
                      <Card key={i} className="overflow-hidden">
                        <CardHeader className="bg-muted/50 flex flex-row items-start justify-between pb-2">
                          <div>
                            <CardTitle className="text-lg">{exercise.name}</CardTitle>
                            <CardDescription>{exercise.category.replace('_', ' ')}</CardDescription>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveExercise(i)}
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
                                {workoutEx.sets.map((set, j) => (
                                  <tr key={j} className="border-t">
                                    <td className="py-2">{j + 1}</td>
                                    <td className="py-2">
                                      <Input
                                        type="number"
                                        min="0"
                                        value={set.reps}
                                        onChange={(e) => handleUpdateSet(i, j, 'reps', e.target.value)}
                                        className="h-8 w-16"
                                      />
                                    </td>
                                    <td className="py-2">
                                      <Input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={set.weight}
                                        onChange={(e) => handleUpdateSet(i, j, 'weight', e.target.value)}
                                        className="h-8 w-16"
                                      />
                                    </td>
                                    <td className="py-2">
                                      <input
                                        type="checkbox"
                                        checked={set.completed}
                                        onChange={(e) => handleUpdateSet(i, j, 'completed', e.target.checked)}
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
                  })}
                  
                  <div>
                    <Button onClick={handleSubmit} className="mr-2">
                      <Save className="h-4 w-4 mr-2" />
                      Save Workout
                    </Button>
                    <Button variant="ghost" onClick={() => setIsCreating(false)}>
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

          <div>
            <h3 className="text-lg font-semibold mb-4">Suggested Exercises</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedExercises.map((exercise) => (
                <ExerciseCard 
                  key={exercise.id} 
                  exercise={exercise} 
                  onClick={() => handleAddExercise(exercise)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Past Workouts</h2>
            
            {totalWorkouts === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground mb-4">You haven't logged any workouts yet.</p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Workout
                </Button>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedWorkouts.map((workout) => (
                    <WorkoutCard
                      key={workout.id}
                      title={workout.name}
                      date={workout.date}
                      completed={workout.completed}
                      exercises={workout.exercises.map(
                        ex => exercises.find(e => e.id === ex.exerciseId)
                      ).filter((ex): ex is Exercise => ex !== undefined)}
                      cta={
                        !workout.completed 
                          ? { 
                              label: "Complete Workout", 
                              to: "#" 
                            }
                          : undefined
                      }
                      className="h-full"
                      onClick={!workout.completed ? () => handleCompleteWorkout(workout) : undefined}
                    />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage(prev => Math.max(0, prev - 1))}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="flex items-center px-2">
                      Page {page + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={page === totalPages - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

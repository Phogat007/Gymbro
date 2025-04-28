
import { useState } from "react";
import { Workout, Exercise, useGym } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkoutCard } from "@/components/workout-card";
import { ChevronRight, ChevronLeft, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface WorkoutsListProps {
  onCreateWorkout: () => void;
}

export function WorkoutsList({ onCreateWorkout }: WorkoutsListProps) {
  const { exercises, userData, updateWorkout } = useGym();
  
  const [page, setPage] = useState(0);
  const workoutsPerPage = 4;
  const totalWorkouts = userData.workouts.length;
  const totalPages = Math.ceil(totalWorkouts / workoutsPerPage);
  const displayedWorkouts = userData.workouts
    .slice()
    .reverse()
    .slice(page * workoutsPerPage, (page + 1) * workoutsPerPage);

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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Past Workouts</h2>
      
      {totalWorkouts === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">You haven't logged any workouts yet.</p>
          <Button onClick={onCreateWorkout}>
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
  );
}

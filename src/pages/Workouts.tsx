
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateWorkoutForm } from "@/components/workouts/create-workout-form";
import { WorkoutsList } from "@/components/workouts/workouts-list";

export default function Workouts() {
  const [isCreating, setIsCreating] = useState(false);

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
        <CreateWorkoutForm onCancel={() => setIsCreating(false)} />
      ) : (
        <WorkoutsList onCreateWorkout={() => setIsCreating(true)} />
      )}
    </div>
  );
}

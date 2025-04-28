
import { useState, useMemo } from "react";
import { Exercise, FitnessGoal, WorkoutCategory, useGym } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ExerciseCard } from "@/components/exercise-card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

export default function Exercises() {
  const { exercises, userData } = useGym();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | "all">("all");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGoal = selectedGoal === "all" || exercise.recommendedFor.includes(selectedGoal as FitnessGoal);
      const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
      return matchesSearch && matchesGoal && matchesCategory;
    });
  }, [exercises, searchTerm, selectedGoal, selectedCategory]);

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Exercises</h1>
        <p className="text-muted-foreground">Browse and discover exercises based on your goals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Exercises</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input 
              id="search" 
              placeholder="Search by exercise name" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-2 block">Fitness Goal</Label>
              <RadioGroup
                value={selectedGoal}
                onValueChange={(value) => setSelectedGoal(value as FitnessGoal | "all")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="goal-all" />
                  <Label htmlFor="goal-all">All Goals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gain_muscle" id="goal-muscle" />
                  <Label htmlFor="goal-muscle">Build Muscle</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lose_fat" id="goal-fat" />
                  <Label htmlFor="goal-fat">Lose Fat</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stay_fit" id="goal-fit" />
                  <Label htmlFor="goal-fit">Stay Fit</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-2 block">Exercise Category</Label>
              <RadioGroup
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as WorkoutCategory | "all")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="category-all" />
                  <Label htmlFor="category-all">All Categories</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upper_body" id="category-upper" />
                  <Label htmlFor="category-upper">Upper Body</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lower_body" id="category-lower" />
                  <Label htmlFor="category-lower">Lower Body</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full_body" id="category-full" />
                  <Label htmlFor="category-full">Full Body</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="core" id="category-core" />
                  <Label htmlFor="category-core">Core</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cardio" id="category-cardio" />
                  <Label htmlFor="category-cardio">Cardio</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedGoal("all");
                setSelectedCategory("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          {filteredExercises.length} {filteredExercises.length === 1 ? 'Exercise' : 'Exercises'} Found
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              onClick={() => setSelectedExercise(exercise)}
            />
          ))}
        </div>
        
        {filteredExercises.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No exercises found matching your filters.</p>
          </Card>
        )}
      </div>

      <Dialog open={!!selectedExercise} onOpenChange={(open) => !open && setSelectedExercise(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedExercise?.name}</DialogTitle>
            <DialogDescription>
              {selectedExercise?.category.replace('_', ' ')} exercise
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Target Muscles:</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {selectedExercise?.targetMuscles.join(', ')}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Instructions:</h4>
              <p className="text-sm text-muted-foreground">
                {selectedExercise?.instructions}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Recommended For:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedExercise?.recommendedFor.map((goal) => (
                  <span 
                    key={goal} 
                    className="px-2 py-1 bg-secondary text-xs rounded-md"
                  >
                    {goal === 'gain_muscle' ? 'Build Muscle' : 
                     goal === 'lose_fat' ? 'Lose Fat' : 'Stay Fit'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

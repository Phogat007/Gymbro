
import { useState } from "react";
import {
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Legend
} from "recharts";
import { Exercise } from "@/lib/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface WeightOverTimeProps {
  data: Array<{ 
    date: string; 
    [exerciseId: string]: number | string; // Updated to allow string (for date property)
  }>;
  exercises: Exercise[];
}

export function ProgressWeightOverTime({ data, exercises }: WeightOverTimeProps) {
  // Find exercises that have weight data
  const exercisesWithData = exercises.filter(ex => 
    data.some(d => d[ex.id] !== undefined && typeof d[ex.id] === 'number')
  );
  
  const [selectedExercise, setSelectedExercise] = useState<string | null>(
    exercisesWithData.length > 0 ? exercisesWithData[0].id : null
  );

  // Filter the data to include only the selected exercise
  const chartData = selectedExercise ? data.map(d => ({
    date: d.date,
    weight: d[selectedExercise] as number // Explicit cast since we know it's a number
  })).filter(d => d.weight !== undefined) : [];

  return (
    <div className="h-full">
      {exercisesWithData.length > 0 ? (
        <div className="h-full space-y-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="exercise-select">Exercise:</Label>
            <Select 
              value={selectedExercise || ''}
              onValueChange={setSelectedExercise}
            >
              <SelectTrigger id="exercise-select" className="w-[200px]">
                <SelectValue placeholder="Select exercise" />
              </SelectTrigger>
              <SelectContent>
                {exercisesWithData.map(ex => (
                  <SelectItem key={ex.id} value={ex.id}>
                    {ex.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {chartData.length > 0 ? (
            <div className="h-[calc(100%-40px)]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    name="Weight (lbs)" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: "#8884d8", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[calc(100%-40px)]">
              <p className="text-muted-foreground">No weight data available for this exercise.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">No weight progression data available.</p>
        </div>
      )}
    </div>
  );
}

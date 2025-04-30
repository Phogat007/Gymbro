
import { 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Bar, 
  Tooltip, 
  CartesianGrid 
} from "recharts";

interface WorkoutFrequencyProps {
  data: Array<{ date: string; workouts: number }>;
}

export function ProgressWorkoutFrequency({ data }: WorkoutFrequencyProps) {
  return (
    <div className="h-full">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="workouts" fill="#F97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">No workout data available for the selected time range.</p>
        </div>
      )}
    </div>
  );
}

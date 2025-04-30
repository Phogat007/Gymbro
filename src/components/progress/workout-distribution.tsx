
import { PieChart, ResponsiveContainer, Pie, Cell, Legend, Tooltip } from "recharts";

interface WorkoutDistributionProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ['#F97316', '#10B981', '#8884d8', '#ffc658', '#ff8042'];

export function ProgressWorkoutDistribution({ data }: WorkoutDistributionProps) {
  return (
    <div className="h-full">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [value, 'Count']} 
              labelFormatter={(name: string) => `${name}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">No workout distribution data available.</p>
        </div>
      )}
    </div>
  );
}

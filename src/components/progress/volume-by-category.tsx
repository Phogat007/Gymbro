
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  CartesianGrid
} from "recharts";

interface VolumeByCategory {
  data: Array<{ category: string; volume: number }>;
}

export function ProgressVolumeByCategory({ data }: VolumeByCategory) {
  return (
    <div className="h-full">
      {data.some(d => d.volume > 0) ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" width={80} />
            <Tooltip formatter={(value: number) => value.toLocaleString()} />
            <Bar dataKey="volume" fill="#10B981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">No volume data available for the selected time range.</p>
        </div>
      )}
    </div>
  );
}

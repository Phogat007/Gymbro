
import {
  RadarChart,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from "recharts";

interface MuscleCoverageProps {
  data: Array<{ muscle: string; coverage: number }>;
}

export function ProgressMuscleCoverage({ data }: MuscleCoverageProps) {
  return (
    <div className="h-full">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="muscle" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Muscle Coverage"
              dataKey="coverage"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip formatter={(value: number) => [`${value}%`, 'Coverage']} />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">No muscle coverage data available.</p>
        </div>
      )}
    </div>
  );
}

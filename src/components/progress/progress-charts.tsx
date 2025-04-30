
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressChartData } from "@/components/progress/types";
import { Exercise } from "@/lib/store";
import { ProgressWorkoutFrequency } from "@/components/progress/workout-frequency";
import { ProgressVolumeByCategory } from "@/components/progress/volume-by-category";
import { ProgressWeightOverTime } from "@/components/progress/weight-over-time";
import { ProgressWorkoutDistribution } from "@/components/progress/workout-distribution";
import { ProgressMuscleCoverage } from "@/components/progress/muscle-coverage";
import { ProgressWorkoutHeatmap } from "@/components/progress/workout-heatmap";

interface ProgressChartsProps {
  chartData: ProgressChartData;
  exercises: Exercise[];
}

export function ProgressCharts({ chartData, exercises }: ProgressChartsProps) {
  const [selectedTab, setSelectedTab] = useState('frequency');

  if (chartData.totalWorkouts === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground mb-4">
          No workout data available for the selected time range.
        </p>
        <p>Complete some workouts to see your progress charts here!</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Progress Charts</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="weights">Weight Progress</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="muscles">Muscle Coverage</TabsTrigger>
            <TabsTrigger value="heatmap">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="frequency" className="h-80">
            <ProgressWorkoutFrequency data={chartData.workoutFrequencyData} />
          </TabsContent>
          
          <TabsContent value="volume" className="h-80">
            <ProgressVolumeByCategory data={chartData.volumeData} />
          </TabsContent>
          
          <TabsContent value="weights" className="h-80">
            <ProgressWeightOverTime 
              data={chartData.weightProgressionData} 
              exercises={exercises}
            />
          </TabsContent>
          
          <TabsContent value="distribution" className="h-80">
            <ProgressWorkoutDistribution data={chartData.workoutDistribution} />
          </TabsContent>
          
          <TabsContent value="muscles" className="h-80">
            <ProgressMuscleCoverage data={chartData.muscleCoverageData} />
          </TabsContent>
          
          <TabsContent value="heatmap" className="h-80">
            <ProgressWorkoutHeatmap data={chartData.heatmapData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

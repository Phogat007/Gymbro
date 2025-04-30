
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, isEqual, isSameMonth, isToday } from "date-fns";

interface WorkoutHeatmapProps {
  data: Array<{ date: string; count: number }>;
}

export function ProgressWorkoutHeatmap({ data }: WorkoutHeatmapProps) {
  const today = new Date();
  
  // Create a map of dates to workout counts
  const dateCountMap = useMemo(() => {
    return data.reduce((acc, { date, count }) => {
      acc[date] = count;
      return acc;
    }, {} as Record<string, number>);
  }, [data]);
  
  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const firstDay = startOfMonth(today);
    const lastDay = endOfMonth(today);
    
    return eachDayOfInterval({ start: firstDay, end: lastDay });
  }, [today]);

  // Function to get color intensity based on workout count
  const getColorIntensity = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count === 1) return "bg-orange-200";
    if (count === 2) return "bg-orange-300";
    if (count === 3) return "bg-orange-400";
    return "bg-orange-500";
  };
  
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col items-center">
        <h3 className="text-center font-medium mb-4">
          {format(today, 'MMMM yyyy')} - Workout Activity
        </h3>
        
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          
          {calendarDays.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const count = dateCountMap[dateStr] || 0;
            const colorClass = getColorIntensity(count);
            
            return (
              <div 
                key={dateStr}
                className="h-10 w-10 relative"
              >
                <div 
                  className={`absolute inset-1 flex items-center justify-center rounded-md ${colorClass} ${
                    isToday(date) ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <span className="text-xs font-medium">
                    {format(date, 'd')}
                  </span>
                </div>
                {count > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                    {count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-center mt-6 gap-2">
          <div className="text-sm">Workout intensity:</div>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <div className="w-4 h-4 bg-orange-200 rounded"></div>
            <div className="w-4 h-4 bg-orange-300 rounded"></div>
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
          </div>
          <div className="text-sm flex gap-1">
            <span>0</span>
            <span>→</span>
            <span>4+</span>
          </div>
        </div>
      </div>
    </div>
  );
}

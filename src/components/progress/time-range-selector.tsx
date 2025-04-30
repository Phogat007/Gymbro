
import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeRange } from "@/hooks/use-progress-data";

interface TimeRangeSelectorProps {
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
}

export function TimeRangeSelector({ timeRange, onTimeRangeChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <Label htmlFor="time-range">Time Range:</Label>
      </div>
      <Select 
        value={timeRange} 
        onValueChange={onTimeRangeChange}
      >
        <SelectTrigger id="time-range" className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="90days">Last 90 days</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

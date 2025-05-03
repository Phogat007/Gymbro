
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  trend?: {
    value: number;
    positive: boolean;
  };
  description?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  className, 
  onClick, 
  trend, 
  description 
}: StatsCardProps) {
  return (
    <Card 
      className={cn(
        "relative border-orange/20 overflow-hidden", 
        onClick && "cursor-pointer hover:shadow-md transition-all",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
        <div className="absolute top-0 right-0 w-16 h-16 bg-orange/5 rounded-bl-3xl" />
        
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange/10 mb-3">
          <div className="text-orange">
            {icon}
          </div>
        </div>
        
        <h3 className="text-sm text-muted-foreground text-center mb-1">{title}</h3>
        <p className="text-2xl font-semibold text-center">{value}</p>
        
        {description && (
          <p className="text-xs text-muted-foreground mt-1 text-center">{description}</p>
        )}
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1 mt-2 text-xs",
            trend.positive ? "text-green-500" : "text-red-500"
          )}>
            {trend.positive ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v3.586l-3.293-3.293a1 1 0 10-1.414 1.414l5 5a1 1 0 001.414 0l5-5a1 1 0 00-1.414-1.414L12 10.586V7z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 13a1 1 0 10-2 0v-3.586l-3.293 3.293a1 1 0 11-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L12 9.414V13z" clipRule="evenodd" />
              </svg>
            )}
            <span>{trend.value}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

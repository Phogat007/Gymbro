
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function StatsCard({ title, value, icon, className, onClick }: StatsCardProps) {
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
      </CardContent>
    </Card>
  );
}

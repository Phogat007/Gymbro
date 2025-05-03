
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProgressSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(null).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[300px] flex flex-col justify-between">
            <div className="flex items-end space-x-2 h-3/4">
              {Array(7).fill(null).map((_, i) => (
                <Skeleton 
                  key={i} 
                  className="w-full" 
                  style={{ 
                    height: `${Math.random() * 60 + 20}%`
                  }} 
                />
              ))}
            </div>
            <div className="flex justify-between mt-4">
              {Array(7).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-4 w-8" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

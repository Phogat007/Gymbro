
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Apple, Egg, Fish, LeafyGreen, Utensils } from "lucide-react";
import { cn } from '@/lib/utils';
import { FitnessGoal } from '@/lib/store';

interface FoodItem {
  name: string;
  description: string;
  benefits: string[];
}

interface DietSuggestionCardProps {
  title: string;
  description: string;
  foods: FoodItem[];
  icon: React.ReactNode;
  className?: string;
}

export function DietSuggestionCard({ 
  title, 
  description, 
  foods, 
  icon,
  className 
}: DietSuggestionCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {foods.map((food, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{food.name}</h4>
              <div className="flex gap-1">
                {food.benefits.map((benefit, i) => (
                  <Badge key={i} variant="outline">{benefit}</Badge>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{food.description}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          <LeafyGreen className="h-4 w-4 mr-2" />
          View Full Meal Plan
        </Button>
      </CardFooter>
    </Card>
  );
}

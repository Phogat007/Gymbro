
import { FitnessGoal, useGym } from "@/lib/store";
import { getDietSuggestionsByGoal } from "@/lib/diet-suggestions";
import { DietSuggestionCard } from "./diet-suggestion-card";
import { Apple, Egg, Fish, LeafyGreen } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const goalIcons: Record<FitnessGoal, React.ReactNode> = {
  gain_muscle: <Egg className="h-5 w-5 text-orange-500" />,
  lose_fat: <LeafyGreen className="h-5 w-5 text-green-500" />,
  stay_fit: <Apple className="h-5 w-5 text-red-500" />
};

const goalLabels: Record<FitnessGoal, string> = {
  gain_muscle: "Build Muscle",
  lose_fat: "Lose Fat",
  stay_fit: "Stay Fit"
};

export function DietSuggestions() {
  const { userData } = useGym();
  const [activeTab, setActiveTab] = useState<FitnessGoal>(userData.fitnessGoal);
  
  const dietSuggestion = getDietSuggestionsByGoal(activeTab);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">Diet Suggestions</h2>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as FitnessGoal)} 
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="gain_muscle">Build Muscle</TabsTrigger>
            <TabsTrigger value="lose_fat">Lose Fat</TabsTrigger>
            <TabsTrigger value="stay_fit">Stay Fit</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <DietSuggestionCard 
        title={dietSuggestion.title}
        description={dietSuggestion.description}
        foods={dietSuggestion.foods}
        icon={goalIcons[activeTab]}
      />
    </div>
  );
}

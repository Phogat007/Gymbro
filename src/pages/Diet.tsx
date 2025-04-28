
import { DietSuggestions } from "@/components/diet/diet-suggestions";

export default function Diet() {
  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Nutrition & Diet</h1>
        <p className="text-muted-foreground">Personalized diet recommendations for your fitness goals</p>
      </div>
      
      <DietSuggestions />
    </div>
  );
}


import { useGym } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";

export function QuoteBanner() {
  const { getMotivationalQuote } = useGym();
  const quote = getMotivationalQuote();

  return (
    <Card className="bg-gradient-to-r from-orange to-orange-light text-white">
      <CardContent className="flex items-center justify-center p-6">
        <p className="text-lg font-semibold text-center">{quote}</p>
      </CardContent>
    </Card>
  );
}


import { useGym, Challenge } from "@/lib/store";
import { ChallengeCard } from "@/components/challenge-card";
import { QuoteBanner } from "@/components/quote-banner";
import { StatsCard } from "@/components/stats-card";
import { Trophy, Calendar, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Challenges() {
  const { userData, joinChallenge, updateChallengeProgress } = useGym();
  
  // Separate challenges into active, available, and completed
  const activeChallenges = userData.challenges.filter(c => c.startDate && !c.completed);
  const availableChallenges = userData.challenges.filter(c => !c.startDate && !c.completed);
  const completedChallenges = userData.challenges.filter(c => c.completed);
  
  // Stats
  const totalActive = activeChallenges.length;
  const totalCompleted = completedChallenges.length;
  const averageProgress = activeChallenges.length > 0
    ? Math.round(activeChallenges.reduce((sum, c) => sum + c.progress, 0) / activeChallenges.length)
    : 0;
  
  const handleJoinChallenge = (id: string) => {
    joinChallenge(id);
  };
  
  const handleUpdateProgress = (id: string, progress: number) => {
    updateChallengeProgress(id, progress);
  };

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Challenges</h1>
        <p className="text-muted-foreground">Take on fitness challenges to stay motivated</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Active Challenges"
          value={totalActive}
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatsCard
          title="Average Progress"
          value={`${averageProgress}%`}
          icon={<Target className="h-4 w-4" />}
        />
        <StatsCard
          title="Completed Challenges"
          value={totalCompleted}
          icon={<Trophy className="h-4 w-4" />}
        />
      </div>
      
      <QuoteBanner />
      
      {activeChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onUpdate={handleUpdateProgress}
              />
            ))}
          </div>
        </div>
      )}
      
      {availableChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoin={handleJoinChallenge}
              />
            ))}
          </div>
        </div>
      )}
      
      {completedChallenges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Completed Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
              />
            ))}
          </div>
        </div>
      )}
      
      {userData.challenges.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No challenges available at the moment.</p>
        </Card>
      )}
    </div>
  );
}

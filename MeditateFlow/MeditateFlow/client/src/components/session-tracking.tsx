import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";
import type { MeditationSession } from "@shared/schema";

export function SessionTracking() {
  const { data: sessions = [], isLoading } = useQuery<MeditationSession[]>({
    queryKey: ['/api/sessions'],
    refetchInterval: false,
  });

  const { data: todaySessions = [] } = useQuery<MeditationSession[]>({
    queryKey: ['/api/sessions', 'today'],
    refetchInterval: false,
  });

  // Calculate today's statistics
  const todayMinutes = Math.floor(
    todaySessions.reduce((total, session) => total + session.duration, 0) / 60
  );
  const sessionsToday = todaySessions.length;
  const dailyGoal = 30; // minutes

  // Calculate overall statistics
  const totalSessions = sessions.length;
  const totalMinutes = Math.floor(
    sessions.reduce((total, session) => total + session.duration, 0) / 60
  );
  const averageSessionMinutes = totalSessions > 0 ? Math.floor(totalMinutes / totalSessions) : 0;

  // Calculate current streak (simplified - just based on recent sessions)
  const currentStreak = Math.min(sessions.length, 7);
  const longestStreak = Math.min(sessions.length, 21);

  const formatTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    }
  };

  const getSessionName = (index: number): string => {
    const names = ['Morning Meditation', 'Midday Reset', 'Evening Calm', 'Night Peace'];
    return names[index % names.length];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
          <CardContent className="p-6 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium text-gray-800 mb-6">Today's Progress</h2>
          
          <div className="text-center mb-6">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="3"
                />
                <path 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="hsl(184 29.4% 50%)" 
                  strokeWidth="3" 
                  strokeDasharray={`${Math.min((todayMinutes / dailyGoal) * 100, 100)}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-medium text-gray-800" data-testid="today-minutes">
                    {todayMinutes}
                  </div>
                  <div className="text-sm text-gray-600">minutes</div>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600" data-testid="daily-goal">
              Goal: {dailyGoal} minutes
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-medium text-gray-800" data-testid="sessions-today">
                {sessionsToday}
              </div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-gray-800" data-testid="current-streak">
                {currentStreak}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium text-gray-800 mb-6">Recent Sessions</h2>
          
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No sessions yet. Start your first meditation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.slice(0, 3).map((session, index) => (
                <div 
                  key={session.id} 
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  data-testid={`session-item-${index}`}
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {getSessionName(index)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(session.completedAt.toString())}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sage">
                      {Math.floor(session.duration / 60)} min
                    </div>
                    <div className="flex text-yellow-400 text-xs">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 ${
                            star <= (session.rating || 5) ? 'fill-current' : ''
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sessions.length > 3 && (
            <Button 
              variant="outline" 
              className="w-full mt-6 border-sage text-sage hover:bg-sage hover:text-white"
              data-testid="button-view-all-sessions"
            >
              View All Sessions
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium text-gray-800 mb-6">Statistics</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Sessions</span>
              <span className="font-medium text-gray-800" data-testid="total-sessions">
                {totalSessions}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Time</span>
              <span className="font-medium text-gray-800" data-testid="total-time">
                {formatTime(totalMinutes)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Average Session</span>
              <span className="font-medium text-gray-800" data-testid="average-session">
                {averageSessionMinutes} min
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Longest Streak</span>
              <span className="font-medium text-gray-800" data-testid="longest-streak">
                {longestStreak} days
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

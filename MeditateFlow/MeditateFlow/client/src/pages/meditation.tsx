import { Clover, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmbientSounds } from "@/components/ambient-sounds";
import { SessionTimer } from "@/components/session-timer";
import { SessionTracking } from "@/components/session-tracking";
import { useSession } from "@/hooks/use-session";

export default function MeditationPage() {
  const {
    sessionState,
    breathingSettings,
    intervalBells,
    setBreathingSettings,
    setIntervalBells,
    startSession,
    pauseSession,
    stopSession,
    setDuration,
    formatTime,
    getProgressPercentage
  } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand via-white to-lavender">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sage to-teal rounded-full flex items-center justify-center">
            <Clover className="text-white text-lg" />
          </div>
          <h1 className="text-2xl font-light text-gray-800">Serenity</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-600 hover:text-sage transition-colors duration-300"
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-600 hover:text-sage transition-colors duration-300"
            data-testid="button-profile"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel: Ambient Sounds */}
          <div className="lg:col-span-1">
            <AmbientSounds
              intervalBells={intervalBells}
              onIntervalBellsChange={setIntervalBells}
            />
          </div>

          {/* Center Panel: Session Timer */}
          <div className="lg:col-span-1">
            <SessionTimer
              sessionState={sessionState}
              breathingSettings={breathingSettings}
              formatTime={formatTime}
              getProgressPercentage={getProgressPercentage}
              onStart={startSession}
              onPause={pauseSession}
              onStop={stopSession}
              onDurationChange={setDuration}
              onBreathingSettingsChange={setBreathingSettings}
            />
          </div>

          {/* Right Panel: Session Tracking */}
          <div className="lg:col-span-1">
            <SessionTracking />
          </div>
        </div>
      </div>

      {/* Background overlay */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center opacity-5" 
        style={{
          backgroundImage: "url('https://pixabay.com/get/g5287747e646dd4921c0bdea373e06827a033c6177b6186fff21897d2b4b7801579ccb09a98c66847f268197b3117df6bc97087ef0f5c51cabcd0cc807bee1b84_1280.jpg')"
        }}
      />
    </div>
  );
}

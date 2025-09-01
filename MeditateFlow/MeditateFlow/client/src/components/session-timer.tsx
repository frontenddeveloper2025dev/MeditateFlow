import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square } from "lucide-react";
import { BreathingAnimation } from "./breathing-animation";
import { cn } from "@/lib/utils";

interface SessionTimerProps {
  sessionState: {
    isActive: boolean;
    isPaused: boolean;
    currentTime: number;
    duration: number;
    breathingPhase: 'inhale' | 'hold' | 'exhale';
  };
  breathingSettings: {
    inhale: number;
    hold: number;
    exhale: number;
  };
  formatTime: (seconds?: number) => string;
  getProgressPercentage: () => number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onDurationChange: (duration: number) => void;
  onBreathingSettingsChange: (settings: { inhale: number; hold: number; exhale: number }) => void;
}

export function SessionTimer({
  sessionState,
  breathingSettings,
  formatTime,
  getProgressPercentage,
  onStart,
  onPause,
  onStop,
  onDurationChange,
  onBreathingSettingsChange
}: SessionTimerProps) {
  const durationPresets = [
    { label: '5min', value: 300 },
    { label: '10min', value: 600 },
    { label: '20min', value: 1200 },
    { label: '30min', value: 1800 }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
      <CardContent className="p-8 text-center">
        {/* Session Presets */}
        <div className="flex justify-center space-x-2 mb-8" data-testid="duration-presets">
          {durationPresets.map((preset) => (
            <Button
              key={preset.value}
              size="sm"
              variant="ghost"
              className={cn(
                "rounded-full shadow-md hover:scale-105 transition-all duration-200",
                sessionState.duration === preset.value
                  ? "bg-sage text-white hover:bg-sage/90"
                  : "bg-gray-200 text-gray-700 hover:bg-sage hover:text-white"
              )}
              onClick={() => onDurationChange(preset.value)}
              disabled={sessionState.isActive}
              data-testid={`button-duration-${preset.value}`}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Breathing Animation */}
        <BreathingAnimation
          isActive={sessionState.isActive && !sessionState.isPaused}
          breathingPhase={sessionState.breathingPhase}
          breathingSettings={breathingSettings}
        />

        {/* Timer Display */}
        <div className="mb-8">
          <div className="text-4xl font-light text-gray-800 mb-2" data-testid="timer-display">
            {formatTime()}
          </div>
          <Progress 
            value={getProgressPercentage()} 
            className="w-full h-2"
            data-testid="session-progress"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4 mb-8" data-testid="session-controls">
          <Button
            size="lg"
            className="w-16 h-16 bg-gradient-to-br from-sage to-teal hover:scale-105 transition-transform duration-200 rounded-full shadow-lg"
            onClick={sessionState.isActive ? onPause : onStart}
            data-testid="button-play-pause"
          >
            {sessionState.isActive && !sessionState.isPaused ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>
          <Button
            size="lg"
            variant="destructive"
            className="w-16 h-16 hover:scale-105 transition-transform duration-200 rounded-full shadow-lg"
            onClick={onStop}
            disabled={!sessionState.isActive}
            data-testid="button-stop"
          >
            <Square className="w-6 h-6" />
          </Button>
        </div>

        {/* Breathing Rhythm Settings */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Breathing Rhythm</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Inhale</span>
              <Select
                value={breathingSettings.inhale.toString()}
                onValueChange={(value) => 
                  onBreathingSettingsChange({ ...breathingSettings, inhale: parseInt(value) })
                }
                disabled={sessionState.isActive}
              >
                <SelectTrigger className="w-24" data-testid="select-inhale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 sec</SelectItem>
                  <SelectItem value="5">5 sec</SelectItem>
                  <SelectItem value="6">6 sec</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Hold</span>
              <Select
                value={breathingSettings.hold.toString()}
                onValueChange={(value) => 
                  onBreathingSettingsChange({ ...breathingSettings, hold: parseInt(value) })
                }
                disabled={sessionState.isActive}
              >
                <SelectTrigger className="w-24" data-testid="select-hold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 sec</SelectItem>
                  <SelectItem value="6">6 sec</SelectItem>
                  <SelectItem value="7">7 sec</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Exhale</span>
              <Select
                value={breathingSettings.exhale.toString()}
                onValueChange={(value) => 
                  onBreathingSettingsChange({ ...breathingSettings, exhale: parseInt(value) })
                }
                disabled={sessionState.isActive}
              >
                <SelectTrigger className="w-24" data-testid="select-exhale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 sec</SelectItem>
                  <SelectItem value="6">6 sec</SelectItem>
                  <SelectItem value="8">8 sec</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { cn } from "@/lib/utils";

interface BreathingAnimationProps {
  isActive: boolean;
  breathingPhase: 'inhale' | 'hold' | 'exhale';
  breathingSettings: {
    inhale: number;
    hold: number;
    exhale: number;
  };
}

export function BreathingAnimation({ 
  isActive, 
  breathingPhase, 
  breathingSettings 
}: BreathingAnimationProps) {
  const totalCycle = breathingSettings.inhale + breathingSettings.hold + breathingSettings.exhale;
  
  const getPhaseText = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Breathe';
    }
  };

  return (
    <div className="relative flex items-center justify-center mb-8" data-testid="breathing-animation">
      {/* Pulse rings */}
      <div className="absolute w-64 h-64 bg-gradient-to-r from-sage/20 to-teal/20 rounded-full animate-ripple" />
      <div 
        className="absolute w-56 h-56 bg-gradient-to-r from-sage/30 to-teal/30 rounded-full animate-ripple" 
        style={{ animationDelay: '0.5s' }}
      />
      
      {/* Main breathing circle */}
      <div 
        className={cn(
          "w-48 h-48 bg-gradient-to-br from-sage to-teal rounded-full flex items-center justify-center shadow-2xl transition-transform duration-1000",
          isActive && "breathing-circle session-active"
        )}
        style={{
          '--breath-duration': `${totalCycle}s`,
          animationDuration: isActive ? `${totalCycle}s` : '4s'
        } as React.CSSProperties}
        data-testid="breathing-circle"
      >
        <div className="text-center text-white">
          <div className="text-sm font-light mb-1">Breathe</div>
          <div className="text-3xl font-light" data-testid="breathing-phase-text">
            {getPhaseText()}
          </div>
        </div>
      </div>
    </div>
  );
}

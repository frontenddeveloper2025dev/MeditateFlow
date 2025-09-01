import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { MeditationSession } from "@shared/schema";
import { useAudio } from "./use-audio";

export interface BreathingSettings {
  inhale: number;
  hold: number;
  exhale: number;
}

export interface IntervalBellSettings {
  enabled: boolean;
  interval: number; // in seconds
}

export interface SessionState {
  isActive: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  breathingPhase: 'inhale' | 'hold' | 'exhale';
}

export function useSession() {
  const queryClient = useQueryClient();
  const { startIntervalBells, stopIntervalBells, playBell } = useAudio();
  
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: false,
    isPaused: false,
    currentTime: 0,
    duration: 600, // 10 minutes default
    breathingPhase: 'inhale'
  });

  const [breathingSettings, setBreathingSettings] = useState<BreathingSettings>({
    inhale: 4,
    hold: 4,
    exhale: 4
  });

  const [intervalBells, setIntervalBells] = useState<IntervalBellSettings>({
    enabled: true,
    interval: 300 // 5 minutes
  });

  const timerRef = useRef<NodeJS.Timeout>();
  const breathingRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();

  // Fetch user preferences
  const { data: preferences } = useQuery({
    queryKey: ['/api/preferences'],
  });

  // Apply preferences when loaded
  useEffect(() => {
    if (preferences) {
      if (preferences.defaultBreathingSettings) {
        const breathingData = JSON.parse(preferences.defaultBreathingSettings);
        setBreathingSettings(breathingData);
      }
      if (preferences.defaultIntervalBells) {
        const bellData = JSON.parse(preferences.defaultIntervalBells);
        setIntervalBells(bellData);
      }
    }
  }, [preferences]);

  // Save session mutation
  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData: {
      duration: number;
      ambientSounds: string;
      breathingSettings: string;
      intervalBells: string;
      rating?: number;
    }) => {
      const response = await apiRequest('POST', '/api/sessions', sessionData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', 'today'] });
    }
  });

  // Breathing animation cycle
  useEffect(() => {
    if (sessionState.isActive && !sessionState.isPaused) {
      const totalCycle = breathingSettings.inhale + breathingSettings.hold + breathingSettings.exhale;
      let phaseTime = 0;

      const updateBreathingPhase = () => {
        phaseTime = (phaseTime + 1) % totalCycle;
        
        if (phaseTime < breathingSettings.inhale) {
          setSessionState(prev => ({ ...prev, breathingPhase: 'inhale' }));
        } else if (phaseTime < breathingSettings.inhale + breathingSettings.hold) {
          setSessionState(prev => ({ ...prev, breathingPhase: 'hold' }));
        } else {
          setSessionState(prev => ({ ...prev, breathingPhase: 'exhale' }));
        }
      };

      breathingRef.current = setInterval(updateBreathingPhase, 1000);
      
      return () => {
        if (breathingRef.current) {
          clearInterval(breathingRef.current);
        }
      };
    }
  }, [sessionState.isActive, sessionState.isPaused, breathingSettings]);

  // Session timer
  useEffect(() => {
    if (sessionState.isActive && !sessionState.isPaused) {
      timerRef.current = setInterval(() => {
        setSessionState(prev => {
          const newTime = prev.currentTime + 1;
          
          // Check if session is complete
          if (newTime >= prev.duration) {
            return {
              ...prev,
              currentTime: prev.duration,
              isActive: false
            };
          }
          
          return {
            ...prev,
            currentTime: newTime
          };
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [sessionState.isActive, sessionState.isPaused]);

  // Handle session completion
  useEffect(() => {
    if (sessionState.currentTime >= sessionState.duration && sessionState.isActive) {
      completeSession();
    }
  }, [sessionState.currentTime, sessionState.duration, sessionState.isActive]);

  const startSession = () => {
    startTimeRef.current = Date.now();
    setSessionState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false,
      currentTime: 0
    }));

    if (intervalBells.enabled) {
      startIntervalBells(intervalBells.interval);
    }

    // Play starting bell
    playBell();
  };

  const pauseSession = () => {
    setSessionState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));

    if (sessionState.isPaused) {
      if (intervalBells.enabled) {
        startIntervalBells(intervalBells.interval);
      }
    } else {
      stopIntervalBells();
    }
  };

  const stopSession = () => {
    if (sessionState.currentTime > 30) { // Only save sessions longer than 30 seconds
      const actualDuration = Math.floor(sessionState.currentTime);
      completeSession(actualDuration);
    }

    resetSession();
  };

  const completeSession = (actualDuration?: number) => {
    const duration = actualDuration || sessionState.duration;
    
    // Play completion bell
    playBell();
    
    // Save session
    saveSessionMutation.mutate({
      duration,
      ambientSounds: JSON.stringify({}), // TODO: Get current ambient sound state
      breathingSettings: JSON.stringify(breathingSettings),
      intervalBells: JSON.stringify(intervalBells)
    });

    stopIntervalBells();
  };

  const resetSession = () => {
    setSessionState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      currentTime: 0,
      breathingPhase: 'inhale'
    }));

    stopIntervalBells();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (breathingRef.current) {
      clearInterval(breathingRef.current);
    }
  };

  const setDuration = (duration: number) => {
    if (!sessionState.isActive) {
      setSessionState(prev => ({ ...prev, duration }));
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return Math.round((sessionState.currentTime / sessionState.duration) * 100);
  };

  return {
    sessionState,
    breathingSettings,
    intervalBells,
    setBreathingSettings,
    setIntervalBells,
    startSession,
    pauseSession,
    stopSession,
    setDuration,
    formatTime: (seconds?: number) => formatTime(seconds ?? sessionState.currentTime),
    getProgressPercentage,
    isLoading: saveSessionMutation.isPending
  };
}

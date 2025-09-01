import { useState, useEffect } from "react";
import { audioManager, type AmbientSound } from "@/lib/audio-manager";

export function useAudio() {
  const [sounds, setSounds] = useState<AmbientSound[]>([]);

  useEffect(() => {
    setSounds(audioManager.getSounds());
  }, []);

  const toggleSound = (soundName: string) => {
    const isPlaying = audioManager.toggleSound(soundName);
    setSounds(audioManager.getSounds());
    return isPlaying;
  };

  const setVolume = (soundName: string, volume: number) => {
    audioManager.setVolume(soundName, volume);
    setSounds(audioManager.getSounds());
  };

  const stopAllSounds = () => {
    audioManager.stopAllSounds();
    setSounds(audioManager.getSounds());
  };

  const startIntervalBells = (intervalSeconds: number) => {
    audioManager.startIntervalBells(intervalSeconds);
  };

  const stopIntervalBells = () => {
    audioManager.stopIntervalBells();
  };

  const playBell = () => {
    audioManager.playBell();
  };

  return {
    sounds,
    toggleSound,
    setVolume,
    stopAllSounds,
    startIntervalBells,
    stopIntervalBells,
    playBell,
  };
}

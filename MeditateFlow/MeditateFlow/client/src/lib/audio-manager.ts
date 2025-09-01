export interface AmbientSound {
  name: string;
  url: string;
  audio?: HTMLAudioElement;
  isPlaying: boolean;
  volume: number;
}

export class AudioManager {
  private sounds: Map<string, AmbientSound> = new Map();
  private intervalBellAudio?: HTMLAudioElement;
  private intervalTimer?: NodeJS.Timeout;

  constructor() {
    this.initializeSounds();
    this.initializeBell();
  }

  private initializeSounds() {
    const soundConfigs = [
      { name: 'rain', url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcfCDOH0fPSgC4HGm7A7+OZURE==' },
      { name: 'ocean', url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcfCDOH0fPSgC4HGm7A7+OZURE=' },
      { name: 'forest', url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcfCDOH0fPSgC4HGm7A7+OZURE=' },
      { name: 'wind', url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmcfCDOH0fPSgC4HGm7A7+OZURE=' }
    ];

    soundConfigs.forEach(config => {
      const audio = new Audio(config.url);
      audio.loop = true;
      audio.volume = 0;
      
      this.sounds.set(config.name, {
        name: config.name,
        url: config.url,
        audio,
        isPlaying: false,
        volume: 0
      });
    });
  }

  private initializeBell() {
    // Simple bell sound data URI
    const bellUrl = 'data:audio/wav;base64,UklGRs4DAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YaoDAAC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4';
    this.intervalBellAudio = new Audio(bellUrl);
    this.intervalBellAudio.volume = 0.5;
  }

  toggleSound(soundName: string): boolean {
    const sound = this.sounds.get(soundName);
    if (!sound || !sound.audio) return false;

    if (sound.isPlaying) {
      sound.audio.pause();
      sound.isPlaying = false;
    } else {
      sound.audio.currentTime = 0;
      sound.audio.play().catch(console.error);
      sound.isPlaying = true;
    }

    this.sounds.set(soundName, sound);
    return sound.isPlaying;
  }

  setVolume(soundName: string, volume: number): void {
    const sound = this.sounds.get(soundName);
    if (!sound || !sound.audio) return;

    const normalizedVolume = Math.max(0, Math.min(1, volume / 100));
    sound.audio.volume = normalizedVolume;
    sound.volume = volume;
    
    this.sounds.set(soundName, sound);
  }

  stopAllSounds(): void {
    this.sounds.forEach(sound => {
      if (sound.audio && sound.isPlaying) {
        sound.audio.pause();
        sound.isPlaying = false;
      }
    });
  }

  startIntervalBells(intervalSeconds: number): void {
    this.stopIntervalBells();
    
    this.intervalTimer = setInterval(() => {
      if (this.intervalBellAudio) {
        this.intervalBellAudio.currentTime = 0;
        this.intervalBellAudio.play().catch(console.error);
      }
    }, intervalSeconds * 1000);
  }

  stopIntervalBells(): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = undefined;
    }
  }

  playBell(): void {
    if (this.intervalBellAudio) {
      this.intervalBellAudio.currentTime = 0;
      this.intervalBellAudio.play().catch(console.error);
    }
  }

  getSounds(): AmbientSound[] {
    return Array.from(this.sounds.values());
  }

  getSound(name: string): AmbientSound | undefined {
    return this.sounds.get(name);
  }
}

export const audioManager = new AudioManager();

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";

interface AmbientSoundsProps {
  intervalBells: {
    enabled: boolean;
    interval: number;
  };
  onIntervalBellsChange: (settings: { enabled: boolean; interval: number }) => void;
}

export function AmbientSounds({ intervalBells, onIntervalBellsChange }: AmbientSoundsProps) {
  const { sounds, toggleSound, setVolume } = useAudio();

  const soundImages = {
    rain: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    ocean: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    forest: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    wind: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-white/50">
      <CardContent className="p-6">
        <h2 className="text-xl font-medium text-gray-800 mb-6">Ambient Sounds</h2>
        
        <div className="space-y-4">
          {sounds.map((sound) => (
            <div key={sound.name} className="sound-control" data-testid={`sound-control-${sound.name}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <img 
                    src={soundImages[sound.name as keyof typeof soundImages]} 
                    alt={`${sound.name} sound`} 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                  <span className="font-medium text-gray-700 capitalize">{sound.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`w-8 h-8 rounded-full shadow-md hover:scale-105 transition-transform duration-200 ${
                    sound.isPlaying 
                      ? 'bg-red-400 hover:bg-red-500 text-white' 
                      : 'bg-sage hover:bg-sage/90 text-white'
                  }`}
                  onClick={() => toggleSound(sound.name)}
                  data-testid={`button-toggle-${sound.name}`}
                >
                  {sound.isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>
              </div>
              <Slider
                value={[sound.volume]}
                onValueChange={(value) => setVolume(sound.name, value[0])}
                max={100}
                step={1}
                className="volume-slider"
                data-testid={`slider-volume-${sound.name}`}
              />
            </div>
          ))}
        </div>

        {/* Interval Bells Settings */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Interval Bells</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Enable Bells</span>
              <Switch
                checked={intervalBells.enabled}
                onCheckedChange={(checked) => 
                  onIntervalBellsChange({ ...intervalBells, enabled: checked })
                }
                data-testid="switch-interval-bells"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Interval</span>
              <Select
                value={intervalBells.interval.toString()}
                onValueChange={(value) => 
                  onIntervalBellsChange({ ...intervalBells, interval: parseInt(value) })
                }
              >
                <SelectTrigger className="w-32" data-testid="select-interval">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                  <SelectItem value="600">10 minutes</SelectItem>
                  <SelectItem value="900">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

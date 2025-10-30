import { useState } from "react";
import { Cpu, Monitor, Flame, Wind } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";
import wifiOn from "@/assets/wifi-on.webp";
import wifiOff from "@/assets/wifi-off.webp";
import gameScene from "@/assets/game-scene.jpg";

interface BoostAssistantProps {
  cpuUsage: number;
  ramUsage: number;
  fps: number;
  gpuUsage: number;
  isBoosted: boolean;
  isVisible: boolean;
  wifiEnabled: boolean;
  setWifiEnabled: (enabled: boolean) => void;
}

export const BoostAssistant = ({ cpuUsage, ramUsage, fps, gpuUsage, isBoosted, isVisible, wifiEnabled, setWifiEnabled }: BoostAssistantProps) => {
  if (!isVisible) return null;
  const [fanMode, setFanMode] = useState<"auto" | "max">("auto");
  const [diabloMode, setDiabloMode] = useState(false);

  const toggleFanMode = () => {
    const newMode = fanMode === "auto" ? "max" : "auto";
    setFanMode(newMode);
    toast.success(`Fan Mode: ${newMode.toUpperCase()}`, {
      description: newMode === "max" ? "Maximum cooling activated" : "Auto cooling enabled",
    });
  };

  const toggleDiabloMode = () => {
    setDiabloMode(!diabloMode);
    toast.success(!diabloMode ? "Diablo Mode Activated! 🔥" : "Diablo Mode Deactivated", {
      description: !diabloMode ? "Extreme performance unlocked" : "Normal mode restored",
    });
  };

  const getStatusColor = (value: number) => {
    if (value <= 40) return "text-primary";
    if (value <= 70) return "text-accent";
    return "text-destructive";
  };

  return (
    <>
      {/* LEFT PANEL - CPU, GPU, Modes */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 w-80 h-[600px]">
        <Card className="h-full bg-card/95 backdrop-blur-xl border-primary/30 shadow-[0_0_40px_rgba(16,185,129,0.3)] p-6 flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            {/* CPU Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-sm">CPU</span>
                </div>
                <span className={`text-2xl font-bold ${getStatusColor(cpuUsage)}`}>
                  {Math.round(cpuUsage)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-performance transition-all duration-500"
                  style={{ width: `${cpuUsage}%` }}
                />
              </div>
            </div>

            {/* GPU Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm">GPU</span>
                </div>
                <span className={`text-2xl font-bold ${getStatusColor(gpuUsage)}`}>
                  {Math.round(gpuUsage)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-boost transition-all duration-500"
                  style={{ width: `${gpuUsage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Mode Buttons */}
          <div className="space-y-2">
            <Button
              variant={wifiEnabled ? "default" : "outline"}
              className="w-full"
              onClick={() => {
                setWifiEnabled(!wifiEnabled);
                toast.success(wifiEnabled ? "WiFi Disabled" : "WiFi Enabled");
              }}
            >
              <img 
                src={wifiEnabled ? wifiOn : wifiOff} 
                alt="WiFi" 
                className="w-4 h-4 mr-2"
              />
              WiFi: {wifiEnabled ? "ON" : "OFF"}
            </Button>
            <Button
              variant={fanMode === "max" ? "default" : "outline"}
              className="w-full"
              onClick={toggleFanMode}
            >
              <Wind className="w-4 h-4 mr-2" />
              Fan: {fanMode.toUpperCase()}
            </Button>
            <Button
              variant={diabloMode ? "default" : "outline"}
              className={`w-full ${diabloMode ? "bg-destructive hover:bg-destructive/90 shadow-[0_0_20px_rgba(239,68,68,0.5)]" : ""}`}
              onClick={toggleDiabloMode}
            >
              <Flame className="w-4 h-4 mr-2" />
              Diablo Mode
            </Button>
          </div>
        </Card>
      </div>

      {/* RIGHT PANEL - RAM, FPS, Game Scene */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-80 h-[600px]">
        <Card className="h-full bg-card/95 backdrop-blur-xl border-accent/30 shadow-[0_0_40px_rgba(59,130,246,0.3)] p-6 flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            {/* RAM Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm">RAM</span>
                </div>
                <span className={`text-2xl font-bold ${getStatusColor(ramUsage)}`}>
                  {Math.round(ramUsage)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-gaming transition-all duration-500"
                  style={{ width: `${ramUsage}%` }}
                />
              </div>
            </div>

            {/* FPS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">FPS</span>
                <span className={`text-4xl font-bold ${fps >= 100 ? "text-primary" : fps >= 60 ? "text-accent" : "text-destructive"}`}>
                  {Math.round(fps)}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-boost transition-all duration-500"
                  style={{ width: `${Math.min(100, (fps / 144) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {fps >= 100 ? "Excellent" : fps >= 60 ? "Good" : "Low"}
              </p>
            </div>
          </div>

          {/* Game Scene Image */}
          <div className="mt-4 rounded-lg overflow-hidden border-2 border-primary/20">
            <img 
              src={gameScene} 
              alt="Game Scene" 
              className="w-full h-auto object-cover"
            />
          </div>
        </Card>
      </div>
    </>
  );
};

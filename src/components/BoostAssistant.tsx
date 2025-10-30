import { useState } from "react";
import { Cpu, Monitor, Flame, Wind, Thermometer, Gamepad2, Chrome, Youtube, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";
import wifiOn from "@/assets/wifi-on.webp";
import wifiOff from "@/assets/wifi-off.webp";

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
  const [cpuTemp, setCpuTemp] = useState(65);
  const [gpuTemp, setGpuTemp] = useState(58);

  const gameApps = [
    { name: "Game 1", icon: Gamepad2, color: "bg-red-500" },
    { name: "Game 2", icon: Gamepad2, color: "bg-blue-500" },
    { name: "Chrome", icon: Chrome, color: "bg-yellow-500" },
    { name: "YouTube", icon: Youtube, color: "bg-red-600" },
    { name: "Chat", icon: MessageSquare, color: "bg-green-500" },
  ];

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
        <Card className="h-full bg-gradient-to-b from-card/95 to-card/90 backdrop-blur-xl border-2 border-primary/40 shadow-[0_0_40px_rgba(16,185,129,0.3)] p-0 flex flex-col overflow-hidden relative">
          {/* Decorative Red Bars */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-red-500 via-red-600 to-red-500" />
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-red-500 via-red-600 to-red-500" />
          
          {/* Game Shortcuts */}
          <div className="flex justify-around items-center gap-2 p-3 bg-muted/30 border-b border-primary/20">
            {gameApps.map((app, index) => (
              <Button
                key={index}
                size="icon"
                variant="ghost"
                className={`${app.color} hover:opacity-80 h-10 w-10 rounded-lg shadow-lg`}
                onClick={() => toast.success(`Launching ${app.name}`)}
              >
                <app.icon className="h-5 w-5 text-white" />
              </Button>
            ))}
          </div>

          <div className="flex-1 p-6 space-y-4">
            {/* CPU Usage with Temperature */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-sm">CPU</span>
                  <div className="flex items-center gap-1 text-xs">
                    <Thermometer className="w-3 h-3" />
                    <span>{cpuTemp}°C</span>
                  </div>
                </div>
                <span className={`text-3xl font-bold ${getStatusColor(cpuUsage)}`}>
                  {Math.round(cpuUsage)}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden border border-primary/20">
                <div
                  className="h-full bg-gradient-performance transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{ width: `${cpuUsage}%` }}
                />
              </div>
            </div>

            {/* GPU Usage with Temperature */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm">GPU</span>
                  <div className="flex items-center gap-1 text-xs">
                    <Thermometer className="w-3 h-3" />
                    <span>{gpuTemp}°C</span>
                  </div>
                </div>
                <span className={`text-3xl font-bold ${getStatusColor(gpuUsage)}`}>
                  {Math.round(gpuUsage)}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden border border-primary/20">
                <div
                  className="h-full bg-gradient-boost transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  style={{ width: `${gpuUsage}%` }}
                />
              </div>
            </div>

            {/* Network Status */}
            <div className="p-3 bg-muted/20 rounded-lg border border-accent/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Network</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1 h-3 bg-primary rounded" />
                    <div className="w-1 h-4 bg-primary rounded" />
                    <div className="w-1 h-5 bg-primary rounded" />
                    <div className="w-1 h-6 bg-primary rounded" />
                  </div>
                  <span className="text-xs text-primary font-bold">Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mode Buttons */}
          <div className="p-4 space-y-2 bg-muted/20 border-t border-primary/20">
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

      {/* RIGHT PANEL - RAM, FPS, Gaming Info */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-80 h-[600px]">
        <Card className="h-full bg-gradient-to-b from-card/95 to-card/90 backdrop-blur-xl border-2 border-accent/40 shadow-[0_0_40px_rgba(59,130,246,0.3)] p-0 flex flex-col overflow-hidden relative">
          {/* Decorative Red Bars */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-red-500 via-red-600 to-red-500" />
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-red-500 via-red-600 to-red-500" />
          
          {/* FPS Display - Large and Prominent */}
          <div className="p-6 bg-muted/30 border-b border-accent/20 text-center">
            <div className="text-xs text-muted-foreground mb-1">FRAMES PER SECOND</div>
            <div className={`text-6xl font-bold tracking-tight ${fps >= 100 ? "text-primary" : fps >= 60 ? "text-accent" : "text-destructive"}`}>
              {Math.round(fps)}
            </div>
            <div className="text-xs mt-2 font-medium">
              {fps >= 100 ? "🔥 ULTRA SMOOTH" : fps >= 60 ? "✓ SMOOTH" : "⚠ LOW"}
            </div>
          </div>

          <div className="flex-1 p-6 space-y-4">
            {/* RAM Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm">RAM</span>
                </div>
                <span className={`text-3xl font-bold ${getStatusColor(ramUsage)}`}>
                  {Math.round(ramUsage)}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden border border-accent/20">
                <div
                  className="h-full bg-gradient-gaming transition-all duration-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                  style={{ width: `${ramUsage}%` }}
                />
              </div>
            </div>

            {/* Performance Score */}
            <div className="p-4 bg-muted/20 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Performance Score</span>
                <span className="text-2xl font-bold text-primary">
                  {Math.round((100 - cpuUsage + 100 - ramUsage + fps) / 3)}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500"
                  style={{ width: `${Math.round((100 - cpuUsage + 100 - ramUsage + fps) / 3)}%` }}
                />
              </div>
            </div>

            {/* Gaming Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/10 rounded">
                <span className="text-xs">Boost Status</span>
                <span className={`text-xs font-bold ${isBoosted ? "text-primary" : "text-muted-foreground"}`}>
                  {isBoosted ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/10 rounded">
                <span className="text-xs">WiFi Status</span>
                <span className={`text-xs font-bold ${wifiEnabled ? "text-yellow-500" : "text-muted-foreground"}`}>
                  {wifiEnabled ? "CONNECTED" : "OFFLINE"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/10 rounded">
                <span className="text-xs">Fan Mode</span>
                <span className={`text-xs font-bold ${fanMode === "max" ? "text-accent" : "text-muted-foreground"}`}>
                  {fanMode.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

import { useState, useEffect } from "react";
import { Cpu, Monitor, Flame, Wind, Thermometer, Gamepad2, Chrome, Youtube, MessageSquare, Volume2, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { toast } from "sonner";
import wifiOn from "@/assets/wifi-on.webp";
import wifiOff from "@/assets/wifi-off.webp";

interface BoostAssistantProps {
  cpuUsage: number;
  ramUsage: number;
  fps: number;
  gpuUsage: number;
  performanceMode: "saving" | "balance" | "boost";
  isVisible: boolean;
  wifiEnabled: boolean;
  setWifiEnabled: (enabled: boolean) => void;
}

export const BoostAssistant = ({ cpuUsage, ramUsage, fps, gpuUsage, performanceMode, isVisible, wifiEnabled, setWifiEnabled }: BoostAssistantProps) => {
  if (!isVisible) return null;
  const [fanMode, setFanMode] = useState<"auto" | "max">("auto");
  const [diabloMode, setDiabloMode] = useState(false);
  const [cpuTemp, setCpuTemp] = useState(65);
  const [gpuTemp, setGpuTemp] = useState(58);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const gameApps = [
    { name: "Game 1", icon: Gamepad2, color: "bg-gradient-to-br from-red-500 to-red-600" },
    { name: "Game 2", icon: Gamepad2, color: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { name: "Chrome", icon: Chrome, color: "bg-gradient-to-br from-yellow-500 to-yellow-600" },
    { name: "YouTube", icon: Youtube, color: "bg-gradient-to-br from-red-600 to-pink-600" },
    { name: "Chat", icon: MessageSquare, color: "bg-gradient-to-br from-green-500 to-green-600" },
  ];

  const gamingTools = [
    { name: "ROG Instant\nMaster", icon: Flame },
    { name: "X Sense", icon: Cpu },
    { name: "AI Grabber", icon: Chrome },
    { name: "Macro", icon: Gamepad2 },
    { name: "Blocked\ntouch", icon: Monitor },
    { name: "Vibration\nMapping", icon: Wind },
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

  const CircularGauge = ({ value, label, temp, color }: { value: number; label: string; temp: number; color: string }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    
    return (
      <div className="relative flex flex-col items-center">
        <svg className="transform -rotate-90" width="140" height="140">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className={`text-3xl font-bold ${getStatusColor(value)}`}>
            {Math.round(value)}%
          </div>
          <div className="text-xs text-muted-foreground font-semibold">{label}</div>
          <div className="flex items-center justify-center gap-1 text-xs mt-1">
            <Thermometer className="w-3 h-3" />
            <span>{temp}°C</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* LEFT PANEL - CPU, GPU, Modes */}
      <div 
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 w-80 h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full bg-gradient-to-b from-card/95 to-card/90 backdrop-blur-xl border-2 border-primary/40 shadow-[0_0_40px_rgba(16,185,129,0.3)] p-0 flex flex-col overflow-hidden relative select-none">
          {/* Segmented LED Bar - Left Edge */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-evenly py-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-10 bg-gradient-to-b from-red-500 via-red-600 to-red-500 rounded-sm border border-red-500/30"
                style={{ boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)' }}
              />
            ))}
          </div>

          {/* Performance Bars - Right Edge (CPU) */}
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center gap-1 py-4 px-1">
            {Array.from({ length: 20 }).map((_, i) => {
              const segmentThreshold = ((20 - i) / 20) * 100;
              const isActive = cpuUsage >= segmentThreshold;
              return (
                <div
                  key={i}
                  className={`w-2 h-6 rounded-sm transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-500 border border-red-500/30' 
                      : 'bg-muted/20 border border-muted/30'
                  }`}
                  style={isActive ? { boxShadow: '0 0 6px rgba(239, 68, 68, 0.5)' } : {}}
                />
              );
            })}
          </div>
          
          {/* Time and Battery */}
          <div className="flex items-center justify-between px-6 py-3 bg-muted/30 border-b border-primary/20">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">FPS</span>
                <span className={`text-lg font-bold ${fps >= 100 ? "text-primary" : fps >= 60 ? "text-accent" : "text-destructive"}`}>
                  {Math.round(fps)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs">{batteryLevel}%</div>
              <div className="w-8 h-4 border-2 border-primary rounded-sm relative">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${batteryLevel}%` }}
                />
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-2 bg-primary rounded-r" />
              </div>
            </div>
          </div>
          
          {/* Game Shortcuts */}
          <div className="flex justify-around items-center gap-2 p-3 bg-muted/30 border-b border-primary/20">
            {gameApps.map((app, index) => (
              <Button
                key={index}
                size="icon"
                variant="ghost"
                className={`${app.color} hover:opacity-80 hover:scale-110 h-10 w-10 rounded-lg shadow-lg transition-all`}
                onClick={() => toast.success(`Launching ${app.name}`)}
              >
                <app.icon className="h-5 w-5 text-white" />
              </Button>
            ))}
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-hidden">
            {/* Circular Gauges */}
            <div className="flex justify-around items-center">
              <CircularGauge 
                value={cpuUsage} 
                label="CPU" 
                temp={cpuTemp}
                color="rgba(16, 185, 129, 0.8)"
              />
              <CircularGauge 
                value={gpuUsage} 
                label="GPU" 
                temp={gpuTemp}
                color="rgba(59, 130, 246, 0.8)"
              />
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

            {/* Volume Control */}
            <div className="p-3 bg-muted/20 rounded-lg border border-accent/20">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-accent" />
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs font-medium w-8 text-right">{volume}%</span>
              </div>
            </div>

            {/* Brightness Control */}
            <div className="p-3 bg-muted/20 rounded-lg border border-accent/20">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-accent" />
                <Slider
                  value={[brightness]}
                  onValueChange={(value) => setBrightness(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs font-medium w-8 text-right">{brightness}%</span>
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
      <div 
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 w-80 h-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full bg-gradient-to-b from-card/95 to-card/90 backdrop-blur-xl border-2 border-accent/40 shadow-[0_0_40px_rgba(59,130,246,0.3)] p-0 flex flex-col overflow-hidden relative select-none">
          {/* Performance Bars - Left Edge (RAM) */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center gap-1 py-4 px-1">
            {Array.from({ length: 20 }).map((_, i) => {
              const segmentThreshold = ((20 - i) / 20) * 100;
              const isActive = ramUsage >= segmentThreshold;
              return (
                <div
                  key={i}
                  className={`w-2 h-6 rounded-sm transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-500 border border-red-500/30' 
                      : 'bg-muted/20 border border-muted/30'
                  }`}
                  style={isActive ? { boxShadow: '0 0 6px rgba(239, 68, 68, 0.5)' } : {}}
                />
              );
            })}
          </div>

          {/* Segmented LED Bar - Right Edge */}
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-evenly py-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-10 bg-gradient-to-b from-red-500 via-red-600 to-red-500 rounded-sm border border-red-500/30"
                style={{ boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)' }}
              />
            ))}
          </div>
          
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

          <div className="flex-1 p-6 space-y-4 overflow-hidden">
            {/* RAM Usage */}
            <div className="p-3 bg-muted/20 rounded-lg border border-accent/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm">RAM</span>
                </div>
                <span className={`text-2xl font-bold ${getStatusColor(ramUsage)}`}>
                  {Math.round(ramUsage)}%
                </span>
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

            {/* Gaming Tools */}
            <div className="p-4 bg-muted/20 rounded-lg border border-accent/20">
              <div className="text-xs font-semibold mb-3 text-center text-primary">GAMING TOOLS</div>
              <div className="grid grid-cols-3 gap-2">
                {gamingTools.map((tool, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="flex flex-col items-center justify-center h-20 p-2 bg-muted/30 hover:bg-primary/20 border border-primary/20 rounded-lg transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    onClick={() => toast.success(`${tool.name.replace('\n', ' ')} activated`)}
                  >
                    <tool.icon className="w-5 h-5 mb-1 text-primary" />
                    <span className="text-[9px] font-medium text-center leading-tight whitespace-pre-line">
                      {tool.name}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Gaming Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/10 rounded">
                <span className="text-xs">Performance Mode</span>
                <span className={`text-xs font-bold ${
                  performanceMode === "boost" ? "text-primary" : 
                  performanceMode === "balance" ? "text-accent" : 
                  "text-secondary"
                }`}>
                  {performanceMode.toUpperCase()}
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

import { useState, useEffect } from "react";
import { Cpu, Monitor, Flame, Wind, Thermometer, Gamepad2, Chrome, Youtube, MessageSquare, Volume2, Sun, Video, Battery, Gauge, Zap, Crosshair } from "lucide-react";
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
  setPerformanceMode: (mode: "saving" | "balance" | "boost") => void;
}

export const BoostAssistant = ({ cpuUsage, ramUsage, fps, gpuUsage, performanceMode, isVisible, wifiEnabled, setWifiEnabled, setPerformanceMode }: BoostAssistantProps) => {
  if (!isVisible) return null;
  const [fanMode, setFanMode] = useState<"auto" | "max">("auto");
  const [diabloMode, setDiabloMode] = useState(false);
  const [cpuTemp, setCpuTemp] = useState(65);
  const [gpuTemp, setGpuTemp] = useState(58);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [ping, setPing] = useState(24);
  const [crosshairEnabled, setCrosshairEnabled] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Real-time battery monitoring
  useEffect(() => {
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);

          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
          battery.addEventListener('chargingchange', () => {
            setIsCharging(battery.charging);
          });
        } catch (error) {
          // Fallback: simulate battery drain
          const interval = setInterval(() => {
            setBatteryLevel(prev => Math.max(20, prev - Math.random() * 0.5));
          }, 30000);
          return () => clearInterval(interval);
        }
      }
    };
    updateBattery();
  }, []);

  // Update recording duration
  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setRecordingDuration(0);
    }
  }, [isRecording]);

  // Simulate ping updates
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate realistic ping fluctuation (15-80ms range)
      setPing(prev => {
        const change = (Math.random() - 0.5) * 20;
        return Math.min(80, Math.max(15, Math.round(prev + change)));
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        // Request screen capture permission
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // Permission granted, start recording
        stream.getTracks().forEach(track => track.stop()); // Stop preview stream
        setIsRecording(true);
        toast.success("Recording Started 🔴", {
          description: "Screen capture in progress",
        });
      } catch (error) {
        toast.error("Permission Denied", {
          description: "Screen recording permission was not granted",
        });
      }
    } else {
      setIsRecording(false);
      toast.success("Recording Stopped", {
        description: `Recorded ${Math.floor(recordingDuration / 60)}:${String(recordingDuration % 60).padStart(2, '0')}`,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

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

  const getLEDColor = () => {
    switch (performanceMode) {
      case "saving":
        return { bg: "bg-gradient-to-b from-green-500 via-green-600 to-green-500", border: "border-green-500/30", shadow: "0 0 8px rgba(34, 197, 94, 0.6)", rgb: "rgba(34, 197, 94, 0.5)" };
      case "balance":
        return { bg: "bg-gradient-to-b from-yellow-500 via-yellow-600 to-yellow-500", border: "border-yellow-500/30", shadow: "0 0 8px rgba(234, 179, 8, 0.6)", rgb: "rgba(234, 179, 8, 0.5)" };
      case "boost":
        return { bg: "bg-gradient-to-b from-red-500 via-red-600 to-red-500", border: "border-red-500/30", shadow: "0 0 8px rgba(239, 68, 68, 0.6)", rgb: "rgba(239, 68, 68, 0.5)" };
      default:
        return { bg: "bg-gradient-to-b from-red-500 via-red-600 to-red-500", border: "border-red-500/30", shadow: "0 0 8px rgba(239, 68, 68, 0.6)", rgb: "rgba(239, 68, 68, 0.5)" };
    }
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
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 w-80 h-[600px] max-h-[calc(100vh-2rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full bg-gradient-to-b from-card/95 to-card/90 backdrop-blur-xl border-2 border-primary/40 shadow-[0_0_40px_rgba(16,185,129,0.3)] p-0 flex flex-col overflow-hidden relative select-none">
          {/* Segmented LED Bar - Left Edge */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-evenly py-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 h-10 ${getLEDColor().bg} rounded-sm border ${getLEDColor().border}`}
                style={{ boxShadow: getLEDColor().shadow }}
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
                      ? `${getLEDColor().bg.replace('from-', 'from-').replace('to-b', 'to-r')} border ${getLEDColor().border}` 
                      : 'bg-muted/20 border border-muted/30'
                  }`}
                  style={isActive ? { boxShadow: `0 0 6px ${getLEDColor().rgb}` } : {}}
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
              <div className="text-xs font-medium">{Math.round(batteryLevel)}%</div>
              <div className="w-8 h-4 border-2 border-primary rounded-sm relative overflow-hidden">
                <div 
                  className={`h-full transition-all ${isCharging ? 'bg-gradient-to-r from-primary to-accent animate-pulse' : 'bg-primary'}`}
                  style={{ width: `${batteryLevel}%` }}
                />
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-2 bg-primary rounded-r" />
              </div>
              {isCharging && <span className="text-[10px] text-accent">⚡</span>}
            </div>
          </div>
          

          <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
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
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Ping:</span>
                    <span className={`text-sm font-bold ${ping < 30 ? "text-primary" : ping < 60 ? "text-accent" : "text-destructive"}`}>
                      {ping}ms
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1 h-3 bg-primary rounded" />
                    <div className="w-1 h-4 bg-primary rounded" />
                    <div className="w-1 h-5 bg-primary rounded" />
                    <div className="w-1 h-6 bg-primary rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Volume and Brightness Controls - Horizontal */}
            <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-accent/20">
              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-accent flex-shrink-0" />
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs font-medium w-10 text-right">{volume}%</span>
              </div>

              {/* Brightness Control */}
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-accent flex-shrink-0" />
                <Slider
                  value={[brightness]}
                  onValueChange={(value) => setBrightness(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs font-medium w-10 text-right">{brightness}%</span>
              </div>
            </div>

            {/* Screen Recorder */}
            <div className="p-3 bg-muted/20 rounded-lg border border-accent/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className={`w-5 h-5 ${isRecording ? "text-destructive" : "text-accent"}`} />
                  <span className="text-xs font-medium">Screen Recorder</span>
                </div>
                <Button
                  size="sm"
                  variant={isRecording ? "destructive" : "default"}
                  onClick={toggleRecording}
                  className="h-7 px-3"
                >
                  {isRecording ? (
                    <>
                      <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                      {formatDuration(recordingDuration)}
                    </>
                  ) : (
                    "Start"
                  )}
                </Button>
              </div>
            </div>

            {/* Performance Mode Selector */}
            <div className="p-4 bg-muted/20 rounded-lg border border-primary/20">
              <div className="text-xs font-semibold mb-3 text-center text-primary">PERFORMANCE MODE</div>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant={performanceMode === "saving" ? "default" : "outline"}
                  className={`w-full ${
                    performanceMode === "saving"
                      ? "bg-green-600 hover:bg-green-700 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                      : ""
                  }`}
                  onClick={() => {
                    setPerformanceMode("saving");
                    toast.success("Saving Mode", { description: "Battery-saving enabled" });
                  }}
                >
                  <Battery className="w-4 h-4 mr-2" />
                  Saving
                </Button>
                <Button
                  size="sm"
                  variant={performanceMode === "balance" ? "default" : "outline"}
                  className={`w-full ${
                    performanceMode === "balance"
                      ? "bg-yellow-600 hover:bg-yellow-700 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                      : ""
                  }`}
                  onClick={() => {
                    setPerformanceMode("balance");
                    toast.info("Balance Mode", { description: "Optimal performance" });
                  }}
                >
                  <Gauge className="w-4 h-4 mr-2" />
                  Balance
                </Button>
                <Button
                  size="sm"
                  variant={performanceMode === "boost" ? "default" : "outline"}
                  className={`w-full ${
                    performanceMode === "boost"
                      ? "bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      : ""
                  }`}
                  onClick={() => {
                    setPerformanceMode("boost");
                    toast.success("Boost Mode Activated! 🚀", { description: "Maximum performance" });
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Boost
                </Button>
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
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 w-80 h-[600px] max-h-[calc(100vh-2rem)]"
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
                      ? `${getLEDColor().bg.replace('from-', 'from-').replace('to-b', 'to-r')} border ${getLEDColor().border}` 
                      : 'bg-muted/20 border border-muted/30'
                  }`}
                  style={isActive ? { boxShadow: `0 0 6px ${getLEDColor().rgb}` } : {}}
                />
              );
            })}
          </div>

          {/* Segmented LED Bar - Right Edge */}
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-evenly py-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 h-10 ${getLEDColor().bg} rounded-sm border ${getLEDColor().border}`}
                style={{ boxShadow: getLEDColor().shadow }}
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

          {/* Game Shortcuts */}
          <div className="flex justify-around items-center gap-2 p-3 bg-muted/30 border-b border-accent/20">
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

          <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
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
              <div className="flex items-center justify-between p-2 bg-muted/10 rounded">
                <span className="text-xs">Crosshair</span>
                <span className={`text-xs font-bold ${crosshairEnabled ? "text-primary" : "text-muted-foreground"}`}>
                  {crosshairEnabled ? "ON" : "OFF"}
                </span>
              </div>
            </div>

            {/* Crosshair Toggle */}
            <Button
              variant={crosshairEnabled ? "default" : "outline"}
              className={`w-full ${crosshairEnabled ? "bg-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : ""}`}
              onClick={() => {
                setCrosshairEnabled(!crosshairEnabled);
                toast.success(crosshairEnabled ? "Crosshair Disabled" : "Crosshair Enabled", {
                  description: crosshairEnabled ? "Crosshair hidden" : "Aim assist activated",
                });
              }}
            >
              <Crosshair className="w-4 h-4 mr-2" />
              Crosshair: {crosshairEnabled ? "ON" : "OFF"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Crosshair Overlay */}
      {crosshairEnabled && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
          <div className="relative w-8 h-8">
            {/* Horizontal line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary -translate-y-1/2 shadow-[0_0_4px_rgba(16,185,129,0.8)]" />
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-primary -translate-x-1/2 shadow-[0_0_4px_rgba(16,185,129,0.8)]" />
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_6px_rgba(16,185,129,1)]" />
          </div>
        </div>
      )}
    </>
  );
};

import { useState, useEffect, useRef } from "react";
import { Cpu, Monitor, Flame, Wind, Thermometer, Gamepad2, Chrome, Youtube, MessageSquare, Volume2, Sun, Video, Battery, Gauge, Zap, Crosshair, Music, X, Play, RotateCcw, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { toast } from "sonner";

import wifiOn from "@/assets/wifi-on.webp";
import wifiOff from "@/assets/wifi-off.webp";
import pubgIcon from "@/assets/pubg-icon.png";
import freefireIcon from "@/assets/freefire-icon.png";
import chromeIcon from "@/assets/chrome-icon.png";
import youtubeIcon from "@/assets/youtube-icon.png";
import whatsappIcon from "@/assets/whatsapp-icon.png";

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
  const [showAimAssistant, setShowAimAssistant] = useState(false);
  const [aimSettings, setAimSettings] = useState({
    style: 0,
    x: 0,
    y: 0,
    size: 100,
    opacity: 100,
    color: "#10b981",
  });
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [equalizerEnabled, setEqualizerEnabled] = useState(true);
  const [equalizerBands, setEqualizerBands] = useState([0, 2, 4, 2, 0, -2, 0, 3, 5, 4]);
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [showTacticX, setShowTacticX] = useState(false);
  const [tacticXEnabled, setTacticXEnabled] = useState(false);
  const [tacticXSettings, setTacticXSettings] = useState({
    swipeResponsive: 50,
    sensitivityContinuousTap: 50,
    aimingAccuracy: 50,
    tapStability: 50,
  });
  
  // Audio context refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

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
    { name: "PUBG", icon: pubgIcon },
    { name: "Free Fire", icon: freefireIcon },
    { name: "Chrome", icon: chromeIcon },
    { name: "YouTube", icon: youtubeIcon },
    { name: "WhatsApp", icon: whatsappIcon },
  ];

  const gamingTools = [
    { name: "ROG Instant\nMaster", icon: Flame },
    { name: "Aim\nAssistant", icon: Crosshair, action: () => setShowAimAssistant(true) },
    { name: "Tactic X", icon: Target, action: () => setShowTacticX(true) },
    { name: "Macro", icon: Gamepad2 },
    { name: "Sounds\nEqualizer", icon: Music, action: () => setShowEqualizer(true) },
    { name: "Vibration\nMapping", icon: Wind },
  ];

  const tacticXLabels = ["Lowest", "Low", "Regular", "High", "Higest"];

  const equalizerFrequencies = ["31", "62", "125", "250", "500", "1k", "2k", "4k", "8k", "16k"];
  const frequencyValues = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  const equalizerPresets: Record<string, { name: string; bands: number[] }> = {
    flat: { name: "Flat", bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    gaming: { name: "Gaming", bands: [4, 3, 1, 0, -1, 0, 2, 4, 5, 4] },
    bass: { name: "Bass Boost", bands: [8, 6, 4, 2, 0, 0, 0, 0, 0, 0] },
    vocal: { name: "Vocal", bands: [-2, -1, 0, 2, 4, 4, 3, 1, 0, -1] },
    treble: { name: "Treble", bands: [0, 0, 0, 0, 0, 2, 4, 6, 8, 8] },
    rock: { name: "Rock", bands: [5, 4, 2, 0, -1, 0, 2, 4, 5, 5] },
  };

  // Initialize audio context and filters
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create filters for each frequency band
      filtersRef.current = frequencyValues.map((freq, index) => {
        const filter = audioContextRef.current!.createBiquadFilter();
        filter.type = index === 0 ? "lowshelf" : index === frequencyValues.length - 1 ? "highshelf" : "peaking";
        filter.frequency.value = freq;
        filter.Q.value = 1;
        filter.gain.value = equalizerBands[index];
        return filter;
      });

      // Chain filters together
      for (let i = 0; i < filtersRef.current.length - 1; i++) {
        filtersRef.current[i].connect(filtersRef.current[i + 1]);
      }
      filtersRef.current[filtersRef.current.length - 1].connect(audioContextRef.current.destination);
    }
  };

  // Update filter gains when bands change
  useEffect(() => {
    filtersRef.current.forEach((filter, index) => {
      if (equalizerEnabled) {
        filter.gain.value = equalizerBands[index];
      } else {
        filter.gain.value = 0;
      }
    });
  }, [equalizerBands, equalizerEnabled]);

  // Play test sound
  const playTestSound = () => {
    initAudioContext();
    
    if (isPlayingTest) {
      // Stop current sound
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      setIsPlayingTest(false);
      return;
    }

    const ctx = audioContextRef.current!;
    
    // Create gain node for volume control
    gainNodeRef.current = ctx.createGain();
    gainNodeRef.current.gain.value = 0.3;
    gainNodeRef.current.connect(filtersRef.current[0]);

    // Play a sweep through frequencies
    const playFrequencySweep = async () => {
      setIsPlayingTest(true);
      
      for (let i = 0; i < frequencyValues.length; i++) {
        if (!isPlayingTest && oscillatorRef.current) break;
        
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = frequencyValues[i];
        osc.connect(gainNodeRef.current!);
        osc.start();
        
        await new Promise(resolve => setTimeout(resolve, 300));
        osc.stop();
      }
      
      setIsPlayingTest(false);
    };

    playFrequencySweep();
  };

  // Apply preset
  const applyPreset = (presetKey: string) => {
    const preset = equalizerPresets[presetKey];
    if (preset) {
      setEqualizerBands([...preset.bands]);
      setSelectedPreset(presetKey);
      toast.success(`${preset.name} preset applied`);
    }
  };

  // Reset to flat
  const resetEqualizer = () => {
    setEqualizerBands([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    setSelectedPreset("flat");
    toast.info("Equalizer reset");
  };

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

  // MHz Gauge Component - styled like reference image with glowing rings (compact)
  const MHzGauge = ({ value, label, color }: { value: number; label: string; color: string }) => {
    // Convert percentage to MHz (simulated: 100% = 2000 MHz, scaled down for display)
    const mhzValue = Math.round((value / 100) * 2000);
    
    return (
      <div className="relative flex flex-col items-center">
        {/* Outer glow ring container */}
        <div className="relative w-[100px] h-[100px]">
          {/* Multiple glowing rings for depth effect */}
          <svg className="absolute inset-0" width="100" height="100" viewBox="0 0 100 100">
            {/* Outer glow ring */}
            <ellipse
              cx="50"
              cy="75"
              rx="44"
              ry="16"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              opacity="0.3"
              style={{ filter: `drop-shadow(0 0 8px ${color})` }}
            />
            <ellipse
              cx="50"
              cy="68"
              rx="38"
              ry="13"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              opacity="0.5"
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
            <ellipse
              cx="50"
              cy="62"
              rx="32"
              ry="11"
              fill="none"
              stroke={color}
              strokeWidth="2"
              opacity="0.7"
              style={{ filter: `drop-shadow(0 0 10px ${color})` }}
            />
            {/* Inner bright ring */}
            <ellipse
              cx="50"
              cy="56"
              rx="25"
              ry="9"
              fill="none"
              stroke={color}
              strokeWidth="2"
              opacity="1"
              style={{ filter: `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 20px ${color})` }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center -mt-2">
            {/* MHz Value - with transition animation */}
            <div 
              className="text-2xl font-bold tracking-tight transition-all duration-300"
              style={{ 
                color: '#fff',
                textShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
              }}
            >
              {mhzValue}
            </div>
            {/* MHz Label */}
            <div className="text-[10px] text-muted-foreground font-medium -mt-1">MHz</div>
          </div>
          
          {/* Label at bottom */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-bold tracking-wider"
            style={{ 
              color: color,
              textShadow: `0 0 6px ${color}`,
            }}
          >
            {label}
          </div>
        </div>
      </div>
    );
  };

  // Early return AFTER all hooks
  if (!isVisible) return null;

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
            {/* CPU MHz Gauge */}
            <div className="flex justify-center items-center">
              <MHzGauge 
                value={cpuUsage} 
                label="CPU" 
                color="#ef4444"
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

            {/* Brightness Control - Vertical LED Bar Style */}
            <div className="p-3 bg-muted/20 rounded-lg border border-accent/20">
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col-reverse gap-1 h-32">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setBrightness((i + 1) * 10)}
                      className={`w-10 h-2.5 rounded-sm transition-all ${
                        i < Math.ceil(brightness / 10) 
                          ? 'bg-accent shadow-[0_0_8px_hsl(var(--accent))]' 
                          : 'bg-muted/50'
                      }`}
                    />
                  ))}
                </div>
                <Sun className="w-5 h-5 text-accent" />
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
          
          {/* Game Shortcuts - At Top */}
          <div className="flex justify-around items-center gap-2 p-3 bg-muted/30 border-b border-accent/20">
            {gameApps.map((app, index) => (
              <Button
                key={index}
                size="icon"
                variant="ghost"
                className="hover:opacity-80 hover:scale-110 h-12 w-12 rounded-lg shadow-lg transition-all p-1 bg-muted/20"
                onClick={() => toast.success(`Launching ${app.name}`)}
              >
                <img src={app.icon} alt={app.name} className="h-8 w-8 object-contain" />
              </Button>
            ))}
          </div>

          {/* GPU MHz Gauge */}
          <div className="flex justify-center items-center py-3 bg-muted/30 border-b border-accent/20">
            <MHzGauge 
              value={gpuUsage} 
              label="GPU" 
              color="#ef4444"
            />
          </div>

          <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
            {/* Volume Control - Vertical LED Bar Style */}
            <div className="p-3 bg-muted/20 rounded-lg border border-accent/20">
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col-reverse gap-1 h-32">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setVolume((i + 1) * 10)}
                      className={`w-10 h-2.5 rounded-sm transition-all ${
                        i < Math.ceil(volume / 10) 
                          ? 'bg-foreground shadow-[0_0_8px_hsl(var(--foreground)/0.5)]' 
                          : 'bg-muted/50'
                      }`}
                    />
                  ))}
                </div>
                <Volume2 className="w-5 h-5 text-accent" />
              </div>
            </div>

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

            {/* Gaming Tools */}
            <div className="p-4 bg-muted/20 rounded-lg border border-accent/20">
              <div className="text-xs font-semibold mb-3 text-center text-primary">GAMING TOOLS</div>
              <div className="grid grid-cols-3 gap-2">
                {gamingTools.map((tool, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="flex flex-col items-center justify-center h-20 p-2 bg-muted/30 hover:bg-primary/20 border border-primary/20 rounded-lg transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    onClick={() => {
                      if (tool.action) {
                        tool.action();
                      } else {
                        toast.success(`${tool.name.replace('\n', ' ')} activated`);
                      }
                    }}
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

            {/* WiFi Toggle */}
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

      {/* Crosshair Overlay - Using Aim Assistant Settings */}
      {crosshairEnabled && (
        <div 
          className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center"
          style={{
            transform: `translate(${aimSettings.x}px, ${aimSettings.y}px)`,
          }}
        >
          <div 
            className="relative"
            style={{
              width: `${aimSettings.size * 0.5}px`,
              height: `${aimSettings.size * 0.5}px`,
              opacity: aimSettings.opacity / 100,
            }}
          >
            {/* Style 0: Full Cross */}
            {aimSettings.style === 0 && (
              <>
                <div 
                  className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2"
                  style={{ backgroundColor: aimSettings.color, boxShadow: `0 0 4px ${aimSettings.color}` }}
                />
                <div 
                  className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2"
                  style={{ backgroundColor: aimSettings.color, boxShadow: `0 0 4px ${aimSettings.color}` }}
                />
              </>
            )}
            
            {/* Style 1: Gap Cross */}
            {aimSettings.style === 1 && (
              <>
                <div 
                  className="absolute top-0 left-1/2 w-0.5 h-[35%] -translate-x-1/2"
                  style={{ backgroundColor: aimSettings.color, boxShadow: `0 0 4px ${aimSettings.color}` }}
                />
                <div 
                  className="absolute bottom-0 left-1/2 w-0.5 h-[35%] -translate-x-1/2"
                  style={{ backgroundColor: aimSettings.color, boxShadow: `0 0 4px ${aimSettings.color}` }}
                />
                <div 
                  className="absolute left-0 top-1/2 h-0.5 w-[35%] -translate-y-1/2"
                  style={{ backgroundColor: aimSettings.color, boxShadow: `0 0 4px ${aimSettings.color}` }}
                />
                <div 
                  className="absolute right-0 top-1/2 h-0.5 w-[35%] -translate-y-1/2"
                  style={{ backgroundColor: aimSettings.color, boxShadow: `0 0 4px ${aimSettings.color}` }}
                />
              </>
            )}
            
            {/* Style 2: Horizontal Only */}
            {aimSettings.style === 2 && (
              <>
                <div 
                  className="absolute left-0 top-1/2 h-0.5 w-[35%] -translate-y-1/2"
                  style={{ backgroundColor: aimSettings.color, boxShadow: `0 0 4px ${aimSettings.color}` }}
                />
                <div 
                  className="absolute right-0 top-1/2 h-0.5 w-[35%] -translate-y-1/2"
                  style={{ backgroundColor: aimSettings.color, boxShadow: `0 0 4px ${aimSettings.color}` }}
                />
              </>
            )}
            
            {/* Style 3: Dot Only */}
            {aimSettings.style === 3 && (
              <div 
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: aimSettings.color, boxShadow: `0 0 6px ${aimSettings.color}` }}
              />
            )}
            
            {/* Style 4: Circle with Dot */}
            {aimSettings.style === 4 && (
              <>
                <div 
                  className="absolute top-1/2 left-1/2 w-[70%] h-[70%] rounded-full -translate-x-1/2 -translate-y-1/2 border-2"
                  style={{ borderColor: aimSettings.color, boxShadow: `0 0 4px ${aimSettings.color}` }}
                />
                <div 
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
                  style={{ backgroundColor: aimSettings.color, boxShadow: `0 0 6px ${aimSettings.color}` }}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Tactic X Overlay */}
      {showTacticX && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setShowTacticX(false)}
        >
          <div 
            className="bg-card border-2 border-primary/40 rounded-xl p-3 shadow-[0_0_40px_rgba(16,185,129,0.3)] w-[340px] max-w-[95vw] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-base font-bold text-primary">TactiX™</h2>
                  <p className="text-[10px] text-muted-foreground">Touch Optimization</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* On/Off Toggle */}
                <div className="flex bg-muted/50 rounded-full overflow-hidden border border-primary/20">
                  <button
                    className={`px-3 py-1.5 text-xs font-medium transition-all ${
                      !tacticXEnabled ? "bg-muted text-foreground" : "text-muted-foreground"
                    }`}
                    onClick={() => {
                      setTacticXEnabled(false);
                      toast.info("Tactic X Disabled");
                    }}
                  >
                    Off
                  </button>
                  <button
                    className={`px-3 py-1.5 text-xs font-medium transition-all ${
                      tacticXEnabled ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                    onClick={() => {
                      setTacticXEnabled(true);
                      toast.success("Tactic X Enabled 🎮", {
                        description: "Touch optimization active",
                      });
                    }}
                  >
                    ON
                  </button>
                </div>
                {/* Close Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-destructive/20"
                  onClick={() => setShowTacticX(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3">
              {/* Swipe Responsive */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/80">Swipe Responsive</span>
                  <span className="text-xs text-primary font-semibold">{tacticXLabels[tacticXSettings.swipeResponsive / 25]}</span>
                </div>
                <div className="relative pt-1">
                  {/* Custom track with step markers */}
                  <div className="relative h-2 bg-muted/40 rounded-full">
                    {/* Active fill */}
                    <div 
                      className={`absolute h-full rounded-full transition-all ${tacticXEnabled ? "bg-gradient-to-r from-primary/60 to-primary" : "bg-muted-foreground/30"}`}
                      style={{ width: `${tacticXSettings.swipeResponsive}%` }}
                    />
                    {/* Step markers */}
                    <div className="absolute inset-0 flex justify-between items-center px-0">
                      {tacticXLabels.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-3 rounded-full border-2 cursor-pointer transition-all ${
                            tacticXSettings.swipeResponsive >= i * 25 
                              ? tacticXEnabled ? "bg-primary border-primary shadow-[0_0_6px_rgba(16,185,129,0.5)]" : "bg-muted-foreground border-muted-foreground"
                              : "bg-card border-muted-foreground/50"
                          }`}
                          onClick={() => tacticXEnabled && setTacticXSettings(prev => ({ ...prev, swipeResponsive: i * 25 }))}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    {tacticXLabels.map((label, i) => (
                      <span 
                        key={i} 
                        className={`text-[10px] cursor-pointer transition-colors ${tacticXSettings.swipeResponsive === i * 25 ? "text-primary font-semibold" : "text-muted-foreground"}`}
                        onClick={() => tacticXEnabled && setTacticXSettings(prev => ({ ...prev, swipeResponsive: i * 25 }))}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sensitivity Continuous Tap */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/80">Sensitivity Continuous Tap</span>
                  <span className="text-xs text-primary font-semibold">{tacticXLabels[tacticXSettings.sensitivityContinuousTap / 25]}</span>
                </div>
                <div className="relative pt-1">
                  <div className="relative h-2 bg-muted/40 rounded-full">
                    <div 
                      className={`absolute h-full rounded-full transition-all ${tacticXEnabled ? "bg-gradient-to-r from-primary/60 to-primary" : "bg-muted-foreground/30"}`}
                      style={{ width: `${tacticXSettings.sensitivityContinuousTap}%` }}
                    />
                    <div className="absolute inset-0 flex justify-between items-center px-0">
                      {tacticXLabels.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-3 rounded-full border-2 cursor-pointer transition-all ${
                            tacticXSettings.sensitivityContinuousTap >= i * 25 
                              ? tacticXEnabled ? "bg-primary border-primary shadow-[0_0_6px_rgba(16,185,129,0.5)]" : "bg-muted-foreground border-muted-foreground"
                              : "bg-card border-muted-foreground/50"
                          }`}
                          onClick={() => tacticXEnabled && setTacticXSettings(prev => ({ ...prev, sensitivityContinuousTap: i * 25 }))}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    {tacticXLabels.map((label, i) => (
                      <span 
                        key={i} 
                        className={`text-[10px] cursor-pointer transition-colors ${tacticXSettings.sensitivityContinuousTap === i * 25 ? "text-primary font-semibold" : "text-muted-foreground"}`}
                        onClick={() => tacticXEnabled && setTacticXSettings(prev => ({ ...prev, sensitivityContinuousTap: i * 25 }))}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Aiming Accuracy */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/80">Aiming Accuracy</span>
                  <span className="text-xs text-primary font-semibold">{tacticXLabels[tacticXSettings.aimingAccuracy / 25]}</span>
                </div>
                <div className="relative pt-1">
                  <div className="relative h-2 bg-muted/40 rounded-full">
                    <div 
                      className={`absolute h-full rounded-full transition-all ${tacticXEnabled ? "bg-gradient-to-r from-primary/60 to-primary" : "bg-muted-foreground/30"}`}
                      style={{ width: `${tacticXSettings.aimingAccuracy}%` }}
                    />
                    <div className="absolute inset-0 flex justify-between items-center px-0">
                      {tacticXLabels.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-3 rounded-full border-2 cursor-pointer transition-all ${
                            tacticXSettings.aimingAccuracy >= i * 25 
                              ? tacticXEnabled ? "bg-primary border-primary shadow-[0_0_6px_rgba(16,185,129,0.5)]" : "bg-muted-foreground border-muted-foreground"
                              : "bg-card border-muted-foreground/50"
                          }`}
                          onClick={() => tacticXEnabled && setTacticXSettings(prev => ({ ...prev, aimingAccuracy: i * 25 }))}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    {tacticXLabels.map((label, i) => (
                      <span 
                        key={i} 
                        className={`text-[10px] cursor-pointer transition-colors ${tacticXSettings.aimingAccuracy === i * 25 ? "text-primary font-semibold" : "text-muted-foreground"}`}
                        onClick={() => tacticXEnabled && setTacticXSettings(prev => ({ ...prev, aimingAccuracy: i * 25 }))}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tap Stability */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/80">Tap Stability</span>
                  <span className="text-xs text-primary font-semibold">{tacticXLabels[tacticXSettings.tapStability / 25]}</span>
                </div>
                <div className="relative pt-1">
                  <div className="relative h-2 bg-muted/40 rounded-full">
                    <div 
                      className={`absolute h-full rounded-full transition-all ${tacticXEnabled ? "bg-gradient-to-r from-primary/60 to-primary" : "bg-muted-foreground/30"}`}
                      style={{ width: `${tacticXSettings.tapStability}%` }}
                    />
                    <div className="absolute inset-0 flex justify-between items-center px-0">
                      {tacticXLabels.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-3 rounded-full border-2 cursor-pointer transition-all ${
                            tacticXSettings.tapStability >= i * 25 
                              ? tacticXEnabled ? "bg-primary border-primary shadow-[0_0_6px_rgba(16,185,129,0.5)]" : "bg-muted-foreground border-muted-foreground"
                              : "bg-card border-muted-foreground/50"
                          }`}
                          onClick={() => tacticXEnabled && setTacticXSettings(prev => ({ ...prev, tapStability: i * 25 }))}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    {tacticXLabels.map((label, i) => (
                      <span 
                        key={i} 
                        className={`text-[10px] cursor-pointer transition-colors ${tacticXSettings.tapStability === i * 25 ? "text-primary font-semibold" : "text-muted-foreground"}`}
                        onClick={() => tacticXEnabled && setTacticXSettings(prev => ({ ...prev, tapStability: i * 25 }))}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aim Assistant Overlay */}
      {showAimAssistant && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setShowAimAssistant(false)}
        >
          <div 
            className="bg-card border-2 border-primary/40 rounded-xl p-3 shadow-[0_0_40px_rgba(16,185,129,0.3)] w-[320px] max-w-[95vw] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">Aim</span>
                <span className="text-xl font-medium text-foreground/70">Assistance</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Reset Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => {
                    setAimSettings({ style: 0, x: 0, y: 0, size: 100, opacity: 100, color: "#10b981" });
                    toast.info("Aim settings reset");
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                {/* On/Off Toggle */}
                <div className="flex bg-muted/50 rounded-full overflow-hidden border border-primary/20">
                  <button
                    className={`px-3 py-1 text-xs font-medium transition-all ${
                      !crosshairEnabled ? "bg-muted text-foreground" : "text-muted-foreground"
                    }`}
                    onClick={() => {
                      setCrosshairEnabled(false);
                      toast.info("Aim Assistant Disabled");
                    }}
                  >
                    Off
                  </button>
                  <button
                    className={`px-3 py-1 text-xs font-medium transition-all ${
                      crosshairEnabled ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                    onClick={() => {
                      setCrosshairEnabled(true);
                      toast.success("Aim Assistant Enabled 🎯");
                    }}
                  >
                    ON
                  </button>
                </div>
                {/* Close Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-destructive/20"
                  onClick={() => setShowAimAssistant(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              {/* Left Side - Crosshair Styles */}
              <div className="flex flex-col gap-1.5">
                {[
                  { id: 0, icon: <><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/></> },
                  { id: 1, icon: <><line x1="12" y1="5" x2="12" y2="9" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="15" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/><line x1="5" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="15" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/></> },
                  { id: 2, icon: <><line x1="5" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/><line x1="15" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/></> },
                  { id: 3, icon: <circle cx="12" cy="12" r="3" fill="currentColor"/> },
                  { id: 4, icon: <><circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="2" fill="currentColor"/></> },
                ].map((style) => (
                  <button
                    key={style.id}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                      aimSettings.style === style.id
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-muted-foreground/30 bg-muted/20 text-muted-foreground hover:border-primary/50"
                    }`}
                    onClick={() => setAimSettings(prev => ({ ...prev, style: style.id }))}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      {style.icon}
                    </svg>
                  </button>
                ))}
              </div>

              {/* Center - Position Control */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[10px] text-muted-foreground">
                  X = {aimSettings.x} &nbsp; Y = {aimSettings.y}
                </div>
                
                {/* Position Control Pad */}
                <div className="relative w-24 h-24">
                  {/* Circle background */}
                  <div className="absolute inset-0 rounded-full border-2 border-muted-foreground/30" />
                  
                  {/* Center dot - shows position visually scaled to fit circle */}
                  <div 
                    className="absolute w-4 h-4 rounded-full bg-primary transition-all"
                    style={{ 
                      left: `calc(50% + ${(aimSettings.x / 200) * 50}px - 8px)`, 
                      top: `calc(50% + ${(aimSettings.y / 200) * 50}px - 8px)` 
                    }}
                  />
                  
                  {/* Arrow buttons */}
                  <button 
                    className="absolute top-0 left-1/2 -translate-x-1/2 text-primary hover:scale-125 active:scale-95 transition-transform p-1"
                    onClick={() => setAimSettings(prev => ({ ...prev, y: Math.max(-200, prev.y - 10) }))}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4L6 14h12L12 4z"/>
                    </svg>
                  </button>
                  <button 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 text-primary hover:scale-125 active:scale-95 transition-transform p-1"
                    onClick={() => setAimSettings(prev => ({ ...prev, y: Math.min(200, prev.y + 10) }))}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 20L6 10h12L12 20z"/>
                    </svg>
                  </button>
                  <button 
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-primary hover:scale-125 active:scale-95 transition-transform p-1"
                    onClick={() => setAimSettings(prev => ({ ...prev, x: Math.max(-200, prev.x - 10) }))}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 12L14 6v12L4 12z"/>
                    </svg>
                  </button>
                  <button 
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-primary hover:scale-125 active:scale-95 transition-transform p-1"
                    onClick={() => setAimSettings(prev => ({ ...prev, x: Math.min(200, prev.x + 10) }))}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 12L10 6v12L20 12z"/>
                    </svg>
                  </button>
                  
                  {/* Center label */}
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground pointer-events-none">
                    0°
                  </div>
                </div>

                {/* Size label */}
                <div className="text-right text-xs text-muted-foreground w-full pr-4">
                  Size<br/><span className="text-primary font-semibold">{aimSettings.size}%</span>
                </div>
              </div>

              {/* Right Side - Size Slider (vertical) */}
              <div className="flex flex-col items-center">
                <div 
                  className="relative w-4 h-32 bg-muted/30 rounded-full cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const percent = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
                    setAimSettings(prev => ({ ...prev, size: Math.round(percent) }));
                  }}
                >
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary rounded-full transition-all"
                    style={{ height: `${aimSettings.size}%` }}
                  />
                  <div 
                    className="absolute left-1/2 w-6 h-4 -translate-x-1/2 bg-primary rounded-sm"
                    style={{ bottom: `calc(${aimSettings.size}% - 8px)` }}
                  />
                </div>
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Opacity</span>
                <span className="text-xs text-primary font-semibold">{aimSettings.opacity}%</span>
              </div>
              <div 
                className="relative h-3 bg-muted/30 rounded-full cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
                  setAimSettings(prev => ({ ...prev, opacity: Math.round(percent) }));
                }}
              >
                <div 
                  className="absolute top-0 left-0 bottom-0 bg-primary rounded-full transition-all"
                  style={{ width: `${aimSettings.opacity}%` }}
                />
                <div 
                  className="absolute top-1/2 w-5 h-5 -translate-y-1/2 bg-primary rounded-md border-2 border-background"
                  style={{ left: `calc(${aimSettings.opacity}% - 10px)` }}
                />
              </div>
            </div>

            {/* Color Options */}
            <div className="mt-4 flex items-center gap-3">
              <Crosshair className="w-6 h-6 text-muted-foreground" />
              <div className="flex gap-2">
                {[
                  { color: "#ffffff", name: "White" },
                  { color: "#ef4444", name: "Red" },
                  { color: "#f97316", name: "Orange" },
                  { color: "#eab308", name: "Yellow" },
                  { color: "#10b981", name: "Green" },
                ].map((option) => (
                  <button
                    key={option.color}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      aimSettings.color === option.color
                        ? "border-primary scale-110"
                        : "border-transparent hover:border-muted-foreground/50"
                    }`}
                    style={{ backgroundColor: option.color }}
                    onClick={() => setAimSettings(prev => ({ ...prev, color: option.color }))}
                    title={option.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sound Equalizer Overlay */}
      {showEqualizer && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setShowEqualizer(false)}
        >
          <div 
            className="bg-card border-2 border-primary/40 rounded-xl p-3 shadow-[0_0_40px_rgba(16,185,129,0.3)] w-[380px] max-w-[95vw] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                <span className="font-semibold">Sound Equalizer</span>
              </div>
              <div className="flex items-center gap-3">
                {/* On/Off Toggle */}
                <div className="flex bg-muted/50 rounded-full overflow-hidden">
                  <button
                    className={`px-4 py-1.5 text-sm font-medium transition-all ${
                      !equalizerEnabled ? "bg-muted text-foreground" : "text-muted-foreground"
                    }`}
                    onClick={() => setEqualizerEnabled(false)}
                  >
                    Off
                  </button>
                  <button
                    className={`px-4 py-1.5 text-sm font-medium transition-all ${
                      equalizerEnabled ? "bg-destructive text-destructive-foreground" : "text-muted-foreground"
                    }`}
                    onClick={() => setEqualizerEnabled(true)}
                  >
                    ON
                  </button>
                </div>
                {/* Close Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setShowEqualizer(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {Object.entries(equalizerPresets).map(([key, preset]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={selectedPreset === key ? "default" : "outline"}
                  className={`text-xs ${selectedPreset === key ? "bg-primary" : ""}`}
                  onClick={() => applyPreset(key)}
                  disabled={!equalizerEnabled}
                >
                  {preset.name}
                </Button>
              ))}
            </div>

            {/* Equalizer Sliders */}
            <div className="relative mb-3">
              {/* dB Labels */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-muted-foreground">
                <span>+12</span>
                <span>0</span>
                <span>-12</span>
              </div>

              {/* Sliders */}
              <div className="ml-8 flex justify-between gap-0.5">
                {equalizerFrequencies.map((freq, index) => (
                  <div key={freq} className="flex flex-col items-center">
                    {/* Vertical Slider Track */}
                    <div 
                      className="relative h-28 w-5 bg-muted/30 rounded-lg flex items-center justify-center cursor-pointer"
                      onClick={(e) => {
                        if (!equalizerEnabled) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const y = e.clientY - rect.top;
                        const percent = Math.max(0, Math.min(1, y / rect.height));
                        const value = Math.round((0.5 - percent) * 24);
                        setEqualizerBands(prev => {
                          const newBands = [...prev];
                          newBands[index] = value;
                          return newBands;
                        });
                        setSelectedPreset("custom");
                      }}
                    >
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                        {Array.from({ length: 13 }).map((_, i) => (
                          <div key={i} className={`w-full h-px ${i === 6 ? "bg-primary/50" : "bg-muted/50"}`} />
                        ))}
                      </div>
                      
                      {/* Slider fill bar */}
                      <div 
                        className={`absolute left-1/2 -translate-x-1/2 w-2 rounded-full transition-all duration-150 ${
                          equalizerEnabled ? "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-muted-foreground"
                        }`}
                        style={{ 
                          height: `${Math.abs(equalizerBands[index]) * 3.5}%`,
                          top: equalizerBands[index] >= 0 ? `${50 - equalizerBands[index] * 3.5}%` : "50%",
                        }}
                      />
                      
                      {/* Slider thumb */}
                      <div 
                        className={`absolute left-1/2 w-5 h-3 rounded-md border-2 cursor-grab active:cursor-grabbing transition-all ${
                          equalizerEnabled 
                            ? "bg-card border-foreground/50 shadow-lg hover:border-primary" 
                            : "bg-muted border-muted-foreground"
                        }`}
                        style={{ 
                          top: `${50 - (equalizerBands[index] / 12) * 50}%`,
                          transform: "translate(-50%, -50%)"
                        }}
                        onMouseDown={(e) => {
                          if (!equalizerEnabled) return;
                          e.preventDefault();
                          const slider = e.currentTarget.parentElement;
                          
                          const handleMove = (moveEvent: MouseEvent) => {
                            if (!slider) return;
                            const rect = slider.getBoundingClientRect();
                            const y = moveEvent.clientY - rect.top;
                            const percent = Math.max(0, Math.min(1, y / rect.height));
                            const value = Math.round((0.5 - percent) * 24);
                            setEqualizerBands(prev => {
                              const newBands = [...prev];
                              newBands[index] = Math.max(-12, Math.min(12, value));
                              return newBands;
                            });
                            setSelectedPreset("custom");
                          };
                          
                          const handleUp = () => {
                            document.removeEventListener("mousemove", handleMove);
                            document.removeEventListener("mouseup", handleUp);
                          };
                          
                          document.addEventListener("mousemove", handleMove);
                          document.addEventListener("mouseup", handleUp);
                        }}
                        onTouchStart={(e) => {
                          if (!equalizerEnabled) return;
                          const slider = e.currentTarget.parentElement;
                          
                          const handleMove = (moveEvent: TouchEvent) => {
                            if (!slider) return;
                            const rect = slider.getBoundingClientRect();
                            const y = moveEvent.touches[0].clientY - rect.top;
                            const percent = Math.max(0, Math.min(1, y / rect.height));
                            const value = Math.round((0.5 - percent) * 24);
                            setEqualizerBands(prev => {
                              const newBands = [...prev];
                              newBands[index] = Math.max(-12, Math.min(12, value));
                              return newBands;
                            });
                            setSelectedPreset("custom");
                          };
                          
                          const handleEnd = () => {
                            document.removeEventListener("touchmove", handleMove);
                            document.removeEventListener("touchend", handleEnd);
                          };
                          
                          document.addEventListener("touchmove", handleMove);
                          document.addEventListener("touchend", handleEnd);
                        }}
                      />
                    </div>
                    {/* Frequency label */}
                    <span className="text-[10px] text-muted-foreground mt-2">{freq}</span>
                    {/* dB value */}
                    <span className={`text-[9px] font-medium ${equalizerBands[index] > 0 ? "text-primary" : equalizerBands[index] < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                      {equalizerBands[index] > 0 ? "+" : ""}{equalizerBands[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={resetEqualizer}
                disabled={!equalizerEnabled}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button
                variant={isPlayingTest ? "destructive" : "default"}
                size="sm"
                onClick={playTestSound}
                disabled={!equalizerEnabled}
                className="gap-2"
              >
                <Play className={`w-4 h-4 ${isPlayingTest ? "animate-pulse" : ""}`} />
                {isPlayingTest ? "Stop" : "Test Sound"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

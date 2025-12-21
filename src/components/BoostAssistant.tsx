import { useState, useEffect, useRef } from "react";
import { Cpu, Monitor, Flame, Wind, Thermometer, Gamepad2, Chrome, Youtube, MessageSquare, Volume2, Sun, Video, Battery, Gauge, Zap, Crosshair, Music, X, Play, RotateCcw, Target, ZoomIn, Move } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import startAnimation from "@/assets/start_animation.mp4";

import wifiOn from "@/assets/wifi-on.webp";
import wifiOff from "@/assets/wifi-off.webp";
import instagramIcon from "@/assets/instagram-icon.png";
import facebookIcon from "@/assets/facebook-icon.png";
import chromeIcon from "@/assets/chrome-icon.png";
import youtubeIcon from "@/assets/youtube-icon.png";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import filterHunter from "@/assets/filter-hunter.jpg";
import filterNightvision from "@/assets/filter-nightvision.jpg";
import filterEagleeye from "@/assets/filter-eagleeye.jpg";
import filterUltraclear from "@/assets/filter-ultraclear.jpg";
import filterPure from "@/assets/filter-pure.jpg";
import filterCyberpunk from "@/assets/filter-cyberpunk.jpg";
import beyondCpu from "@/assets/beyond_cpu.png";
import beyondGpu from "@/assets/beyond_gpu.png";
import balanceCpu from "@/assets/balance_cpu.png";
import balanceGpu from "@/assets/balance_gpu.png";
import riseCpu from "@/assets/rise_cpu.png";
import riseGpu from "@/assets/rise_gpu.png";
import fanOff from "@/assets/fan_off.png";
import fanOn from "@/assets/fan_on.png";
import hunterModeIcon from "@/assets/hunter-mode-icon.png";
import refreshRate60Hz from "@/assets/refresh-rate-60hz.png";
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
  const [showAppLaunchVideo, setShowAppLaunchVideo] = useState(false);
  const [pendingAppLaunch, setPendingAppLaunch] = useState<typeof gameApps[0] | null>(null);
  
  const gameApps = [
    { name: "Instagram", icon: instagramIcon, packageName: "com.instagram.android", webUrl: "https://www.instagram.com" },
    { name: "Facebook", icon: facebookIcon, packageName: "com.facebook.katana", webUrl: "https://www.facebook.com" },
    { name: "Chrome", icon: chromeIcon, packageName: "com.android.chrome", webUrl: "https://www.google.com" },
    { name: "YouTube", icon: youtubeIcon, packageName: "com.google.android.youtube", webUrl: "https://www.youtube.com" },
    { name: "WhatsApp", icon: whatsappIcon, packageName: "com.whatsapp", webUrl: "https://web.whatsapp.com" },
  ];
  
  const [fanActive, setFanActive] = useState(false);
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
  const [showMonitor, setShowMonitor] = useState(false);
  const [monitorSettings, setMonitorSettings] = useState({
    enabled: false,
    cpuUsage: true,
    gpuUsage: false,
    ramUsage: false,
    batteryInfo: true,
    tempInfo: true,
    fpsInfo: true,
    timeInfo: false,
  });
  const [showGraphiqueSettings, setShowGraphiqueSettings] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("none");
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [hunterModeEnabled, setHunterModeEnabled] = useState(false);
  const [showMacro, setShowMacro] = useState(false);
  const [macroTab, setMacroTab] = useState<"performance" | "display" | "audio">("performance");
  const [macroMode, setMacroMode] = useState<"auto" | "gpu" | "cpu" | "super">("auto");
  const [miniApp, setMiniApp] = useState<{ name: string; icon: string; webUrl: string } | null>(null);
  const [showZoomMode, setShowZoomMode] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [zoomLevel, setZoomLevel] = useState(2);
  const zoomRef = useRef<HTMLDivElement>(null);

  // Apply filter effect to document (including hunter mode)
  useEffect(() => {
    const root = document.documentElement;
    
    // Hunter mode takes priority with reddish hunting filter
    if (hunterModeEnabled) {
      root.style.filter = "sepia(0.4) hue-rotate(-30deg) saturate(1.4) contrast(1.1) brightness(0.95)";
      return () => {
        root.style.filter = "";
      };
    }
    
    if (filterEnabled && selectedFilter !== "none") {
      let filterStyle = "";
      switch (selectedFilter) {
        case "hunter":
          filterStyle = "contrast(1.15) saturate(1.2) hue-rotate(-10deg)";
          break;
        case "nightvision":
          filterStyle = "sepia(0.3) hue-rotate(80deg) saturate(1.5) brightness(0.9)";
          break;
        case "eagleeye":
          filterStyle = "contrast(1.25) saturate(1.1) brightness(1.05)";
          break;
        case "ultraclear":
          filterStyle = "contrast(1.1) saturate(1.3) brightness(1.1)";
          break;
        case "pure":
          filterStyle = "grayscale(0.1) contrast(1.05) brightness(1.05)";
          break;
        case "cyberpunk":
          filterStyle = "saturate(1.5) hue-rotate(320deg) contrast(1.1)";
          break;
      }
      root.style.filter = filterStyle;
    } else {
      root.style.filter = "";
    }
    return () => {
      root.style.filter = "";
    };
  }, [filterEnabled, selectedFilter, hunterModeEnabled]);
  
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


  // Function to actually launch the app (called after video ends)
  const performAppLaunch = async (app: typeof gameApps[0]) => {
    if (Capacitor.isNativePlatform()) {
      try {
        // Try to open the app using Android Intent
        const { App } = await import("@capacitor/app");
        
        // For Android, we can use startActivity with package name
        if (Capacitor.getPlatform() === "android") {
          try {
            // Try using the App plugin to check if app exists
            const canOpen = await (window as any).Capacitor?.Plugins?.AppLauncher?.canOpenUrl({ url: app.packageName });
            
            if (canOpen?.value) {
              await (window as any).Capacitor?.Plugins?.AppLauncher?.openUrl({ url: app.packageName });
              toast.success(`Opening ${app.name}`);
            } else {
              // Fallback: try opening with intent
              window.open(`intent://#Intent;package=${app.packageName};end`, "_system");
              toast.success(`Launching ${app.name}`);
            }
          } catch {
            // Direct intent approach
            window.open(`intent://#Intent;package=${app.packageName};end`, "_system");
            toast.success(`Launching ${app.name}`);
          }
        } else if (Capacitor.getPlatform() === "ios") {
          // iOS uses URL schemes
          const iosSchemes: Record<string, string> = {
            "Instagram": "instagram://",
            "Facebook": "fb://",
            "Chrome": "googlechrome://",
            "YouTube": "youtube://",
            "WhatsApp": "whatsapp://",
          };
          const scheme = iosSchemes[app.name];
          if (scheme) {
            window.open(scheme, "_system");
            toast.success(`Opening ${app.name}`);
          } else {
            window.open(app.webUrl, "_blank");
          }
        }
      } catch (error) {
        console.error("Error launching app:", error);
        // Fallback to web URL
        window.open(app.webUrl, "_blank");
        toast.info(`Opening ${app.name} in browser`);
      }
    } else {
      // Web fallback - open all apps in mini window directly
      setMiniApp({ name: app.name, icon: app.icon, webUrl: app.webUrl });
      toast.success(`${app.name} launched in mini window`);
    }
  };

  // Function to launch apps - opens mini app directly, no intro video
  const launchApp = (app: typeof gameApps[0]) => {
    // Directly open mini app window - no video intro
    setMiniApp({ name: app.name, icon: app.icon, webUrl: app.webUrl });
    toast.success(`${app.name} launched`);
  };

  // Handle video end - launch the app
  const handleVideoEnd = () => {
    setShowAppLaunchVideo(false);
    if (pendingAppLaunch) {
      performAppLaunch(pendingAppLaunch);
      setPendingAppLaunch(null);
    }
  };

  const gamingTools = [
    { name: "Monitor", icon: Flame, action: () => setShowMonitor(true) },
    { name: "Aim\nAssistant", icon: Crosshair, action: () => setShowAimAssistant(true) },
    { name: "Tactic X", icon: Target, action: () => setShowTacticX(true) },
    { name: "Macro", icon: Gamepad2, action: () => setShowMacro(true) },
    { name: "Sounds\nEqualizer", icon: Music, action: () => setShowEqualizer(true) },
    { name: "Graphique\nSettings", icon: Wind, action: () => setShowGraphiqueSettings(true) },
  ];

  const graphiqueFilters = [
    { id: "none", name: "None", description: "No filter applied" },
    { id: "hunter", name: "Hunter", description: "Enhanced contrast for clear vision" },
    { id: "nightvision", name: "Night Vision", description: "For scene exploration" },
    { id: "eagleeye", name: "Eagle Eye", description: "Enhanced enemy recognition" },
    { id: "ultraclear", name: "Ultra-Clear", description: "Improved visual experience" },
    { id: "pure", name: "Pure", description: "Assist with screen clarity" },
    { id: "cyberpunk", name: "Cyberpunk", description: "Live picture recognition" },
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

  // Performance Mode Dropdown Component
  const PerformanceModeDropdown = ({ 
    performanceMode, 
    setPerformanceMode 
  }: { 
    performanceMode: "saving" | "balance" | "boost"; 
    setPerformanceMode: (mode: "saving" | "balance" | "boost") => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const modeLabels: Record<"saving" | "balance" | "boost", string> = {
      saving: "Eco",
      balance: "Balance",
      boost: "Rise",
    };
    
    const modes: Array<"saving" | "balance" | "boost"> = ["saving", "balance", "boost"];
    
    const handleModeSelect = (mode: "saving" | "balance" | "boost") => {
      setPerformanceMode(mode);
      setIsOpen(false);
      if (mode === "boost") {
        toast.success("Rise Mode Activated! 🚀", { description: "Maximum performance" });
      } else if (mode === "balance") {
        toast.info("Balance Mode", { description: "Optimal performance" });
      } else {
        toast.success("Eco Mode", { description: "Battery-saving enabled" });
      }
    };
    
    return (
      <div className="p-4 relative">
        {/* Selected Mode Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative mx-auto flex items-center justify-center"
        >
          {/* Hexagonal container with red accent border */}
          <div className="relative">
            <svg width="120" height="50" viewBox="0 0 120 50">
              {/* Hexagonal shape */}
              <path
                d="M20 0 L100 0 L115 25 L100 50 L20 50 L5 25 Z"
                fill="#1a1a2e"
                stroke="#ef4444"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.5))' }}
              />
              {/* Pointer/chevron at bottom */}
              <path
                d="M50 50 L60 60 L70 50"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm">
              {modeLabels[performanceMode]}
            </span>
          </div>
        </button>
        
        {/* Dropdown Menu - Horizontal */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            {/* Dropdown - Horizontal layout */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[60px] z-50 flex gap-1 bg-[#2a2a3e] rounded-lg border border-border/50 overflow-hidden shadow-xl p-1">
              {modes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeSelect(mode)}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                    performanceMode === mode 
                      ? "text-red-400 bg-muted/30" 
                      : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                  }`}
                >
                  {modeLabels[mode]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Get CPU/GPU image and text style based on performance mode
  const getCpuImage = () => {
    if (performanceMode === "saving") return balanceCpu;
    if (performanceMode === "balance") return riseCpu;
    return beyondCpu;
  };
  
  const getGpuImage = () => {
    if (performanceMode === "saving") return balanceGpu;
    if (performanceMode === "balance") return riseGpu;
    return beyondGpu;
  };
  
  const getMhzTextStyle = (): React.CSSProperties => {
    if (performanceMode === "saving") {
      return {
        color: '#00ffff',
        textShadow: '0 0 8px rgba(0, 255, 255, 0.8), 0 0 16px rgba(0, 255, 255, 0.6)',
      };
    }
    if (performanceMode === "balance") {
      return {
        color: '#ffa500',
        textShadow: '0 0 8px rgba(255, 165, 0, 0.8), 0 0 16px rgba(255, 200, 0, 0.6)',
      };
    }
    return {
      color: '#ff4444',
      textShadow: '0 0 8px rgba(255, 68, 68, 0.8), 0 0 16px rgba(255, 100, 100, 0.6)',
    };
  };
  
  const cpuMhzValue = Math.round((cpuUsage / 100) * 2000);
  const gpuMhzValue = Math.round((gpuUsage / 100) * 2000);

  return (
    <>
      {/* No video intro - apps launch directly */}
      {/* LEFT PANEL - CPU, GPU, Modes */}
      <div 
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 w-80 h-[600px] max-h-[calc(100vh-2rem)] landscape:top-1/2 landscape:-translate-y-1/2 landscape:h-[95vh] landscape:max-h-[95vh] landscape:w-[260px] transition-all duration-300 ease-out ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
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
          <div className="flex items-center justify-between px-6 py-3 landscape:px-2 landscape:py-1 bg-muted/30 border-b border-primary/20">
            <div className="flex items-center gap-3 landscape:gap-1">
              <span className="text-sm landscape:text-[10px] font-semibold">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs landscape:text-[8px] text-muted-foreground">FPS</span>
                <span className={`text-lg landscape:text-xs font-bold ${fps >= 100 ? "text-primary" : fps >= 60 ? "text-accent" : "text-destructive"}`}>
                  {Math.round(fps)}
                </span>
              </div>
            </div>
            {/* Battery - New style matching reference image */}
            <div className="flex items-center gap-2 landscape:gap-1">
              <div className="relative flex items-center">
                {/* Battery body */}
                <div className={`w-8 h-4 landscape:w-6 landscape:h-3 rounded-[3px] border-2 relative overflow-hidden transition-all ${
                  isCharging ? 'border-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'border-white/70'
                }`}>
                  {/* Battery fill */}
                  <div 
                    className={`absolute inset-0.5 rounded-[1px] transition-all ${
                      batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${batteryLevel}%` }}
                  />
                  {/* Charging wave animation overlay */}
                  {isCharging && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" 
                        style={{ 
                          animation: 'shimmer 1.5s infinite',
                          backgroundSize: '200% 100%'
                        }} 
                      />
                    </div>
                  )}
                </div>
                {/* Battery tip */}
                <div className={`w-0.5 h-2 landscape:h-1.5 rounded-r-sm transition-all ${
                  isCharging ? 'bg-green-400' : 'bg-white/70'
                }`} />
              </div>
              <span className={`text-xs landscape:text-[8px] font-medium ${isCharging ? 'text-green-400' : 'text-white'}`}>
                {Math.round(batteryLevel)}%
              </span>
              {isCharging && <span className="text-sm landscape:text-[10px] text-green-400 animate-pulse">⚡</span>}
            </div>
          </div>
          

          <div className="flex-1 p-6 space-y-4 landscape:p-2 landscape:space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {/* CPU MHz Gauge */}
            <div className="flex justify-center items-center" key={`cpu-gauge-${performanceMode}`}>
              <div className="relative flex flex-col items-center">
                <div className="relative w-[140px] h-[100px] landscape:w-[100px] landscape:h-[70px]">
                  <img 
                    src={getCpuImage()} 
                    alt="CPU"
                    className="w-full h-full object-contain"
                  />
                  <div 
                    className="absolute top-[15%] left-1/2 -translate-x-1/2 text-lg landscape:text-sm font-bold"
                    style={getMhzTextStyle()}
                  >
                    {cpuMhzValue}
                  </div>
                </div>
              </div>
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
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-col-reverse gap-[2px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBrightness(Math.round((i + 1) * (100 / 12)))}
                    className={`w-10 h-[6px] rounded-[1px] transition-all ${
                      i < Math.ceil(brightness / (100 / 12)) 
                        ? 'bg-foreground/90' 
                        : 'bg-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <Sun className="w-5 h-5 text-foreground/80 mt-1" />
            </div>

            {/* Hunter Mode & Refresh Rate Buttons */}
            <div className="flex items-center justify-center gap-3">
              {/* Hunter Mode Button */}
              <button
                onClick={() => {
                  setHunterModeEnabled(!hunterModeEnabled);
                  toast.success(hunterModeEnabled ? "Hunter Mode Disabled" : "Hunter Mode Enabled 🎯", {
                    description: hunterModeEnabled ? "Normal vision restored" : "Enhanced target visibility",
                  });
                }}
                className={`w-12 h-12 rounded-full border transition-all flex items-center justify-center ${
                  hunterModeEnabled 
                    ? 'bg-red-500/30 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6),0_0_30px_rgba(239,68,68,0.3)]' 
                    : 'bg-[#2a2a3e] border-border/50 hover:bg-muted/40'
                }`}
              >
                <img 
                  src={hunterModeIcon} 
                  alt="Hunter Mode" 
                  className={`w-7 h-7 transition-all ${hunterModeEnabled ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : ''}`} 
                />
              </button>

              {/* 60Hz Refresh Rate Button */}
              <button
                onClick={() => toast.info("Refresh Rate: 60Hz")}
                className="w-12 h-12 rounded-full overflow-hidden border border-border/50 hover:border-accent/50 transition-all hover:scale-105"
              >
                <img 
                  src={refreshRate60Hz} 
                  alt="60Hz" 
                  className="w-full h-full object-cover" 
                />
              </button>

              {/* Zoom Mode Button */}
              <button
                onClick={() => {
                  setShowZoomMode(true);
                  toast.info("Zoom Mode: Drag to select area");
                }}
                className="w-12 h-12 rounded-full overflow-hidden border border-border/50 hover:border-accent/50 transition-all hover:scale-105 bg-[#2a2a3e] flex items-center justify-center"
              >
                <ZoomIn className="w-6 h-6 text-accent" />
              </button>
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

            {/* Performance Mode Selector - Dropdown Style */}
            <PerformanceModeDropdown 
              performanceMode={performanceMode}
              setPerformanceMode={setPerformanceMode}
            />

            {/* Fan Button with Image */}
            <div className="flex items-center justify-center gap-4 mt-2">
              <button
                onClick={() => setFanActive(!fanActive)}
                className="w-12 h-12 landscape:w-8 landscape:h-8 rounded-lg bg-muted/30 border border-primary/30 flex items-center justify-center hover:bg-muted/50 transition-all"
              >
                <img 
                  src={fanActive ? fanOn : fanOff} 
                  alt="Fan" 
                  className={`w-8 h-8 landscape:w-6 landscape:h-6 ${fanActive ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '1s' }}
                />
              </button>
              <span className="text-xs font-medium">{fanActive ? 'Fan ON' : 'Fan OFF'}</span>
            </div>
          </div>

          {/* Mode Buttons */}
          <div className="p-4 space-y-2 landscape:p-1.5 landscape:space-y-1 bg-muted/20 border-t border-primary/20">
            <Button
              variant={diabloMode ? "default" : "outline"}
              className={`w-full landscape:h-6 landscape:text-[10px] ${diabloMode ? "bg-destructive hover:bg-destructive/90 shadow-[0_0_20px_rgba(239,68,68,0.5)]" : ""}`}
              onClick={toggleDiabloMode}
            >
              <Flame className="w-4 h-4 mr-2 landscape:w-3 landscape:h-3 landscape:mr-1" />
              Diablo Mode
            </Button>
          </div>
        </Card>
      </div>

      {/* RIGHT PANEL - RAM, FPS, Gaming Info */}
      <div 
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 w-80 h-[600px] max-h-[calc(100vh-2rem)] landscape:top-1/2 landscape:-translate-y-1/2 landscape:h-[95vh] landscape:max-h-[95vh] landscape:w-[260px] transition-all duration-300 ease-out ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
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
                onClick={() => launchApp(app)}
              >
                <img src={app.icon} alt={app.name} className="h-8 w-8 object-contain" />
              </Button>
            ))}
          </div>

          {/* GPU MHz Gauge */}
          <div className="flex justify-center items-center py-3 bg-muted/30 border-b border-accent/20" key={`gpu-gauge-${performanceMode}`}>
            <div className="relative flex flex-col items-center">
              <div className="relative w-[140px] h-[100px] landscape:w-[100px] landscape:h-[70px]">
                <img 
                  src={getGpuImage()} 
                  alt="GPU"
                  className="w-full h-full object-contain"
                />
                <div 
                  className="absolute top-[15%] left-1/2 -translate-x-1/2 text-lg landscape:text-sm font-bold"
                  style={getMhzTextStyle()}
                >
                  {gpuMhzValue}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-4 landscape:p-2 landscape:space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
            {/* Volume Control - Vertical LED Bar Style */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-col-reverse gap-[2px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setVolume(Math.round((i + 1) * (100 / 12)))}
                    className={`w-10 h-[6px] rounded-[1px] transition-all ${
                      i < Math.ceil(volume / (100 / 12)) 
                        ? 'bg-foreground/90' 
                        : 'bg-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <Volume2 className="w-5 h-5 text-foreground/80 mt-1" />
            </div>

            {/* RAM Usage */}
            <div className="p-3 landscape:p-1.5 bg-muted/20 rounded-lg border border-accent/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 landscape:gap-1">
                  <Monitor className="w-5 h-5 landscape:w-3 landscape:h-3 text-primary" />
                  <span className="font-semibold text-sm landscape:text-[10px]">RAM</span>
                </div>
                <span className={`text-2xl landscape:text-sm font-bold ${getStatusColor(ramUsage)}`}>
                  {Math.round(ramUsage)}%
                </span>
              </div>
            </div>

            {/* Gaming Tools */}
            <div className="p-4 landscape:p-1.5 bg-muted/20 rounded-lg border border-accent/20">
              <div className="text-xs landscape:text-[8px] font-semibold mb-3 landscape:mb-1.5 text-center text-primary">GAMING TOOLS</div>
              <div className="grid grid-cols-3 gap-2 landscape:gap-1">
                {gamingTools.map((tool, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="flex flex-col items-center justify-center h-20 landscape:h-10 p-2 landscape:p-1 bg-muted/30 hover:bg-primary/20 border border-primary/20 rounded-lg transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    onClick={() => {
                      if (tool.action) {
                        tool.action();
                      } else {
                        toast.success(`${tool.name.replace('\n', ' ')} activated`);
                      }
                    }}
                  >
                    <tool.icon className="w-5 h-5 landscape:w-3 landscape:h-3 mb-1 landscape:mb-0.5 text-primary" />
                    <span className="text-[9px] landscape:text-[6px] font-medium text-center leading-tight whitespace-pre-line">
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
                <span className="text-xs">Fan</span>
                <span className={`text-xs font-bold ${fanActive ? "text-destructive" : "text-muted-foreground"}`}>
                  {fanActive ? "ON" : "OFF"}
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

      {/* Macro / Game Boost Overlay */}
      {showMacro && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setShowMacro(false)}
        >
          <div 
            className="bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-red-500/40 rounded-xl p-4 landscape:p-2 shadow-[0_0_40px_rgba(239,68,68,0.3)] w-[360px] landscape:w-[280px] max-w-[95vw] max-h-[85vh] landscape:max-h-[75vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 landscape:mb-2">
              <h2 className="text-lg landscape:text-sm font-bold text-white">Game Boost</h2>
              <button 
                onClick={() => setShowMacro(false)}
                className="w-8 h-8 landscape:w-6 landscape:h-6 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 landscape:w-4 landscape:h-4 text-white/70" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-6 landscape:gap-3 mb-6 landscape:mb-3">
              {[
                { id: "performance", label: "Performance" },
                { id: "display", label: "Display" },
                { id: "audio", label: "Audio" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMacroTab(tab.id as typeof macroTab)}
                  className={`text-sm landscape:text-xs font-medium pb-1 border-b-2 transition-all ${
                    macroTab === tab.id 
                      ? "text-white border-red-500" 
                      : "text-white/50 border-transparent hover:text-white/70"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Performance Tab Content */}
            {macroTab === "performance" && (
              <>
                {/* Center Logo with CPU/GPU */}
                <div className="flex items-center justify-center gap-4 landscape:gap-2 mb-6 landscape:mb-3">
                  {/* CPU Bars */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs landscape:text-[10px] text-white/70 mb-1">CPU</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 landscape:w-1.5 landscape:h-4 rounded-sm transition-all ${
                            i < (macroMode === "cpu" || macroMode === "super" ? 5 : macroMode === "auto" ? 3 : 2)
                              ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
                              : "bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Center Logo */}
                  <div className="relative">
                    <div className="w-20 h-20 landscape:w-14 landscape:h-14 rounded-full border-4 landscape:border-2 border-red-500/50 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                      <div className="w-16 h-16 landscape:w-11 landscape:h-11 rounded-full border-2 landscape:border border-red-500 bg-gradient-to-b from-red-900/50 to-red-950 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 landscape:w-5 landscape:h-5 text-red-500" fill="currentColor">
                          <path d="M12 2C11 2 10 3 10 4V8C10 8 8 8 8 10V12C8 12 6 12 6 14V20C6 21 7 22 8 22H16C17 22 18 21 18 20V14C18 12 16 12 16 12V10C16 8 14 8 14 8V4C14 3 13 2 12 2Z" />
                        </svg>
                      </div>
                    </div>
                    {/* Animated particles - hidden in landscape */}
                    <div className="absolute -top-1 left-1/2 w-1 h-3 bg-red-500 rounded-full animate-pulse landscape:hidden" style={{ transform: 'translateX(-50%) rotate(-30deg)' }} />
                    <div className="absolute -top-1 right-2 w-1 h-3 bg-red-500 rounded-full animate-pulse landscape:hidden" style={{ animationDelay: '0.2s', transform: 'rotate(30deg)' }} />
                    <div className="absolute -bottom-1 left-3 w-1 h-3 bg-cyan-400 rounded-full animate-pulse landscape:hidden" style={{ animationDelay: '0.4s', transform: 'rotate(-30deg)' }} />
                    <div className="absolute -bottom-1 right-3 w-1 h-3 bg-cyan-400 rounded-full animate-pulse landscape:hidden" style={{ animationDelay: '0.6s', transform: 'rotate(30deg)' }} />
                  </div>

                  {/* GPU Bars */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs landscape:text-[10px] text-white/70 mb-1">GPU</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-6 landscape:w-1.5 landscape:h-4 rounded-sm transition-all ${
                            i < (macroMode === "gpu" || macroMode === "super" ? 5 : macroMode === "auto" ? 3 : 2)
                              ? "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]"
                              : "bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mode Buttons */}
                <div className="grid grid-cols-2 gap-3 landscape:gap-1.5 mb-4 landscape:mb-2">
                  {[
                    { id: "auto", label: "Auto" },
                    { id: "gpu", label: "GPU Turbo" },
                    { id: "cpu", label: "CPU Turbo" },
                    { id: "super", label: "Super Mode" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setMacroMode(mode.id as typeof macroMode);
                        toast.success(`${mode.label} Activated`);
                      }}
                      className={`py-3 px-4 landscape:py-1.5 landscape:px-2 rounded-lg font-medium text-sm landscape:text-[10px] transition-all ${
                        macroMode === mode.id
                          ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                          : "bg-slate-700/80 text-white/80 hover:bg-slate-600/80"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* Description */}
                <p className="text-xs landscape:text-[9px] text-white/50 text-center">
                  {macroMode === "auto" && "Automatically optimizes CPU and GPU for best performance"}
                  {macroMode === "gpu" && "Priority to use GPU core, 3D games for high quality images"}
                  {macroMode === "cpu" && "Priority to use CPU core for faster processing"}
                  {macroMode === "super" && "Maximum performance mode, uses all available resources"}
                </p>
              </>
            )}

            {/* Display Tab Content */}
            {macroTab === "display" && (
              <div className="space-y-4 landscape:space-y-2">
                {/* Resolution */}
                <div className="space-y-2 landscape:space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm landscape:text-xs text-white/80">Resolution</span>
                    <span className="text-xs landscape:text-[10px] text-red-400">Auto</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 landscape:gap-1">
                    {["720p", "1080p", "Max"].map((res) => (
                      <button
                        key={res}
                        className="py-2 px-3 landscape:py-1 landscape:px-2 rounded-lg text-xs landscape:text-[10px] font-medium bg-slate-700/80 text-white/80 hover:bg-slate-600/80 transition-all"
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame Rate */}
                <div className="space-y-2 landscape:space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm landscape:text-xs text-white/80">Frame Rate</span>
                    <span className="text-xs landscape:text-[10px] text-red-400">60 FPS</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 landscape:gap-1">
                    {["30", "60", "90", "120"].map((fps) => (
                      <button
                        key={fps}
                        className={`py-2 px-3 landscape:py-1 landscape:px-1.5 rounded-lg text-xs landscape:text-[10px] font-medium transition-all ${
                          fps === "60" 
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white" 
                            : "bg-slate-700/80 text-white/80 hover:bg-slate-600/80"
                        }`}
                      >
                        {fps}
                      </button>
                    ))}
                  </div>
                </div>

                {/* HDR */}
                <div className="flex items-center justify-between p-3 landscape:p-2 bg-slate-700/50 rounded-lg">
                  <span className="text-sm landscape:text-xs text-white/80">HDR Mode</span>
                  <div className="w-10 h-5 landscape:w-8 landscape:h-4 rounded-full bg-slate-600 relative cursor-pointer">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 landscape:w-3 landscape:h-3 rounded-full bg-white transition-all" />
                  </div>
                </div>

                {/* Anti-Aliasing */}
                <div className="flex items-center justify-between p-3 landscape:p-2 bg-slate-700/50 rounded-lg">
                  <span className="text-sm landscape:text-xs text-white/80">Anti-Aliasing</span>
                  <div className="w-10 h-5 landscape:w-8 landscape:h-4 rounded-full bg-red-500 relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 landscape:w-3 landscape:h-3 rounded-full bg-white transition-all" />
                  </div>
                </div>
              </div>
            )}

            {/* Audio Tab Content */}
            {macroTab === "audio" && (
              <div className="space-y-4 landscape:space-y-2">
                {/* Master Volume */}
                <div className="space-y-2 landscape:space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm landscape:text-xs text-white/80">Master Volume</span>
                    <span className="text-xs landscape:text-[10px] text-red-400">80%</span>
                  </div>
                  <div className="h-2 landscape:h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
                  </div>
                </div>

                {/* Game Sound */}
                <div className="space-y-2 landscape:space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm landscape:text-xs text-white/80">Game Sound</span>
                    <span className="text-xs landscape:text-[10px] text-red-400">100%</span>
                  </div>
                  <div className="h-2 landscape:h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
                  </div>
                </div>

                {/* Voice Chat */}
                <div className="space-y-2 landscape:space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm landscape:text-xs text-white/80">Voice Chat</span>
                    <span className="text-xs landscape:text-[10px] text-red-400">70%</span>
                  </div>
                  <div className="h-2 landscape:h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-gradient-to-r from-red-600 to-red-400 rounded-full" />
                  </div>
                </div>

                {/* Audio Presets */}
                <div className="space-y-2 landscape:space-y-1">
                  <span className="text-sm landscape:text-xs text-white/80">Audio Preset</span>
                  <div className="grid grid-cols-2 gap-2 landscape:gap-1">
                    {["Gaming", "Music", "Movie", "Voice"].map((preset) => (
                      <button
                        key={preset}
                        className={`py-2 px-3 landscape:py-1 landscape:px-2 rounded-lg text-xs landscape:text-[10px] font-medium transition-all ${
                          preset === "Gaming" 
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white" 
                            : "bg-slate-700/80 text-white/80 hover:bg-slate-600/80"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Surround Sound */}
                <div className="flex items-center justify-between p-3 landscape:p-2 bg-slate-700/50 rounded-lg">
                  <span className="text-sm landscape:text-xs text-white/80">Surround Sound</span>
                  <div className="w-10 h-5 landscape:w-8 landscape:h-4 rounded-full bg-red-500 relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 landscape:w-3 landscape:h-3 rounded-full bg-white transition-all" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Monitor Display - Shows enabled stats on screen */}
      {monitorSettings.enabled && !showMonitor && !showGraphiqueSettings && !showAimAssistant && !showEqualizer && !showTacticX && !showMacro && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[150] bg-gradient-to-r from-slate-800/95 via-slate-700/95 to-slate-800/95 backdrop-blur-md rounded-lg px-3 py-2 border border-slate-600/50 shadow-lg">
          <div className="flex items-center gap-4 text-xs font-medium">
            {/* Move Icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 border border-red-500/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="5 9 2 12 5 15" />
                <polyline points="9 5 12 2 15 5" />
                <polyline points="15 19 12 22 9 19" />
                <polyline points="19 9 22 12 19 15" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="12" y1="2" x2="12" y2="22" />
              </svg>
            </div>

            {/* CPU Usage */}
            {monitorSettings.cpuUsage && (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded border border-slate-500/70 bg-slate-800/80 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-cyan-400">CPU</span>
                </div>
                <span className="text-white/90">{Math.round(cpuUsage)} %</span>
              </div>
            )}

            {/* RAM Usage */}
            {monitorSettings.ramUsage && (
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-6 rounded border border-slate-500/70 bg-slate-800/80 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-cyan-400">RAM</span>
                </div>
                <span className="text-white/90">{Math.round(ramUsage)} %</span>
              </div>
            )}

            {/* Battery Info */}
            {monitorSettings.batteryInfo && (
              <div className="flex items-center gap-1.5">
                <div className="relative w-5 h-6">
                  {/* Battery outline */}
                  <div className="absolute bottom-0 w-5 h-5 rounded-sm border-2 border-white/70 overflow-hidden">
                    {/* Battery fill */}
                    <div 
                      className={`absolute bottom-0 left-0 right-0 transition-all ${
                        batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ height: `${batteryLevel}%` }}
                    />
                  </div>
                  {/* Battery cap */}
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-1 bg-white/70 rounded-t-sm" />
                </div>
                <span className="text-white/90">{Math.round(batteryLevel)} %</span>
              </div>
            )}

            {/* Temperature Info */}
            {monitorSettings.tempInfo && (
              <div className="flex items-center gap-1.5">
                <div className="relative w-4 h-6 flex items-center justify-center">
                  {/* Thermometer */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                  </svg>
                </div>
                <span className="text-white/90">{Math.round(cpuTemp)} °C</span>
              </div>
            )}

            {/* FPS Info */}
            {monitorSettings.fpsInfo && (
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-6 rounded border border-slate-500/70 bg-slate-800/80 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-cyan-400">FPS</span>
                </div>
                <span className="text-white/90">{Math.round(fps)}</span>
              </div>
            )}

            {/* Time Info */}
            {monitorSettings.timeInfo && (
              <div className="flex items-center gap-1.5">
                <span className="text-white/90">{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monitor Info Overlay */}
      {showMonitor && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setShowMonitor(false)}
        >
          <div 
            className="bg-card border-2 border-primary/40 rounded-xl p-3 shadow-[0_0_40px_rgba(16,185,129,0.3)] w-[280px] max-w-[90vw] max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <span className="text-base font-bold text-primary">Monitor</span>
                <span className="text-base font-medium text-foreground/70">Info</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Master Toggle */}
                <button
                  onClick={() => setMonitorSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`w-12 h-6 rounded-full transition-all ${
                    monitorSettings.enabled ? "bg-primary" : "bg-muted"
                  } relative`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                    monitorSettings.enabled ? "left-6" : "left-0.5"
                  }`} />
                </button>
                {/* Close Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-destructive/20"
                  onClick={() => setShowMonitor(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Monitor Options */}
            <div className="space-y-0">
              {/* CPU Usage */}
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-muted/30 rounded">
                    <Cpu className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-medium text-foreground">CPU Usage</span>
                </div>
                <button
                  onClick={() => setMonitorSettings(prev => ({ ...prev, cpuUsage: !prev.cpuUsage }))}
                  className={`w-10 h-5 rounded-full transition-all ${
                    monitorSettings.cpuUsage ? "bg-primary" : "bg-muted"
                  } relative`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    monitorSettings.cpuUsage ? "left-5" : "left-0.5"
                  }`} />
                </button>
              </div>

              {/* GPU Usage */}
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-muted/30 rounded">
                    <Monitor className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-medium text-foreground">GPU Usage</span>
                </div>
                <button
                  onClick={() => setMonitorSettings(prev => ({ ...prev, gpuUsage: !prev.gpuUsage }))}
                  className={`w-10 h-5 rounded-full transition-all ${
                    monitorSettings.gpuUsage ? "bg-primary" : "bg-muted"
                  } relative`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    monitorSettings.gpuUsage ? "left-5" : "left-0.5"
                  }`} />
                </button>
              </div>

              {/* RAM Usage */}
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-muted/30 rounded">
                    <span className="text-[8px] font-bold text-muted-foreground">RAM</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">RAM Usage</span>
                </div>
                <button
                  onClick={() => setMonitorSettings(prev => ({ ...prev, ramUsage: !prev.ramUsage }))}
                  className={`w-10 h-5 rounded-full transition-all ${
                    monitorSettings.ramUsage ? "bg-primary" : "bg-muted"
                  } relative`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    monitorSettings.ramUsage ? "left-5" : "left-0.5"
                  }`} />
                </button>
              </div>

              {/* Battery Info */}
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-muted/30 rounded">
                    <Battery className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-medium text-foreground">Battery Info</span>
                </div>
                <button
                  onClick={() => setMonitorSettings(prev => ({ ...prev, batteryInfo: !prev.batteryInfo }))}
                  className={`w-10 h-5 rounded-full transition-all ${
                    monitorSettings.batteryInfo ? "bg-primary" : "bg-muted"
                  } relative`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    monitorSettings.batteryInfo ? "left-5" : "left-0.5"
                  }`} />
                </button>
              </div>

              {/* Temp Info */}
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-muted/30 rounded">
                    <Thermometer className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-medium text-foreground">Temp Info</span>
                </div>
                <button
                  onClick={() => setMonitorSettings(prev => ({ ...prev, tempInfo: !prev.tempInfo }))}
                  className={`w-10 h-5 rounded-full transition-all ${
                    monitorSettings.tempInfo ? "bg-primary" : "bg-muted"
                  } relative`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    monitorSettings.tempInfo ? "left-5" : "left-0.5"
                  }`} />
                </button>
              </div>

              {/* FPS Info */}
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-muted/30 rounded">
                    <span className="text-[8px] font-bold text-muted-foreground border border-muted-foreground px-0.5 rounded">FPS</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">FPS Info</span>
                </div>
                <button
                  onClick={() => setMonitorSettings(prev => ({ ...prev, fpsInfo: !prev.fpsInfo }))}
                  className={`w-10 h-5 rounded-full transition-all ${
                    monitorSettings.fpsInfo ? "bg-primary" : "bg-muted"
                  } relative`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    monitorSettings.fpsInfo ? "left-5" : "left-0.5"
                  }`} />
                </button>
              </div>

              {/* Time Info */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-muted/30 rounded">
                    <span className="text-[10px] text-muted-foreground">⏰</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">Time Info</span>
                </div>
                <button
                  onClick={() => setMonitorSettings(prev => ({ ...prev, timeInfo: !prev.timeInfo }))}
                  className={`w-10 h-5 rounded-full transition-all ${
                    monitorSettings.timeInfo ? "bg-primary" : "bg-muted"
                  } relative`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    monitorSettings.timeInfo ? "left-5" : "left-0.5"
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Graphique Settings Overlay */}
      {showGraphiqueSettings && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setShowGraphiqueSettings(false)}
        >
          <div 
            className="bg-card border-2 border-border/50 rounded-xl p-2 shadow-[0_0_40px_rgba(0,0,0,0.4)] w-[240px] max-w-[85vw] max-h-[60vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">hunting-filter</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 hover:bg-destructive/20"
                onClick={() => setShowGraphiqueSettings(false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Master Toggle */}
            <div className="flex items-center justify-between mb-2 p-1.5 bg-muted/30 rounded-lg">
              <span className="text-[10px] font-medium text-foreground">Enable Filter</span>
              <button
                onClick={() => {
                  setFilterEnabled(!filterEnabled);
                  toast.success(filterEnabled ? "Filter disabled" : "Filter enabled");
                }}
                className={`w-8 h-4 rounded-full transition-all ${filterEnabled ? "bg-red-500" : "bg-muted"}`}
              >
                <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${filterEnabled ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>

            {/* Filter Options */}
            <div className="space-y-1">
              {graphiqueFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSelectedFilter(filter.id);
                    if (filter.id === "none") {
                      setFilterEnabled(false);
                      toast.success("Filter disabled");
                    } else {
                      if (!filterEnabled) setFilterEnabled(true);
                      toast.success(`${filter.name} filter applied`);
                    }
                  }}
                  className={`w-full flex items-center gap-2 p-1.5 rounded-lg transition-all ${
                    selectedFilter === filter.id 
                      ? "bg-muted/40 border border-red-500/50" 
                      : "bg-muted/20 hover:bg-muted/30 border border-transparent"
                  }`}
                >
                  {/* Filter thumbnail */}
                  {filter.id === "none" ? (
                    <div className="w-12 h-7 rounded bg-muted/50 flex items-center justify-center flex-shrink-0 border border-border/30">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ) : (
                    <img 
                      src={
                        filter.id === "hunter" ? filterHunter :
                        filter.id === "nightvision" ? filterNightvision :
                        filter.id === "eagleeye" ? filterEagleeye :
                        filter.id === "ultraclear" ? filterUltraclear :
                        filter.id === "pure" ? filterPure :
                        filterCyberpunk
                      }
                      alt={filter.name}
                      className="w-12 h-7 rounded object-cover flex-shrink-0"
                    />
                  )}
                  {/* Filter info */}
                  <div className="text-left flex-1 min-w-0">
                    <div className={`text-[11px] font-medium ${selectedFilter === filter.id ? "text-red-400" : "text-foreground"}`}>
                      {filter.name}
                    </div>
                    <div className="text-[9px] text-muted-foreground truncate">
                      {filter.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


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

      {/* Mini App Overlay - Direct launch, no intro */}
      {miniApp && (
        <div className="fixed bottom-20 right-4 z-[60] w-[320px] h-[200px] rounded-xl overflow-hidden shadow-2xl border-2 border-accent/50 bg-black">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-card/95 to-muted/95 backdrop-blur flex items-center justify-between px-2 z-10">
            <div className="flex items-center gap-2">
              <img 
                src={miniApp.icon} 
                alt={miniApp.name} 
                className="w-4 h-4" 
              />
              <span className="text-xs font-medium">{miniApp.name}</span>
            </div>
            <button
              onClick={() => setMiniApp(null)}
              className="w-6 h-6 rounded-full bg-destructive/80 hover:bg-destructive flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
          {/* Content */}
          <div className="w-full h-full pt-8">
            <iframe
              src={miniApp.webUrl}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Zoom Mode Overlay */}
      {showZoomMode && (
        <div className="fixed inset-0 z-[70] bg-black/30">
          {/* Close button */}
          <button
            onClick={() => setShowZoomMode(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center z-[80] transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Zoom controls */}
          <div className="absolute top-4 left-4 bg-black/80 rounded-xl p-3 z-[80] space-y-2">
            <div className="text-white text-sm font-medium mb-2">Zoom Level: {zoomLevel}x</div>
            <div className="flex gap-2">
              <button
                onClick={() => setZoomLevel(prev => Math.max(1.5, prev - 0.5))}
                className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold"
              >
                -
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.min(5, prev + 0.5))}
                className="w-10 h-10 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold"
              >
                +
              </button>
            </div>
            <div className="text-white/60 text-xs flex items-center gap-1">
              <Move className="w-3 h-3" />
              Drag circle to move
            </div>
          </div>

          {/* Draggable zoom circle */}
          <div
            ref={zoomRef}
            className="absolute w-40 h-40 rounded-full border-4 border-white/80 shadow-[0_0_30px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.3)] cursor-move overflow-hidden"
            style={{
              left: `calc(${zoomPosition.x}% - 80px)`,
              top: `calc(${zoomPosition.y}% - 80px)`,
              background: `radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.3) 100%)`,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startY = e.clientY;
              const startPosX = zoomPosition.x;
              const startPosY = zoomPosition.y;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = ((moveEvent.clientX - startX) / window.innerWidth) * 100;
                const deltaY = ((moveEvent.clientY - startY) / window.innerHeight) * 100;
                setZoomPosition({
                  x: Math.max(10, Math.min(90, startPosX + deltaX)),
                  y: Math.max(10, Math.min(90, startPosY + deltaY)),
                });
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const startX = touch.clientX;
              const startY = touch.clientY;
              const startPosX = zoomPosition.x;
              const startPosY = zoomPosition.y;

              const handleTouchMove = (moveEvent: TouchEvent) => {
                const moveTouch = moveEvent.touches[0];
                const deltaX = ((moveTouch.clientX - startX) / window.innerWidth) * 100;
                const deltaY = ((moveTouch.clientY - startY) / window.innerHeight) * 100;
                setZoomPosition({
                  x: Math.max(10, Math.min(90, startPosX + deltaX)),
                  y: Math.max(10, Math.min(90, startPosY + deltaY)),
                });
              };

              const handleTouchEnd = () => {
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
              };

              document.addEventListener('touchmove', handleTouchMove);
              document.addEventListener('touchend', handleTouchEnd);
            }}
          >
            {/* Magnified content simulation */}
            <div 
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center',
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-green-900/20 via-transparent to-blue-900/20" />
            </div>
            
            {/* Crosshair in center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-0.5 bg-red-500/80 absolute" />
              <div className="w-0.5 h-6 bg-red-500/80 absolute" />
              <div className="w-3 h-3 border-2 border-red-500/80 rounded-full" />
            </div>

            {/* Tick marks around edge */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x1 = 80 + 75 * Math.cos(angle);
                const y1 = 80 + 75 * Math.sin(angle);
                const x2 = 80 + 70 * Math.cos(angle);
                const y2 = 80 + 70 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>

          {/* Info text */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 rounded-xl px-4 py-2 text-white text-sm">
            Smart Target - Zoom {zoomLevel}x
          </div>
        </div>
      )}
    </>
  );
};

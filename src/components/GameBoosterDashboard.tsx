import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Zap, Cpu, MemoryStick, Gauge, Monitor, Settings, TrendingUp, PanelLeftOpen, Battery, Grid3X3, X, HardDrive, Thermometer, Clock, Wifi, Globe, Signal, Radar } from "lucide-react";
import { BoostAssistant } from "./BoostAssistant";
import { AdvancedDashboard } from "./AdvancedDashboard";
import { GravityXDashboard } from "./GravityXDashboard";
import { toast } from "sonner";
import wifiOn from "@/assets/wifi-on.webp";
import wifiOff from "@/assets/wifi-off.webp";
import assistantToggle from "@/assets/assistant-toggle.png";
import startAnimation from "@/assets/start_animation.mp4";

interface LocationState {
  openGameSpace?: boolean;
  selectedApp?: {
    packageName: string;
    appName: string;
    icon?: string;
    isOptimized?: boolean;
  };
}

export const GameBoosterDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  
  const [cpuUsage, setCpuUsage] = useState(45);
  const [ramUsage, setRamUsage] = useState(62);
  const [fps, setFps] = useState(60);
  const [gpuUsage, setGpuUsage] = useState(38);
  const [performanceMode, setPerformanceMode] = useState<"saving" | "balance" | "boost">("balance");
  const [optimizationScore, setOptimizationScore] = useState(72);
  const [showPanels, setShowPanels] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [showGamesLobby, setShowGamesLobby] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showGravityX, setShowGravityX] = useState(false);
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [cpuTemp, setCpuTemp] = useState(47);
  const [gpuTemp, setGpuTemp] = useState(46);
  const [cpuMHz, setCpuMHz] = useState(710);
  const [gpuMHz, setGpuMHz] = useState(675);
  const [memoryUsed, setMemoryUsed] = useState(4.8);
  const [storageUsed, setStorageUsed] = useState(22.86);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [batteryTimeRemaining, setBatteryTimeRemaining] = useState<number | null>(null);
  const [selectedAppFromNav, setSelectedAppFromNav] = useState<LocationState['selectedApp'] | null>(null);
  const [selectedDns, setSelectedDns] = useState<string>("auto");
  const [pingBoostEnabled, setPingBoostEnabled] = useState(false);
  const [currentPing, setCurrentPing] = useState(45);
  const [basePing, setBasePing] = useState(45);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [packetLoss, setPacketLoss] = useState(2.5);
  const [jitter, setJitter] = useState(8);
  const [networkStatus, setNetworkStatus] = useState<"excellent" | "good" | "fair" | "poor">("good");
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // Handle navigation state to open Game Space with selected app
  useEffect(() => {
    if (locationState?.openGameSpace) {
      setShowAdvanced(true);
      if (locationState.selectedApp) {
        setSelectedAppFromNav(locationState.selectedApp);
      }
      // Clear the state to prevent reopening on refresh
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [locationState, navigate, location.pathname]);

  // Simulate real-time performance metrics based on mode
  useEffect(() => {
    const interval = setInterval(() => {
      if (performanceMode === "saving") {
        // Saving mode: Lower performance, better battery
        setCpuUsage((prev) => Math.max(20, Math.min(50, prev + (Math.random() - 0.5) * 8)));
        setRamUsage((prev) => Math.max(30, Math.min(55, prev + (Math.random() - 0.5) * 6)));
        setFps((prev) => Math.max(30, Math.min(45, prev + (Math.random() - 0.5) * 4)));
        setGpuUsage((prev) => Math.max(15, Math.min(40, prev + (Math.random() - 0.5) * 6)));
      } else if (performanceMode === "balance") {
        // Balance mode: Moderate performance
        setCpuUsage((prev) => Math.max(30, Math.min(70, prev + (Math.random() - 0.5) * 10)));
        setRamUsage((prev) => Math.max(40, Math.min(75, prev + (Math.random() - 0.5) * 8)));
        setFps((prev) => Math.max(50, Math.min(75, prev + (Math.random() - 0.5) * 5)));
        setGpuUsage((prev) => Math.max(25, Math.min(60, prev + (Math.random() - 0.5) * 8)));
      } else {
        // Boost mode: Maximum performance
        setCpuUsage((prev) => Math.max(20, Math.min(40, prev + (Math.random() - 0.5) * 5)));
        setRamUsage((prev) => Math.max(30, Math.min(50, prev + (Math.random() - 0.5) * 4)));
        setFps((prev) => Math.max(100, Math.min(144, prev + (Math.random() - 0.5) * 3)));
        setGpuUsage((prev) => Math.max(15, Math.min(35, prev + (Math.random() - 0.5) * 4)));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [performanceMode]);

  // Simulate temperature and MHz updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuTemp(prev => Math.max(40, Math.min(70, prev + (Math.random() - 0.5) * 4)));
      setGpuTemp(prev => Math.max(38, Math.min(65, prev + (Math.random() - 0.5) * 3)));
      setCpuMHz(prev => Math.max(600, Math.min(1200, prev + (Math.random() - 0.5) * 50)));
      setGpuMHz(prev => Math.max(500, Math.min(1000, prev + (Math.random() - 0.5) * 40)));
      setMemoryUsed(prev => Math.max(3, Math.min(7, prev + (Math.random() - 0.5) * 0.3)));
      setStorageUsed(prev => Math.max(20, Math.min(30, prev + (Math.random() - 0.5) * 0.5)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Real battery monitoring
  useEffect(() => {
    const updateBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
          
          // Get discharge time in seconds, convert to minutes
          const dischargingTime = battery.dischargingTime;
          if (dischargingTime && dischargingTime !== Infinity) {
            setBatteryTimeRemaining(Math.round(dischargingTime / 60));
          } else {
            // Estimate based on battery level (rough estimate: 1% = ~5 min avg usage)
            setBatteryTimeRemaining(Math.round(battery.level * 100 * 5));
          }

          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
          battery.addEventListener('dischargingtimechange', () => {
            const time = battery.dischargingTime;
            if (time && time !== Infinity) {
              setBatteryTimeRemaining(Math.round(time / 60));
            }
          });
        } catch (error) {
          // Fallback: estimate based on default level
          setBatteryTimeRemaining(batteryLevel * 5);
        }
      } else {
        // Fallback for browsers without Battery API
        setBatteryTimeRemaining(batteryLevel * 5);
      }
    };
    updateBattery();
  }, [batteryLevel]);

  // Helper to format remaining time
  const formatRemainingTime = (minutes: number | null) => {
    if (!minutes) return "Calculating...";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hours ${mins} minutes`;
  };

  const handleModeChange = (mode: "saving" | "balance" | "boost") => {
    setPerformanceMode(mode);
    if (mode === "boost") {
      toast.success("Boost Mode Activated! 🚀", {
        description: "Maximum performance unlocked",
      });
      setOptimizationScore(95);
    } else if (mode === "balance") {
      toast.info("Balance Mode", {
        description: "Optimal performance and efficiency",
      });
      setOptimizationScore(72);
    } else {
      toast.info("Saving Mode", {
        description: "Battery-saving mode enabled",
      });
      setOptimizationScore(55);
    }
  };

  // Network simulation - DNS affects base ping, ping booster reduces it further
  const getDnsBasePing = (dns: string) => {
    switch (dns) {
      case "google": return 35;
      case "cloudflare": return 28;
      case "gaming": return 22;
      default: return 45;
    }
  };

  // Real-time network monitoring simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const dnsBase = getDnsBasePing(selectedDns);
      const boostReduction = pingBoostEnabled ? 12 : 0;
      const fluctuation = (Math.random() - 0.5) * 10;
      const newPing = Math.max(8, Math.round(dnsBase - boostReduction + fluctuation));
      
      setCurrentPing(newPing);
      
      // Update jitter based on stability
      const newJitter = pingBoostEnabled 
        ? Math.max(1, Math.round(3 + Math.random() * 4))
        : Math.max(3, Math.round(6 + Math.random() * 8));
      setJitter(newJitter);
      
      // Update packet loss
      const newPacketLoss = pingBoostEnabled 
        ? Math.round(Math.random() * 0.5 * 10) / 10
        : Math.round(Math.random() * 3 * 10) / 10;
      setPacketLoss(newPacketLoss);
      
      // Determine network status
      if (newPing < 30 && newJitter < 5) {
        setNetworkStatus("excellent");
      } else if (newPing < 50 && newJitter < 8) {
        setNetworkStatus("good");
      } else if (newPing < 80) {
        setNetworkStatus("fair");
      } else {
        setNetworkStatus("poor");
      }
    }, 1500);
    
    return () => clearInterval(interval);
  }, [selectedDns, pingBoostEnabled]);

  // Handle DNS change with optimization animation
  const handleDnsChange = (dnsId: string) => {
    if (dnsId === selectedDns) return;
    
    setIsOptimizing(true);
    setSelectedDns(dnsId);
    
    // Simulate DNS propagation
    setTimeout(() => {
      setIsOptimizing(false);
      const dnsLabels: Record<string, string> = {
        auto: "Automatic",
        google: "Google (8.8.8.8)",
        cloudflare: "Cloudflare (1.1.1.1)",
        gaming: "Gaming DNS (optimized)"
      };
      toast.success(`DNS configured: ${dnsLabels[dnsId]}`, {
        description: `Expected ping improvement: ${45 - getDnsBasePing(dnsId)}ms`
      });
    }, 800);
  };

  // Handle Ping Booster toggle
  const handlePingBoostToggle = () => {
    if (!pingBoostEnabled) {
      setIsOptimizing(true);
      setTimeout(() => {
        setPingBoostEnabled(true);
        setIsOptimizing(false);
        toast.success("Ping Booster Activated! 🚀", {
          description: "Network routes optimized, packet prioritization enabled"
        });
      }, 1200);
    } else {
      setPingBoostEnabled(false);
      toast.info("Ping Booster disabled");
    }
  };
  const getStatusColor = (value: number, inverse = false) => {
    if (inverse) {
      if (value >= 100) return "text-primary";
      if (value >= 60) return "text-accent";
      return "text-destructive";
    }
    if (value <= 40) return "text-primary";
    if (value <= 70) return "text-accent";
    return "text-destructive";
  };

  // Handle click outside to close panels
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPanels && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPanels(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPanels]);

  // Handle swipe gestures
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = Math.abs(touchEndY - touchStartY.current);

      // Swipe from left edge to right
      if (touchStartX.current < 50 && deltaX > 100 && deltaY < 50) {
        setShowPanels(true);
        toast.success("Panel opened");
      }
      // Swipe from right edge to left
      else if (touchStartX.current > window.innerWidth - 50 && deltaX < -100 && deltaY < 50) {
        setShowPanels(true);
        toast.success("Panel opened");
      }
      // Swipe to close when panels are open
      else if (showPanels) {
        if ((deltaX < -100 || deltaX > 100) && deltaY < 50) {
          setShowPanels(false);
          toast.info("Panel closed");
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [showPanels]);

  return (
    <div 
      className="min-h-screen bg-background p-6" 
      ref={containerRef}
      onClick={(e) => {
        // Hide panels when clicking on the main content area
        if (showPanels && e.target === e.currentTarget) {
          setShowPanels(false);
          toast.info("Panels hidden");
        }
      }}
    >
      <div 
        className="max-w-7xl mx-auto space-y-6"
        onClick={() => {
          if (showPanels) {
            setShowPanels(false);
            toast.info("Panels hidden");
          }
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
              Game Booster Pro
            </h1>
            <p className="text-muted-foreground mt-1">
              Optimize your system for maximum gaming performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="icon"
              onClick={() => {
                setWifiEnabled(!wifiEnabled);
                toast.success(wifiEnabled ? "WiFi Disabled" : "WiFi Enabled");
              }}
              className="relative"
            >
              <img 
                src={wifiEnabled ? wifiOn : wifiOff} 
                alt="WiFi" 
                className="h-5 w-5"
              />
            </Button>
            <Button 
              variant={showGravityX ? "default" : "outline"} 
              size="icon"
              onClick={() => setShowGravityX(!showGravityX)}
              className={showGravityX ? "bg-red-600 hover:bg-red-700 border-red-500" : ""}
              title="Gravity-X Dashboard"
            >
              <Thermometer className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate("/my-apps")}
            >
              <Grid3X3 className="h-5 w-5" />
            </Button>
            <Button 
              variant={showPanels ? "default" : "outline"} 
              size="icon"
              onClick={() => setShowPanels(!showPanels)}
              className="relative"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Gravity-X Dashboard */}
        {showGravityX && (
          <GravityXDashboard
            cpuTemp={cpuTemp}
            gpuTemp={gpuTemp}
            cpuMHz={cpuMHz}
            gpuMHz={gpuMHz}
            memoryUsed={memoryUsed}
            memoryTotal={8}
            storageUsed={storageUsed}
            storageTotal={128}
            batteryTimeRemaining={batteryTimeRemaining}
          />
        )}

        {/* Central Performance Display with Mode Selector */}
        <div className="relative py-12">
          {/* Central Hexagon Display */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* Hexagon with gradient border */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                  <defs>
                    <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'hsl(217, 91%, 60%)', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: 'hsl(270, 70%, 60%)', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="50 2, 95 27, 95 73, 50 98, 5 73, 5 27"
                    fill="none"
                    stroke="url(#hexGradient)"
                    strokeWidth="2"
                    className="drop-shadow-[0_0_10px_rgba(142,76,45,0.6)]"
                  />
                </svg>
                
                {/* Icon based on performance mode */}
                <div className="relative z-10 flex items-center justify-center">
                  {performanceMode === "saving" && (
                    <div className="animate-pulse">
                      <Battery className="w-20 h-20 text-primary" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-accent animate-bounce" />
                      </div>
                    </div>
                  )}
                  {performanceMode === "balance" && (
                    <div className="relative animate-pulse">
                      <div className="absolute inset-0 animate-spin-slow">
                        <Zap className="w-6 h-6 text-accent absolute -top-8 left-1/2 -translate-x-1/2" />
                        <Zap className="w-6 h-6 text-accent absolute -bottom-8 left-1/2 -translate-x-1/2" />
                      </div>
                      <Gauge className="w-20 h-20 text-secondary relative z-10" />
                    </div>
                  )}
                  {performanceMode === "boost" && (
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping opacity-75">
                        <Zap className="w-20 h-20 text-primary" />
                      </div>
                      <Zap className="w-20 h-20 text-primary relative z-10 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Mode Buttons - Gaming Style */}
          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* ECO Mode */}
            <button
              onClick={() => handleModeChange("saving")}
              className={`group relative overflow-hidden rounded-xl transition-all duration-500 ${
                performanceMode === "saving"
                  ? "scale-105"
                  : "hover:scale-102"
              }`}
            >
              {/* Background with gradient */}
              <div className={`absolute inset-0 transition-all duration-500 ${
                performanceMode === "saving"
                  ? "bg-gradient-to-br from-emerald-900/80 via-emerald-950/90 to-black"
                  : "bg-gradient-to-br from-slate-800/60 via-slate-900/80 to-black"
              }`} />
              
              {/* Animated border glow */}
              <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                performanceMode === "saving"
                  ? "shadow-[inset_0_0_20px_rgba(16,185,129,0.4),0_0_30px_rgba(16,185,129,0.3)]"
                  : "shadow-[inset_0_0_10px_rgba(100,116,139,0.2)]"
              }`} />
              
              {/* Border */}
              <div className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 ${
                performanceMode === "saving"
                  ? "border-emerald-500/80"
                  : "border-slate-700/50 group-hover:border-emerald-500/30"
              }`} />
              
              {/* Corner accents */}
              <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-xl transition-colors ${
                performanceMode === "saving" ? "border-emerald-400" : "border-slate-600"
              }`} />
              <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-xl transition-colors ${
                performanceMode === "saving" ? "border-emerald-400" : "border-slate-600"
              }`} />
              <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-xl transition-colors ${
                performanceMode === "saving" ? "border-emerald-400" : "border-slate-600"
              }`} />
              <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-xl transition-colors ${
                performanceMode === "saving" ? "border-emerald-400" : "border-slate-600"
              }`} />
              
              <div className="relative p-6 flex flex-col items-center gap-3">
                {/* Icon with glow ring */}
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    performanceMode === "saving"
                      ? "bg-emerald-500/20 animate-pulse scale-150"
                      : ""
                  }`} />
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    performanceMode === "saving"
                      ? "bg-gradient-to-br from-emerald-500/30 to-emerald-900/50 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                      : "bg-slate-800/50"
                  }`}>
                    <Battery className={`w-8 h-8 transition-colors duration-300 ${
                      performanceMode === "saving" ? "text-emerald-400" : "text-slate-500"
                    }`} />
                  </div>
                  {performanceMode === "saving" && (
                    <div className="absolute -inset-2 rounded-full border border-emerald-500/30 animate-ping" />
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-sm font-bold tracking-wider uppercase transition-colors duration-300 ${
                  performanceMode === "saving" ? "text-emerald-400" : "text-slate-500"
                }`}>
                  ECO
                </span>
                
                {/* Status indicator */}
                <div className={`h-1 w-12 rounded-full transition-all duration-500 ${
                  performanceMode === "saving"
                    ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                    : "bg-slate-700"
                }`} />
              </div>
            </button>

            {/* BALANCE Mode */}
            <button
              onClick={() => handleModeChange("balance")}
              className={`group relative overflow-hidden rounded-xl transition-all duration-500 ${
                performanceMode === "balance"
                  ? "scale-105"
                  : "hover:scale-102"
              }`}
            >
              {/* Background with gradient */}
              <div className={`absolute inset-0 transition-all duration-500 ${
                performanceMode === "balance"
                  ? "bg-gradient-to-br from-amber-900/80 via-orange-950/90 to-black"
                  : "bg-gradient-to-br from-slate-800/60 via-slate-900/80 to-black"
              }`} />
              
              {/* Animated border glow */}
              <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                performanceMode === "balance"
                  ? "shadow-[inset_0_0_20px_rgba(245,158,11,0.4),0_0_30px_rgba(245,158,11,0.3)]"
                  : "shadow-[inset_0_0_10px_rgba(100,116,139,0.2)]"
              }`} />
              
              {/* Border */}
              <div className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 ${
                performanceMode === "balance"
                  ? "border-amber-500/80"
                  : "border-slate-700/50 group-hover:border-amber-500/30"
              }`} />
              
              {/* Corner accents */}
              <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-xl transition-colors ${
                performanceMode === "balance" ? "border-amber-400" : "border-slate-600"
              }`} />
              <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-xl transition-colors ${
                performanceMode === "balance" ? "border-amber-400" : "border-slate-600"
              }`} />
              <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-xl transition-colors ${
                performanceMode === "balance" ? "border-amber-400" : "border-slate-600"
              }`} />
              <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-xl transition-colors ${
                performanceMode === "balance" ? "border-amber-400" : "border-slate-600"
              }`} />
              
              <div className="relative p-6 flex flex-col items-center gap-3">
                {/* Icon with glow ring */}
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    performanceMode === "balance"
                      ? "bg-amber-500/20 animate-pulse scale-150"
                      : ""
                  }`} />
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    performanceMode === "balance"
                      ? "bg-gradient-to-br from-amber-500/30 to-orange-900/50 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                      : "bg-slate-800/50"
                  }`}>
                    <Gauge className={`w-8 h-8 transition-colors duration-300 ${
                      performanceMode === "balance" ? "text-amber-400" : "text-slate-500"
                    }`} />
                  </div>
                  {performanceMode === "balance" && (
                    <div className="absolute -inset-2 rounded-full border border-amber-500/30 animate-ping" />
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-sm font-bold tracking-wider uppercase transition-colors duration-300 ${
                  performanceMode === "balance" ? "text-amber-400" : "text-slate-500"
                }`}>
                  BALANCE
                </span>
                
                {/* Status indicator */}
                <div className={`h-1 w-12 rounded-full transition-all duration-500 ${
                  performanceMode === "balance"
                    ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                    : "bg-slate-700"
                }`} />
              </div>
            </button>

            {/* BEAST Mode */}
            <button
              onClick={() => handleModeChange("boost")}
              className={`group relative overflow-hidden rounded-xl transition-all duration-500 ${
                performanceMode === "boost"
                  ? "scale-105"
                  : "hover:scale-102"
              }`}
            >
              {/* Background with gradient */}
              <div className={`absolute inset-0 transition-all duration-500 ${
                performanceMode === "boost"
                  ? "bg-gradient-to-br from-red-900/80 via-red-950/90 to-black"
                  : "bg-gradient-to-br from-slate-800/60 via-slate-900/80 to-black"
              }`} />
              
              {/* Animated border glow */}
              <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${
                performanceMode === "boost"
                  ? "shadow-[inset_0_0_25px_rgba(239,68,68,0.5),0_0_40px_rgba(239,68,68,0.4)]"
                  : "shadow-[inset_0_0_10px_rgba(100,116,139,0.2)]"
              }`} />
              
              {/* Border */}
              <div className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 ${
                performanceMode === "boost"
                  ? "border-red-500/80"
                  : "border-slate-700/50 group-hover:border-red-500/30"
              }`} />
              
              {/* Corner accents */}
              <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-xl transition-colors ${
                performanceMode === "boost" ? "border-red-400" : "border-slate-600"
              }`} />
              <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-xl transition-colors ${
                performanceMode === "boost" ? "border-red-400" : "border-slate-600"
              }`} />
              <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-xl transition-colors ${
                performanceMode === "boost" ? "border-red-400" : "border-slate-600"
              }`} />
              <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-xl transition-colors ${
                performanceMode === "boost" ? "border-red-400" : "border-slate-600"
              }`} />
              
              {/* Animated energy particles for boost mode */}
              {performanceMode === "boost" && (
                <>
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-red-400 rounded-full animate-ping" />
                  <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-red-400 rounded-full animate-ping delay-150" />
                  <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-red-400 rounded-full animate-ping delay-300" />
                </>
              )}
              
              <div className="relative p-6 flex flex-col items-center gap-3">
                {/* Icon with glow ring */}
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    performanceMode === "boost"
                      ? "bg-red-500/20 animate-pulse scale-150"
                      : ""
                  }`} />
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    performanceMode === "boost"
                      ? "bg-gradient-to-br from-red-500/40 to-red-900/60 shadow-[0_0_25px_rgba(239,68,68,0.6)]"
                      : "bg-slate-800/50"
                  }`}>
                    <Zap className={`w-8 h-8 transition-colors duration-300 ${
                      performanceMode === "boost" ? "text-red-400" : "text-slate-500"
                    }`} />
                  </div>
                  {performanceMode === "boost" && (
                    <>
                      <div className="absolute -inset-2 rounded-full border border-red-500/40 animate-ping" />
                      <div className="absolute -inset-4 rounded-full border border-red-500/20 animate-ping delay-150" />
                    </>
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-sm font-bold tracking-wider uppercase transition-colors duration-300 ${
                  performanceMode === "boost" ? "text-red-400" : "text-slate-500"
                }`}>
                  BEAST
                </span>
                
                {/* Status indicator */}
                <div className={`h-1 w-12 rounded-full transition-all duration-500 ${
                  performanceMode === "boost"
                    ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.9)]"
                    : "bg-slate-700"
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU Usage */}
          <Card className="p-6 bg-card/80 backdrop-blur border-border hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-secondary" />
                <span className="font-semibold">CPU Usage</span>
              </div>
              <span className={`text-2xl font-bold ${getStatusColor(cpuUsage)}`}>
                {Math.round(cpuUsage)}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${cpuUsage}%` }}
              />
            </div>
          </Card>

          {/* RAM Usage */}
          <Card className="p-6 bg-card/80 backdrop-blur border-border hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-5 w-5 text-primary" />
                <span className="font-semibold">RAM Usage</span>
              </div>
              <span className={`text-2xl font-bold ${getStatusColor(ramUsage)}`}>
                {Math.round(ramUsage)}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-performance transition-all duration-500"
                style={{ width: `${ramUsage}%` }}
              />
            </div>
          </Card>

          {/* FPS */}
          <Card className="p-6 bg-card/80 backdrop-blur border-border hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-accent" />
                <span className="font-semibold">FPS</span>
              </div>
              <span className={`text-2xl font-bold ${getStatusColor(fps, true)}`}>
                {Math.round(fps)}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-boost transition-all duration-500"
                style={{ width: `${Math.min(100, (fps / 144) * 100)}%` }}
              />
            </div>
          </Card>

          {/* GPU Usage */}
          <Card className="p-6 bg-card/80 backdrop-blur border-border hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-secondary" />
                <span className="font-semibold">GPU Usage</span>
              </div>
              <span className={`text-2xl font-bold ${getStatusColor(gpuUsage)}`}>
                {Math.round(gpuUsage)}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
                style={{ width: `${gpuUsage}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Optimization Score */}
        <Card className="p-6 bg-card/80 backdrop-blur border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">System Optimization Score</h3>
                <p className="text-sm text-muted-foreground">
                  Overall performance rating
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{optimizationScore}</div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
          </div>
          <div className="mt-4 w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-gaming transition-all duration-700"
              style={{ width: `${optimizationScore}%` }}
            />
          </div>
        </Card>

        {/* Games to Boost */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M6 11H8M16 11H18M10 11V13M14 11V13" stroke="url(#gamepadGradient)" strokeWidth="2" strokeLinecap="round"/>
              <rect x="2" y="6" width="20" height="12" rx="4" stroke="url(#gamepadGradient)" strokeWidth="2"/>
              <circle cx="7" cy="14" r="1.5" fill="url(#gamepadGradient)"/>
              <circle cx="17" cy="14" r="1.5" fill="url(#gamepadGradient)"/>
              <defs>
                <linearGradient id="gamepadGradient" x1="2" y1="6" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#D946EF"/>
                  <stop offset="1" stopColor="#8B5CF6"/>
                </linearGradient>
              </defs>
            </svg>
            <h3 className="font-semibold text-lg">Games to Boost</h3>
          </div>
          <Card 
            className="p-6 bg-card/60 backdrop-blur border-border hover:border-primary/40 transition-colors cursor-pointer"
            onClick={() => toast.info("Add Games feature coming soon!")}
          >
            <div className="flex items-center gap-4">
              <div className="text-cyan-400 text-3xl font-light">+</div>
              <span className="font-medium text-foreground">Add Games</span>
            </div>
          </Card>
        </div>

        {/* Network Optimization Section */}
        <Card className={`p-4 bg-gradient-to-br from-card/90 to-card/70 border-primary/20 transition-all ${isOptimizing ? "animate-pulse" : ""}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className={`w-5 h-5 text-primary ${isOptimizing ? "animate-spin" : ""}`} />
              <h3 className="font-semibold text-foreground">Network Optimization</h3>
            </div>
            {/* Network Status Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
              networkStatus === "excellent" ? "bg-green-500/20 text-green-400 border border-green-500/40" :
              networkStatus === "good" ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" :
              networkStatus === "fair" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40" :
              "bg-red-500/20 text-red-400 border border-red-500/40"
            }`}>
              {networkStatus}
            </div>
          </div>
          
          {/* Network Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/20 rounded-lg">
            <div className="text-center">
              <div className={`text-lg font-bold ${currentPing < 30 ? "text-green-400" : currentPing < 60 ? "text-blue-400" : currentPing < 100 ? "text-yellow-400" : "text-red-400"}`}>
                {currentPing}ms
              </div>
              <div className="text-xs text-muted-foreground">Ping</div>
            </div>
            <div className="text-center border-x border-border/30">
              <div className={`text-lg font-bold ${jitter < 5 ? "text-green-400" : jitter < 10 ? "text-yellow-400" : "text-red-400"}`}>
                {jitter}ms
              </div>
              <div className="text-xs text-muted-foreground">Jitter</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${packetLoss < 1 ? "text-green-400" : packetLoss < 2 ? "text-yellow-400" : "text-red-400"}`}>
                {packetLoss}%
              </div>
              <div className="text-xs text-muted-foreground">Loss</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* DNS Changer */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-muted-foreground">DNS Server</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "auto", label: "Auto", color: "text-green-400", desc: "System default" },
                  { id: "google", label: "Google", color: "text-blue-400", desc: "8.8.8.8" },
                  { id: "cloudflare", label: "CF", color: "text-orange-400", desc: "1.1.1.1" },
                  { id: "gaming", label: "Gaming", color: "text-red-400", desc: "Optimized" },
                ].map((dns) => (
                  <button
                    key={dns.id}
                    onClick={() => handleDnsChange(dns.id)}
                    disabled={isOptimizing}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all relative overflow-hidden ${
                      selectedDns === dns.id
                        ? `bg-primary/20 border-2 border-primary ${dns.color} shadow-[0_0_10px_rgba(59,130,246,0.3)]`
                        : "bg-muted/30 border border-border/50 text-muted-foreground hover:bg-muted/50 hover:border-primary/30"
                    } ${isOptimizing ? "opacity-50 cursor-wait" : ""}`}
                  >
                    <span className="block">{dns.label}</span>
                    {selectedDns === dns.id && (
                      <span className="text-[10px] opacity-70 block">{dns.desc}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Ping Booster */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Signal className={`w-4 h-4 ${pingBoostEnabled ? "text-green-400 animate-pulse" : "text-yellow-400"}`} />
                  <span className="text-sm text-muted-foreground">Ping Booster</span>
                </div>
                <span className={`text-lg font-bold transition-all ${currentPing < 30 ? "text-green-400" : currentPing < 60 ? "text-blue-400" : currentPing < 100 ? "text-yellow-400" : "text-red-400"}`}>
                  {currentPing}ms
                </span>
              </div>
              
              <button
                onClick={handlePingBoostToggle}
                disabled={isOptimizing}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  pingBoostEnabled
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                    : "bg-muted/40 border border-border text-muted-foreground hover:bg-muted/60"
                } ${isOptimizing ? "opacity-50 cursor-wait" : ""}`}
              >
                {isOptimizing ? (
                  <>
                    <Radar className="w-4 h-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Radar className={`w-4 h-4 ${pingBoostEnabled ? "animate-pulse" : ""}`} />
                    {pingBoostEnabled ? "Active" : "Activate"}
                  </>
                )}
              </button>

              {/* Ping indicator bar */}
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    currentPing < 30 ? "bg-gradient-to-r from-green-500 to-emerald-400" : 
                    currentPing < 60 ? "bg-gradient-to-r from-blue-500 to-cyan-400" : 
                    currentPing < 100 ? "bg-gradient-to-r from-yellow-500 to-amber-400" : 
                    "bg-gradient-to-r from-red-500 to-rose-400"
                  }`}
                  style={{ width: `${Math.max(10, 100 - currentPing)}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="h-auto py-4 px-8 flex-col gap-2"
            onClick={() => setShowAdvanced(true)}
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm">Game Space</span>
          </Button>
        </div>

        {/* Gravity X Feature */}
        <div className="flex justify-center mt-8 mb-12">
          <button 
            onClick={() => setShowGamesLobby(true)}
            className="relative p-4 bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-slate-950 backdrop-blur rounded-2xl border border-slate-700/50 hover:border-red-500/60 transition-all hover:scale-105 cursor-pointer shadow-xl"
          >
            <div className="flex items-center gap-4">
              <span 
                className="text-sm font-bold tracking-[0.3em] text-slate-400"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
              >
                Gravity X
              </span>
              <div className="relative">
                <svg className="w-40 h-40" viewBox="0 0 120 120">
                  <defs>
                    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                      <stop offset="60%" stopColor="#dc2626" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
                    </radialGradient>
                    <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="glow"/>
                      <feMerge>
                        <feMergeNode in="glow"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <linearGradient id="ringGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="50%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                    <linearGradient id="ringGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                  </defs>
                  
                  {/* Outermost mechanical ring - dark gray */}
                  <circle cx="60" cy="60" r="56" fill="none" stroke="#1e293b" strokeWidth="4" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="url(#ringGradient1)" strokeWidth="2" />
                  
                  {/* Outer tech ring with segments */}
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#334155" strokeWidth="6" />
                  {/* Segmented outer ring effect */}
                  {Array.from({ length: 24 }).map((_, i) => (
                    <line
                      key={`outer-seg-${i}`}
                      x1={60 + 47 * Math.cos((i * 15 * Math.PI) / 180)}
                      y1={60 + 47 * Math.sin((i * 15 * Math.PI) / 180)}
                      x2={60 + 53 * Math.cos((i * 15 * Math.PI) / 180)}
                      y2={60 + 53 * Math.sin((i * 15 * Math.PI) / 180)}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                  ))}
                  
                  {/* Middle tech ring with notches */}
                  <circle cx="60" cy="60" r="42" fill="none" stroke="#475569" strokeWidth="4" />
                  <circle cx="60" cy="60" r="40" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.5" />
                  
                  {/* Red accent dots around middle ring */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <circle
                      key={`red-dot-${i}`}
                      cx={60 + 44 * Math.cos((i * 45 * Math.PI) / 180)}
                      cy={60 + 44 * Math.sin((i * 45 * Math.PI) / 180)}
                      r="3"
                      fill="#ef4444"
                      style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }}
                    />
                  ))}
                  
                  {/* Inner metallic ring */}
                  <circle cx="60" cy="60" r="35" fill="none" stroke="url(#ringGradient2)" strokeWidth="5" />
                  <circle cx="60" cy="60" r="32" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.3" />
                  
                  {/* Red glowing inner ring */}
                  <circle 
                    cx="60" cy="60" r="28" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="2"
                    style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }}
                  />
                  
                  {/* Core background with glow */}
                  <circle cx="60" cy="60" r="25" fill="#0f172a" />
                  <circle cx="60" cy="60" r="24" fill="url(#coreGlow)" />
                  
                  {/* X symbol with enhanced glow */}
                  <g filter="url(#redGlow)">
                    <line x1="45" y1="45" x2="75" y2="75" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
                    <line x1="75" y1="45" x2="45" y2="75" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
                  </g>
                  
                  {/* Core highlight */}
                  <circle cx="55" cy="55" r="8" fill="white" opacity="0.05" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Games Lobby Overlay */}
      {showGamesLobby && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-red-500/30 p-6">
            {/* Close Button */}
            <button 
              onClick={() => setShowGamesLobby(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h2 className="text-center text-lg font-bold mb-6 text-red-400">Games Lobby</h2>

            {/* Main Stats Layout */}
            <div className="relative">
              {/* Left Column - CPU */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 space-y-3 text-left">
                <div className="text-red-400 font-bold text-sm">CPU</div>
                <div className="text-cyan-400 text-sm">{Math.round(cpuTemp)}°C</div>
                <div className="text-white font-semibold">{Math.round(cpuMHz)}MHz</div>
                <div className="mt-4">
                  <div className="text-cyan-400 text-sm">{memoryUsed.toFixed(1)}GB</div>
                  <div className="text-xs text-muted-foreground">8GB</div>
                  <div className="text-xs text-muted-foreground">Memory<br/>Used</div>
                </div>
              </div>

              {/* Right Column - GPU */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-3 text-right">
                <div className="text-red-400 font-bold text-sm">GPU</div>
                <div className="text-cyan-400 text-sm">{Math.round(gpuTemp)}°C</div>
                <div className="text-white font-semibold">{Math.round(gpuMHz)}MHz</div>
                <div className="mt-4">
                  <div className="text-cyan-400 text-sm">{storageUsed.toFixed(2)}GB</div>
                  <div className="text-xs text-muted-foreground">128GB</div>
                  <div className="text-xs text-muted-foreground">Storage<br/>Used</div>
                </div>
              </div>

              {/* Center Temperature Gauge */}
              <div className="flex justify-center py-8">
                <div className="relative">
                  <svg className="w-40 h-40" viewBox="0 0 100 100">
                    {/* Outer decorative rings */}
                    <circle cx="50" cy="50" r="48" fill="none" stroke="#334155" strokeWidth="1" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#475569" strokeWidth="2" />
                    {/* Tech dots */}
                    {Array.from({ length: 24 }).map((_, i) => (
                      <circle
                        key={i}
                        cx={50 + 46 * Math.cos((i * 15 * Math.PI) / 180)}
                        cy={50 + 46 * Math.sin((i * 15 * Math.PI) / 180)}
                        r="1.5"
                        fill={i % 2 === 0 ? "#ef4444" : "#334155"}
                      />
                    ))}
                    {/* Progress arc */}
                    <circle 
                      cx="50" cy="50" r="38" 
                      fill="none" 
                      stroke="#1e293b" 
                      strokeWidth="6"
                    />
                    <circle 
                      cx="50" cy="50" r="38" 
                      fill="none" 
                      stroke="url(#tempGradient)" 
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${((cpuTemp + gpuTemp) / 2 / 100) * 238} 238`}
                      transform="rotate(-90 50 50)"
                      style={{ filter: 'drop-shadow(0 0 4px #ef4444)' }}
                    />
                    {/* Inner circle */}
                    <circle cx="50" cy="50" r="30" fill="#0f172a" />
                    <circle cx="50" cy="50" r="28" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
                    <defs>
                      <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Temperature Value */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-red-400" style={{ textShadow: '0 0 10px #ef4444' }}>
                      {Math.round((cpuTemp + gpuTemp) / 2)}
                    </span>
                    <span className="text-lg text-red-400">°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Remaining Time */}
            <div className="text-center mt-4 pt-4 border-t border-muted/20">
              <div className="text-xs text-muted-foreground mb-1">Remaining time</div>
              <div className="text-cyan-400 font-semibold">{formatRemainingTime(batteryTimeRemaining)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Assistant */}
      <BoostAssistant 
        cpuUsage={cpuUsage}
        ramUsage={ramUsage}
        fps={fps}
        gpuUsage={gpuUsage}
        performanceMode={performanceMode}
        isVisible={showPanels}
        wifiEnabled={wifiEnabled}
        setWifiEnabled={setWifiEnabled}
        setPerformanceMode={setPerformanceMode}
      />

      {/* Floating Bar Button - App Mode (shows everywhere) */}
      {!showPanels && (
        <button
          onClick={() => setShowPanels(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 w-6 h-24 hover:scale-110 transition-transform"
        >
          <img src={assistantToggle} alt="Open Panel" className="w-full h-full object-contain" />
        </button>
      )}

      {/* No intro video - Game Space opens directly */}

      {/* Advanced Dashboard */}
      {showAdvanced && (
        <AdvancedDashboard 
          onClose={() => {
            setShowAdvanced(false);
            setSelectedAppFromNav(null);
          }} 
          initialApp={selectedAppFromNav ? {
            packageName: selectedAppFromNav.packageName,
            appName: selectedAppFromNav.appName,
            icon: selectedAppFromNav.icon,
            isIncluded: true,
            boosted: false,
          } : null}
        />
      )}

      {/* Developer Credit */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-30">
        <p className="text-xs text-muted-foreground/60">Developed by B.Taha</p>
      </div>
    </div>
  );
};

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Zap, Cpu, MemoryStick, Gauge, Monitor, Settings, TrendingUp, PanelLeftOpen, Battery, Grid3X3, X, HardDrive, Thermometer, Clock } from "lucide-react";
import { BoostAssistant } from "./BoostAssistant";
import { AdvancedDashboard } from "./AdvancedDashboard";
import { toast } from "sonner";
import wifiOn from "@/assets/wifi-on.webp";
import wifiOff from "@/assets/wifi-off.webp";
import buttonBar from "@/assets/button-bar.jpg";
import startAnimation from "@/assets/start_animation.mp4";

export const GameBoosterDashboard = () => {
  const navigate = useNavigate();
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
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [cpuTemp, setCpuTemp] = useState(47);
  const [gpuTemp, setGpuTemp] = useState(46);
  const [cpuMHz, setCpuMHz] = useState(710);
  const [gpuMHz, setGpuMHz] = useState(675);
  const [memoryUsed, setMemoryUsed] = useState(4.8);
  const [storageUsed, setStorageUsed] = useState(22.86);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [batteryTimeRemaining, setBatteryTimeRemaining] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

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

          {/* Performance Mode Buttons */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            {/* Low Power Mode */}
            <button
              onClick={() => handleModeChange("saving")}
              className={`group relative flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-300 ${
                performanceMode === "saving"
                  ? "bg-primary/10 shadow-[0_0_30px_rgba(16,185,129,0.4)] border-2 border-primary"
                  : "bg-card/50 border-2 border-border hover:border-primary/50"
              }`}
            >
              <div className={`relative ${performanceMode === "saving" ? "animate-pulse" : ""}`}>
                <Battery className={`w-16 h-16 ${
                  performanceMode === "saving" ? "text-primary" : "text-muted-foreground"
                }`} />
                {performanceMode === "saving" && (
                  <>
                    <Zap className="w-6 h-6 text-accent absolute -top-2 -left-2 animate-bounce" />
                    <Zap className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-bounce delay-75" />
                  </>
                )}
              </div>
              <span className={`text-sm font-semibold ${
                performanceMode === "saving" ? "text-primary" : "text-muted-foreground"
              }`}>
                Low Power
              </span>
              {performanceMode === "saving" && (
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
              )}
            </button>

            {/* Balanced Mode */}
            <button
              onClick={() => handleModeChange("balance")}
              className={`group relative flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-300 ${
                performanceMode === "balance"
                  ? "bg-secondary/10 shadow-[0_0_30px_rgba(59,130,246,0.4)] border-2 border-secondary"
                  : "bg-card/50 border-2 border-border hover:border-secondary/50"
              }`}
            >
              <div className={`relative ${performanceMode === "balance" ? "animate-pulse" : ""}`}>
                <Gauge className={`w-16 h-16 ${
                  performanceMode === "balance" ? "text-secondary" : "text-muted-foreground"
                }`} />
                {performanceMode === "balance" && (
                  <div className="absolute inset-0 animate-spin-slow">
                    <Zap className="w-5 h-5 text-accent absolute -top-6 left-1/2 -translate-x-1/2" />
                  </div>
                )}
              </div>
              <span className={`text-sm font-semibold ${
                performanceMode === "balance" ? "text-secondary" : "text-muted-foreground"
              }`}>
                Balanced
              </span>
              {performanceMode === "balance" && (
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-secondary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
              )}
            </button>

            {/* Gamer Mode */}
            <button
              onClick={() => handleModeChange("boost")}
              className={`group relative flex flex-col items-center gap-4 p-6 rounded-2xl transition-all duration-300 ${
                performanceMode === "boost"
                  ? "bg-primary/10 shadow-[0_0_40px_rgba(16,185,129,0.6)] border-2 border-primary"
                  : "bg-card/50 border-2 border-border hover:border-primary/50"
              }`}
            >
              <div className={`relative ${performanceMode === "boost" ? "animate-bounce" : ""}`}>
                <Zap className={`w-16 h-16 ${
                  performanceMode === "boost" ? "text-primary" : "text-muted-foreground"
                }`} />
                {performanceMode === "boost" && (
                  <>
                    <div className="absolute inset-0 animate-ping opacity-50">
                      <Zap className="w-16 h-16 text-primary" />
                    </div>
                    <Zap className="w-4 h-4 text-accent absolute top-0 left-0 animate-pulse" />
                    <Zap className="w-4 h-4 text-accent absolute top-0 right-0 animate-pulse delay-75" />
                    <Zap className="w-4 h-4 text-accent absolute bottom-0 left-1/2 -translate-x-1/2 animate-pulse delay-150" />
                  </>
                )}
              </div>
              <span className={`text-sm font-semibold ${
                performanceMode === "boost" ? "text-primary" : "text-muted-foreground"
              }`}>
                Gamer Mode
              </span>
              {performanceMode === "boost" && (
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
              )}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Cpu className="h-5 w-5" />
            <span className="text-sm">Clear Cache</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <MemoryStick className="h-5 w-5" />
            <span className="text-sm">Free RAM</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Monitor className="h-5 w-5" />
            <span className="text-sm">GPU Optimize</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex-col gap-2"
            onClick={() => setShowIntroVideo(true)}
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm">Game Space</span>
          </Button>
        </div>

        {/* Gravity X Feature */}
        <div className="flex justify-center mt-8 mb-12">
          <button 
            onClick={() => setShowGamesLobby(true)}
            className="relative p-6 bg-card/60 backdrop-blur rounded-2xl border border-border hover:border-red-500/60 transition-all hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <span 
                className="text-sm font-bold tracking-widest text-muted-foreground"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
              >
                Gravity X
              </span>
              <div className="relative">
                {/* Outer tech rings */}
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  {/* Outer decorative ring */}
                  <circle cx="50" cy="50" r="48" fill="none" stroke="hsl(var(--muted))" strokeWidth="1" opacity="0.3" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" opacity="0.4" />
                  {/* Tech details - dots around */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={50 + 46 * Math.cos((i * 30 * Math.PI) / 180)}
                      cy={50 + 46 * Math.sin((i * 30 * Math.PI) / 180)}
                      r="2"
                      fill="#ef4444"
                      opacity="0.6"
                    />
                  ))}
                  {/* Middle glowing ring */}
                  <circle 
                    cx="50" cy="50" r="36" 
                    fill="none" 
                    stroke="#64748b" 
                    strokeWidth="3" 
                    opacity="0.6"
                  />
                  <circle 
                    cx="50" cy="50" r="32" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="2" 
                    opacity="0.8"
                    style={{ filter: 'drop-shadow(0 0 6px #ef4444)' }}
                  />
                  {/* Inner circle background */}
                  <circle cx="50" cy="50" r="26" fill="#1a1a2e" />
                  <circle 
                    cx="50" cy="50" r="24" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                  {/* X symbol */}
                  <g style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }}>
                    <line x1="38" y1="38" x2="62" y2="62" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                    <line x1="62" y1="38" x2="38" y2="62" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                  </g>
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
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 w-8 h-32 rounded-l-xl shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:scale-110 transition-transform"
          style={{
            background: `url(${buttonBar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      {/* Game Space Intro Video */}
      {showIntroVideo && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <video
            src={startAnimation}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onEnded={() => {
              setShowIntroVideo(false);
              setShowAdvanced(true);
            }}
          />
        </div>
      )}

      {/* Advanced Dashboard */}
      {showAdvanced && (
        <AdvancedDashboard onClose={() => setShowAdvanced(false)} />
      )}

      {/* Developer Credit */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-30">
        <p className="text-xs text-muted-foreground/60">Developed by B.Taha</p>
      </div>
    </div>
  );
};

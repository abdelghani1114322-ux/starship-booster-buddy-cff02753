import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Zap, Cpu, MemoryStick, Gauge, Monitor, Settings, TrendingUp, PanelLeftOpen } from "lucide-react";
import { BoostAssistant } from "./BoostAssistant";
import { toast } from "sonner";
import wifiOn from "@/assets/wifi-on.webp";
import wifiOff from "@/assets/wifi-off.webp";

export const GameBoosterDashboard = () => {
  const [cpuUsage, setCpuUsage] = useState(45);
  const [ramUsage, setRamUsage] = useState(62);
  const [fps, setFps] = useState(60);
  const [gpuUsage, setGpuUsage] = useState(38);
  const [isBoosted, setIsBoosted] = useState(false);
  const [optimizationScore, setOptimizationScore] = useState(72);
  const [showPanels, setShowPanels] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate real-time performance metrics
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isBoosted) {
        setCpuUsage((prev) => Math.max(30, Math.min(80, prev + (Math.random() - 0.5) * 10)));
        setRamUsage((prev) => Math.max(40, Math.min(85, prev + (Math.random() - 0.5) * 8)));
        setFps((prev) => Math.max(45, Math.min(75, prev + (Math.random() - 0.5) * 5)));
        setGpuUsage((prev) => Math.max(25, Math.min(70, prev + (Math.random() - 0.5) * 8)));
      } else {
        setCpuUsage((prev) => Math.max(20, Math.min(40, prev + (Math.random() - 0.5) * 5)));
        setRamUsage((prev) => Math.max(30, Math.min(50, prev + (Math.random() - 0.5) * 4)));
        setFps((prev) => Math.max(100, Math.min(144, prev + (Math.random() - 0.5) * 3)));
        setGpuUsage((prev) => Math.max(15, Math.min(35, prev + (Math.random() - 0.5) * 4)));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBoosted]);

  const handleBoost = () => {
    setIsBoosted(!isBoosted);
    if (!isBoosted) {
      toast.success("Performance Boost Activated!", {
        description: "System optimized for maximum gaming performance",
      });
      setOptimizationScore(95);
    } else {
      toast.info("Boost Deactivated", {
        description: "System returned to normal mode",
      });
      setOptimizationScore(72);
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

  return (
    <div className="min-h-screen bg-background p-6" ref={containerRef}>
      <div className="max-w-7xl mx-auto space-y-6">
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
              variant={showPanels ? "default" : "outline"} 
              size="icon"
              onClick={() => setShowPanels(!showPanels)}
              className="relative"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Boost Control */}
        <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Performance Mode</h2>
              <p className="text-muted-foreground">
                {isBoosted
                  ? "System is running in high-performance mode"
                  : "Click boost to optimize your gaming experience"}
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleBoost}
              className={`px-8 py-6 text-lg font-bold transition-all ${
                isBoosted
                  ? "bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                  : "bg-accent hover:bg-accent/90"
              }`}
            >
              <Zap className="mr-2 h-6 w-6" />
              {isBoosted ? "Boosted" : "Activate Boost"}
            </Button>
          </div>
        </Card>

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
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Settings className="h-5 w-5" />
            <span className="text-sm">Advanced</span>
          </Button>
        </div>
      </div>

      {/* Floating Assistant */}
      <BoostAssistant
        cpuUsage={cpuUsage}
        ramUsage={ramUsage}
        fps={fps}
        gpuUsage={gpuUsage}
        isBoosted={isBoosted}
        isVisible={showPanels}
      />
    </div>
  );
};

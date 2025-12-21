import { useState, useEffect, useCallback } from "react";
import { X, Home, Zap, Grid3X3, Plus, Music, Users, Loader2, Video, Play } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { BoostAssistant } from "./BoostAssistant";
import gameSpaceBg from "@/assets/game-space-bg.png";
import backButton from "@/assets/back-button.png";
import assistantToggle from "@/assets/assistant-toggle.png";
import gameBoostAnimation from "@/assets/game-boost-animation.mp4";
import engineInitVideo from "@/assets/engine-init.mp4";

interface AdvancedDashboardProps {
  onClose: () => void;
}

interface InstalledApp {
  packageName: string;
  appName: string;
  icon?: string;
  isIncluded: boolean;
  boosted: boolean;
}

export const AdvancedDashboard = ({ onClose }: AdvancedDashboardProps) => {
  const [activeTab, setActiveTab] = useState<"lobby" | "superbase">("lobby");
  const [includedApps, setIncludedApps] = useState<InstalledApp[]>([]);
  const [allApps, setAllApps] = useState<InstalledApp[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [showAppPicker, setShowAppPicker] = useState(false);
  const [showBoostAnimation, setShowBoostAnimation] = useState(false);
  const [boostingApp, setBoostingApp] = useState<string>("");
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [showRecordings, setShowRecordings] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [runningApp, setRunningApp] = useState<InstalledApp | null>(null);
  const [performanceMode, setPerformanceMode] = useState<"saving" | "balance" | "boost">("balance");
  const [cpuUsage, setCpuUsage] = useState(45);
  const [ramUsage, setRamUsage] = useState(62);
  const [fps, setFps] = useState(60);
  const [gpuUsage, setGpuUsage] = useState(38);
  const mockRecordings = [
    { id: 1, name: "PUBG Mobile Gameplay", duration: "12:34", date: "Today", thumbnail: null },
    { id: 2, name: "Free Fire Match", duration: "08:22", date: "Today", thumbnail: null },
    { id: 3, name: "Genshin Impact", duration: "25:10", date: "Yesterday", thumbnail: null },
    { id: 4, name: "Mobile Legends Ranked", duration: "18:45", date: "Yesterday", thumbnail: null },
    { id: 5, name: "Among Us Session", duration: "32:00", date: "2 days ago", thumbnail: null },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
      });
    }
  }, []);

  // Load installed apps when app picker opens
  const loadInstalledApps = async () => {
    if (allApps.length > 0) return; // Already loaded
    
    setIsLoadingApps(true);
    
    if (Capacitor.isNativePlatform()) {
      try {
        const { CapacitorUsageStatsManager } = await import(
          "@capgo/capacitor-android-usagestatsmanager"
        );
        
        const permissionResult = await CapacitorUsageStatsManager.isUsageStatsPermissionGranted();
        
        if (!permissionResult.granted) {
          toast.info("Permission required", {
            description: "Please grant usage access to see installed apps",
          });
          await CapacitorUsageStatsManager.openUsageStatsSettings();
          setIsLoadingApps(false);
          return;
        }
        
        const packages = await CapacitorUsageStatsManager.queryAllPackages();
        
        if (packages && packages.packages) {
          const apps: InstalledApp[] = packages.packages.map((pkg: any) => ({
            packageName: pkg.packageName || pkg,
            appName: extractAppName(pkg.packageName || pkg),
            icon: pkg.icon,
            isIncluded: false,
            boosted: false,
          }));
          
          setAllApps(apps.sort((a, b) => a.appName.localeCompare(b.appName)));
        }
      } catch (error) {
        console.error("Error loading apps:", error);
        loadMockApps();
      }
    } else {
      loadMockApps();
    }
    
    setIsLoadingApps(false);
  };

  const extractAppName = (packageName: string): string => {
    const parts = packageName.split(".");
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };

  const loadMockApps = () => {
    const mockApps: InstalledApp[] = [
      { packageName: "com.sobrr.agnes", appName: "Agnes", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "net.bat.store", appName: "AHA Games", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "com.gallery20", appName: "AI Gallery", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "com.innersloth.spacemafia", appName: "Among Us", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "com.tencent.ig", appName: "PUBG Mobile", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "com.dts.freefireth", appName: "Free Fire", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "com.mobile.legends", appName: "Mobile Legends", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "com.miHoYo.GenshinImpact", appName: "Genshin Impact", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "com.supercell.clashofclans", appName: "Clash of Clans", icon: undefined, isIncluded: false, boosted: false },
    ].sort((a, b) => a.appName.localeCompare(b.appName));
    
    setAllApps(mockApps);
  };

  const handleIncludeApp = (packageName: string) => {
    setAllApps(prev => prev.map(app => 
      app.packageName === packageName ? { ...app, isIncluded: true } : app
    ));
    const app = allApps.find(a => a.packageName === packageName);
    if (app) {
      setIncludedApps(prev => [...prev, { ...app, isIncluded: true }]);
      toast.success(`${app.appName} added to dashboard`);
    }
  };

  const handleExcludeApp = (packageName: string) => {
    setAllApps(prev => prev.map(app => 
      app.packageName === packageName ? { ...app, isIncluded: false } : app
    ));
    setIncludedApps(prev => prev.filter(app => app.packageName !== packageName));
    const app = allApps.find(a => a.packageName === packageName);
    if (app) {
      toast.success(`${app.appName} removed from dashboard`);
    }
  };

  const handleBoostComplete = useCallback(() => {
    setShowBoostAnimation(false);
    toast.success(`${boostingApp} Started!`);
    setBoostingApp("");
  }, [boostingApp]);

  const [showBoostOverlay, setShowBoostOverlay] = useState(false);

  const startGame = (packageName: string) => {
    const app = includedApps.find(a => a.packageName === packageName);
    if (app) {
      // Show boost overlay for 4 seconds, then close game space and show app
      setRunningApp(app);
      setShowBoostOverlay(true);
      setIncludedApps(prev => 
        prev.map(a => a.packageName === packageName ? { ...a, boosted: true } : a)
      );
      
      // Auto-close boost overlay after 4 seconds
      setTimeout(() => {
        setShowBoostOverlay(false);
        setRunningApp(null);
        toast.success(`${app.appName} launched and boosted!`);
      }, 4000);
    }
  };

  const closeRunningApp = () => {
    if (runningApp) {
      toast.info(`${runningApp.appName} closed`);
      setRunningApp(null);
      setShowBoostOverlay(false);
    }
  };

  const toggleBoost = (packageName: string) => {
    setIncludedApps(prev => 
      prev.map(app => {
        if (app.packageName === packageName) {
          const newBoosted = !app.boosted;
          toast.success(newBoosted ? `${app.appName} Boosted!` : `${app.appName} Boost Disabled`);
          return { ...app, boosted: newBoosted };
        }
        return app;
      })
    );
  };

  const openAppPicker = () => {
    setShowAppPicker(true);
    loadInstalledApps();
  };

  const notIncludedApps = allApps.filter(app => !app.isIncluded);

  return (
    <>
      {/* Energy-X Boost Overlay - shows for 4 seconds when app starts */}
      {showBoostOverlay && runningApp && (
        <div className="fixed inset-0 z-[300] pointer-events-none">
          {/* Engine Init Video Animation */}
          <video
            src={engineInitVideo}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* App Info Centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-red-500 mb-4">
              {runningApp.icon ? (
                <img 
                  src={`data:image/png;base64,${runningApp.icon}`} 
                  alt={runningApp.appName} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-3xl">
                  {runningApp.appName.charAt(0)}
                </div>
              )}
            </div>
            <h3 className="text-white font-bold text-2xl drop-shadow-lg">{runningApp.appName}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Zap className="w-6 h-6 text-red-400 animate-pulse" />
              <span className="text-red-400 font-bold text-lg">ENERGY-X BOOSTING...</span>
            </div>
          </div>
        </div>
      )}
      
    <div className="fixed inset-0 z-50 bg-black overflow-hidden" style={{ backgroundImage: `url(${gameSpaceBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Tech Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-1/3 h-1/2 border-r border-b border-red-900/50" />
        <div className="absolute top-0 right-0 w-1/3 h-1/2 border-l border-b border-red-900/50" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 border-r border-t border-red-900/50" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 border-l border-t border-red-900/50" />
        {/* Diagonal lines */}
        <svg className="absolute inset-0 w-full h-full">
          <line x1="0" y1="50%" x2="25%" y2="30%" stroke="rgba(127, 29, 29, 0.3)" strokeWidth="2" />
          <line x1="100%" y1="50%" x2="75%" y2="30%" stroke="rgba(127, 29, 29, 0.3)" strokeWidth="2" />
          <line x1="0" y1="50%" x2="25%" y2="70%" stroke="rgba(127, 29, 29, 0.3)" strokeWidth="2" />
          <line x1="100%" y1="50%" x2="75%" y2="70%" stroke="rgba(127, 29, 29, 0.3)" strokeWidth="2" />
          {/* Horizontal accent lines */}
          <line x1="0" y1="50%" x2="30%" y2="50%" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1" />
          <line x1="70%" y1="50%" x2="100%" y2="50%" stroke="rgba(220, 38, 38, 0.4)" strokeWidth="1" />
        </svg>
      </div>

      {/* Corner Tech Elements */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-red-800/50" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-red-800/50" />
      <div className="absolute bottom-20 left-4 w-16 h-16 border-l-2 border-b-2 border-red-800/50" />
      <div className="absolute bottom-20 right-4 w-16 h-16 border-r-2 border-b-2 border-red-800/50" />

      {/* Header */}
      <div className="relative flex items-center justify-between px-6 py-3 z-10">
        <h1 className="text-xl font-bold tracking-[0.3em] text-white/90" style={{ fontFamily: 'system-ui' }}>
          REDMAGIC
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white/80">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-6 h-3 rounded-sm border border-green-500 relative overflow-hidden">
              <div className="absolute inset-0.5 bg-green-500" style={{ width: `${batteryLevel}%` }} />
            </div>
            <span className="text-xs text-white/70">{batteryLevel}%</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white/70" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Grid3X3 className="w-4 h-4 text-white/70" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Music className="w-4 h-4 text-white/70" />
          </button>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-red-500/30 transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col h-[calc(100vh-140px)] overflow-auto">
        {activeTab === "lobby" ? (
          <div className="flex-1 px-4 py-6">
            {/* Apps List - Like reference image */}
            <div className="space-y-3">
              {includedApps.map((app) => (
                <button
                  key={app.packageName}
                  onClick={() => startGame(app.packageName)}
                  className={`w-full flex items-center gap-4 p-2 rounded-xl transition-all hover:bg-white/5 ${
                    app.boosted ? 'bg-red-500/10' : ''
                  }`}
                >
                  {/* App Icon */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-900">
                    {app.icon ? (
                      <img 
                        src={`data:image/png;base64,${app.icon}`} 
                        alt={app.appName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-2xl">
                        {app.appName.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {/* App Info */}
                  <div className="flex-1 text-left">
                    <h3 className="text-white font-medium text-lg">{app.appName}</h3>
                    <p className="text-white/40 text-sm">
                      {"<1h"} · {Math.floor(Math.random() * 90) + 1}d · {Math.floor(Math.random() * 5)}GB
                    </p>
                  </div>
                  
                  {/* Boost indicator */}
                  {app.boosted && (
                    <Zap className="w-5 h-5 text-red-500" />
                  )}
                </button>
              ))}
              
              {/* Add App Button */}
              <button
                onClick={openAppPicker}
                className="w-full flex items-center gap-4 p-2 rounded-xl transition-all hover:bg-white/5"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-700/50 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-white/50" />
                </div>
                <span className="text-white/50 font-medium">Add Game</span>
              </button>
            </div>
            
            {includedApps.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/30 text-lg">No games added yet</p>
                <p className="text-white/20 text-sm mt-2">Tap the + button to add games</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 px-6 w-full max-w-2xl">
            {/* Apps Grid for Super Base */}
            <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-red-500" />
              Boost Your Apps
            </h2>
            {includedApps.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                <p>No apps added yet</p>
                <p className="text-sm mt-1">Tap + to add games</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {includedApps.map((app) => (
                  <button
                    key={app.packageName}
                    onClick={() => toggleBoost(app.packageName)}
                    className={`relative p-4 rounded-xl border transition-all ${
                      app.boosted
                        ? "bg-red-500/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                        : "bg-white/5 border-white/10 hover:border-red-500/50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {app.icon ? (
                        <img
                          src={`data:image/png;base64,${app.icon}`}
                          alt={app.appName}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 font-bold">
                          {app.appName.charAt(0)}
                        </div>
                      )}
                      <span className="text-[10px] text-white/70 truncate w-full text-center">
                        {app.appName}
                      </span>
                      {app.boosted && (
                        <Zap className="absolute top-1 right-1 w-3 h-3 text-red-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Red Magic Time Section */}
            <div className="mt-8">
              <button
                onClick={() => setShowRecordings(true)}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-red-900/40 to-red-800/20 border border-red-500/30 hover:border-red-500/60 transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Video className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-semibold">Red Magic Time</h3>
                  <p className="text-white/50 text-sm">View your screen recordings</p>
                </div>
                <div className="text-white/50 text-sm">{mockRecordings.length} videos</div>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3 mt-8">
              <Button
                variant="ghost"
                className="h-16 flex-col gap-1 bg-white/5 hover:bg-red-500/20 border border-white/10"
                onClick={() => toast.success("All Apps Boosted!")}
              >
                <Zap className="w-5 h-5 text-red-500" />
                <span className="text-[10px] text-white/70">Boost All</span>
              </Button>
              <Button
                variant="ghost"
                className="h-16 flex-col gap-1 bg-white/5 hover:bg-red-500/20 border border-white/10"
                onClick={() => toast.success("Cache Cleared!")}
              >
                <span className="text-lg">🧹</span>
                <span className="text-[10px] text-white/70">Clear</span>
              </Button>
              <Button
                variant="ghost"
                className="h-16 flex-col gap-1 bg-white/5 hover:bg-red-500/20 border border-white/10"
                onClick={() => toast.success("RAM Optimized!")}
              >
                <span className="text-lg">💾</span>
                <span className="text-[10px] text-white/70">RAM</span>
              </Button>
              <Button
                variant="ghost"
                className="h-16 flex-col gap-1 bg-white/5 hover:bg-red-500/20 border border-white/10"
                onClick={() => toast.success("GPU Turbo!")}
              >
                <span className="text-lg">⚡</span>
                <span className="text-[10px] text-white/70">GPU</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Plus Button - Bottom Left */}
      <button 
        onClick={openAppPicker}
        className="absolute bottom-24 left-6 w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <Plus className="w-6 h-6 text-white/70" />
      </button>

      {/* App Picker Overlay - Add Games */}
      {showAppPicker && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col overflow-hidden" onClick={() => setShowAppPicker(false)}>
          <div 
            className="flex flex-col w-full max-w-lg mx-auto h-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
              <h3 className="text-xl font-bold text-white">Add Games</h3>
              <button 
                onClick={() => setShowAppPicker(false)}
                className="w-12 h-12 rounded-lg overflow-hidden hover:scale-105 transition-transform"
              >
                <img src={backButton} alt="Back" className="w-full h-full object-cover" />
              </button>
            </div>
            
            {/* Not Added Count */}
            <div className="px-4 py-3 text-white/60 text-sm shrink-0">
              {notIncludedApps.length} Not added
            </div>
            
            {/* App List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
              {isLoadingApps ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                </div>
              ) : notIncludedApps.length === 0 ? (
                <div className="text-center py-12 text-white/50">
                  <p>All apps have been added!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notIncludedApps.map((app) => (
                    <div
                      key={app.packageName}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      {/* App Icon */}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-white/5">
                        {app.icon ? (
                          <img
                            src={`data:image/png;base64,${app.icon}`}
                            alt={app.appName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-red-500/30 to-red-900/30 flex items-center justify-center">
                            <span className="text-xl font-bold text-red-500">
                              {app.appName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* App Name */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{app.appName}</h4>
                      </div>

                      {/* Exclude/Include Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleExcludeApp(app.packageName)}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Exclude
                        </button>
                        <button
                          onClick={() => handleIncludeApp(app.packageName)}
                          className="px-4 py-2 rounded-lg bg-white/10 text-white/70 text-sm font-medium hover:bg-white/20 transition-colors border border-white/20"
                        >
                          Include
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Screen Recordings Overlay */}
      {showRecordings && (
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col overflow-hidden">
          <div className="flex flex-col w-full max-w-lg mx-auto h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <Video className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-bold text-white">Red Magic Time</h3>
              </div>
              <button 
                onClick={() => setShowRecordings(false)}
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-red-500/30 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>
            
            {/* Recordings Count */}
            <div className="px-4 py-3 text-white/60 text-sm shrink-0">
              {mockRecordings.length} Screen Recordings
            </div>
            
            {/* Recordings List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
              <div className="space-y-3">
                {mockRecordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-red-900/30 to-black flex items-center justify-center shrink-0">
                      <Play className="w-6 h-6 text-red-500" />
                    </div>

                    {/* Recording Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{recording.name}</h4>
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <span>{recording.duration}</span>
                        <span>•</span>
                        <span>{recording.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-24 right-6 flex gap-2">
        <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10">
          <Grid3X3 className="w-5 h-5 text-white/50" />
        </button>
        <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10">
          <Music className="w-5 h-5 text-white/50" />
        </button>
        <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10">
          <Users className="w-5 h-5 text-white/50" />
        </button>
      </div>

      {/* Bottom Tab Navigation */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
        <button
          onClick={() => setActiveTab("lobby")}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all ${
            activeTab === "lobby"
              ? "bg-gradient-to-r from-red-900/60 to-red-800/40 border border-red-500/50 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium text-sm">Game Lobby</span>
        </button>
        <button
          onClick={() => setActiveTab("superbase")}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all ${
            activeTab === "superbase"
              ? "bg-gradient-to-r from-red-900/60 to-red-800/40 border border-red-500/50 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="font-medium text-sm">Super Base</span>
        </button>
      </div>

      {/* Assistant Panel Toggle Button */}
      <button
        onClick={() => setShowAssistant(!showAssistant)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 w-6 h-24 hover:scale-110 transition-transform"
      >
        <img src={assistantToggle} alt="Open Panel" className="w-full h-full object-contain" />
      </button>

      {/* Boost Assistant Panel */}
      <BoostAssistant
        cpuUsage={cpuUsage}
        ramUsage={ramUsage}
        fps={fps}
        gpuUsage={gpuUsage}
        performanceMode={performanceMode}
        isVisible={showAssistant}
        wifiEnabled={wifiEnabled}
        setWifiEnabled={setWifiEnabled}
        setPerformanceMode={setPerformanceMode}
      />
    </div>
    </>
  );
};

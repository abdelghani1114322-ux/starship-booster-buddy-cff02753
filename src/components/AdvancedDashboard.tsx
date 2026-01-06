import { useState, useEffect } from "react";
import { ArrowLeft, Menu, ChevronRight, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { BoostAssistant } from "./BoostAssistant";

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
  const [includedApps, setIncludedApps] = useState<InstalledApp[]>([]);
  const [allApps, setAllApps] = useState<InstalledApp[]>([]);
  const [currentAppIndex, setCurrentAppIndex] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [showAppPicker, setShowAppPicker] = useState(false);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [performanceMode, setPerformanceMode] = useState<"saving" | "balance" | "boost">("balance");
  const [cpuUsage, setCpuUsage] = useState(45);
  const [ramUsage, setRamUsage] = useState(62);
  const [fps, setFps] = useState(60);
  const [gpuUsage, setGpuUsage] = useState(38);
  const [ping, setPing] = useState(196);
  const [temperature, setTemperature] = useState(28.0);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [showMenu, setShowMenu] = useState(false);

  // Simulate ping and temperature updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 100) + 50);
      setTemperature(parseFloat((25 + Math.random() * 10).toFixed(1)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
      });
    }
  }, []);

  const loadInstalledApps = async () => {
    if (allApps.length > 0) return;
    
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
      { packageName: "com.DVloper.Granny3", appName: "Granny 3", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "com.tencent.ig", appName: "PUBG Mobile", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "com.dts.freefireth", appName: "Free Fire", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "com.mobile.legends", appName: "Mobile Legends", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "com.miHoYo.GenshinImpact", appName: "Genshin Impact", icon: undefined, isIncluded: false, boosted: false },
      { packageName: "com.supercell.clashofclans", appName: "Clash of Clans", icon: undefined, isIncluded: false, boosted: false },
    ].sort((a, b) => a.appName.localeCompare(b.appName));
    
    setAllApps(mockApps);
  };

  const toggleAppSelection = (packageName: string) => {
    setSelectedApps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(packageName)) {
        newSet.delete(packageName);
      } else {
        newSet.add(packageName);
      }
      return newSet;
    });
  };

  const confirmAddApps = () => {
    const appsToAdd = allApps.filter(app => selectedApps.has(app.packageName) && !app.isIncluded);
    
    if (appsToAdd.length === 0) {
      toast.info("No new apps selected");
      setShowAppPicker(false);
      return;
    }

    setAllApps(prev => prev.map(app => 
      selectedApps.has(app.packageName) ? { ...app, isIncluded: true } : app
    ));
    
    setIncludedApps(prev => [
      ...prev,
      ...appsToAdd.map(app => ({ ...app, isIncluded: true }))
    ]);
    
    toast.success(`${appsToAdd.length} app(s) added`);
    setSelectedApps(new Set());
    setShowAppPicker(false);
    }

  const cancelAddApps = () => {
    setSelectedApps(new Set());
    setShowAppPicker(false);
  };

  const openAppPicker = () => {
    setSelectedApps(new Set());
    setShowAppPicker(true);
    loadInstalledApps();
  };

  const startGame = () => {
    if (includedApps.length === 0) {
      toast.info("Add a game first");
      return;
    }
    const app = includedApps[currentAppIndex];
    setIncludedApps(prev => 
      prev.map((a, i) => i === currentAppIndex ? { ...a, boosted: true } : a)
    );
    toast.success(`${app.appName} Boosted & Started!`);
  };

  const nextApp = () => {
    if (includedApps.length > 0) {
      setCurrentAppIndex((prev) => (prev + 1) % includedApps.length);
    }
  };

  const prevApp = () => {
    if (includedApps.length > 0) {
      setCurrentAppIndex((prev) => (prev - 1 + includedApps.length) % includedApps.length);
    }
  };

  const notIncludedApps = allApps.filter(app => !app.isIncluded);
  const currentApp = includedApps[currentAppIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#0a1929] overflow-hidden">
      {/* Diagonal Accent Lines - Left */}
      <div className="absolute left-0 top-0 bottom-0 w-24 overflow-hidden pointer-events-none">
        <div 
          className="absolute left-8 top-[10%] w-1 h-[35%] bg-gradient-to-b from-transparent via-cyan-400 to-cyan-400/50 transform rotate-12"
          style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)' }}
        />
        <div 
          className="absolute left-8 bottom-[10%] w-1 h-[35%] bg-gradient-to-t from-transparent via-cyan-400 to-cyan-400/50 transform -rotate-12"
          style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)' }}
        />
      </div>

      {/* Diagonal Accent Lines - Right */}
      <div className="absolute right-0 top-0 bottom-0 w-24 overflow-hidden pointer-events-none">
        <div 
          className="absolute right-8 top-[10%] w-1 h-[35%] bg-gradient-to-b from-transparent via-cyan-400 to-cyan-400/50 transform -rotate-12"
          style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)' }}
        />
        <div 
          className="absolute right-8 bottom-[10%] w-1 h-[35%] bg-gradient-to-t from-transparent via-cyan-400 to-cyan-400/50 transform rotate-12"
          style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)' }}
        />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between px-6 py-4 z-10">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18l6 3v9.64l-6 3-6-3V7.18l6-3zm-2 4.82v6l2 1 2-1v-6l-2-1-2 1z"/>
          </svg>
          <span className="text-xl font-bold text-white tracking-wider">FFORCE</span>
        </div>

        {/* Menu Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-between h-[calc(100vh-180px)] px-4">
        {/* Left Stats */}
        <div className="flex flex-col items-center gap-4 w-32">
          <div className="text-center">
            <p className="text-white/60 text-xs tracking-widest mb-1">CURRENT PING</p>
            <p className="text-3xl font-bold text-white">
              {ping} <span className="text-cyan-400 text-lg">ms</span>
            </p>
          </div>
          <div className="text-center w-full">
            <p className="text-white/60 text-xs tracking-widest mb-2">BATTERY</p>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-400 rounded-full transition-all"
                style={{ width: `${batteryLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center Game Card */}
        <div className="flex-1 flex items-center justify-center max-w-md mx-4">
          {includedApps.length > 0 && currentApp ? (
            <div 
              className="relative w-full bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              style={{ boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}
            >
              {/* Blurred background effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-black/80" />
              </div>

              {/* Game Icon */}
              <div className="relative flex flex-col items-center">
                <div className="w-28 h-28 rounded-2xl overflow-hidden mb-4 border-2 border-white/20">
                  {currentApp.icon ? (
                    <img 
                      src={`data:image/png;base64,${currentApp.icon}`} 
                      alt={currentApp.appName} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-4xl">
                      {currentApp.appName.charAt(0)}
                    </div>
                  )}
                </div>
                
                {/* Game Name */}
                <h2 className="text-white text-xl font-bold mb-1">{currentApp.appName}</h2>
                <p className="text-white/50 text-sm">{currentApp.packageName}</p>
              </div>

              {/* Navigation arrows */}
              {includedApps.length > 1 && (
                <>
                  <button
                    onClick={prevApp}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 rotate-180" />
                  </button>
                  <button
                    onClick={nextApp}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div 
              className="w-full bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
              onClick={openAppPicker}
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 border border-dashed border-white/30 flex items-center justify-center mb-4">
                <Plus className="w-10 h-10 text-white/40" />
              </div>
              <p className="text-white/60 text-lg">Add a game to start</p>
              <p className="text-white/40 text-sm mt-1">Tap to browse games</p>
            </div>
          )}
        </div>

        {/* Right Stats */}
        <div className="flex flex-col items-center gap-4 w-32">
          <div className="text-center">
            <p className="text-white/60 text-xs tracking-widest mb-1">TEMPERATURE</p>
            <p className="text-3xl font-bold text-white">
              {temperature}<span className="text-cyan-400 text-lg align-top">°C</span>
            </p>
          </div>
          <div className="text-center w-full">
            <p className="text-white/60 text-xs tracking-widest mb-2">+ POWER</p>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: '70%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Panel Toggle Button - Left Side */}
      <button
        onClick={() => setShowAssistant(!showAssistant)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-[#0a1929]/80"
        style={{ boxShadow: '0 0 15px rgba(34, 211, 238, 0.4)' }}
      >
        <ChevronRight className="w-6 h-6 text-cyan-400" />
      </button>

      {/* START Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
        <button
          onClick={startGame}
          disabled={includedApps.length === 0}
          className="w-full py-5 bg-gradient-to-r from-cyan-400 to-cyan-500 text-[#0a1929] font-bold text-2xl tracking-widest rounded-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            clipPath: 'polygon(5% 0, 100% 0, 100% 70%, 95% 100%, 0 100%, 0 30%)',
            boxShadow: '0 0 30px rgba(34, 211, 238, 0.5)'
          }}
        >
          START
        </button>
      </div>

      {/* Add Game Button - Near panel toggle */}
      <button
        onClick={openAppPicker}
        className="fixed left-4 bottom-8 w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <Plus className="w-6 h-6 text-white/70" />
      </button>

      {/* App Picker Overlay - Grid Layout */}
      {showAppPicker && (
        <div className="fixed inset-0 z-60 bg-[#1a2635] flex flex-col overflow-hidden">
          {/* Header with OK/CANCEL */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d1a2a] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-[#0a1929] -rotate-180" />
              </div>
              <h3 className="text-lg font-medium text-white">Add apps to Game Assist</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={confirmAddApps}
                className="px-6 py-2 rounded-lg bg-[#2a3a4a] text-white font-medium hover:bg-[#3a4a5a] transition-colors"
              >
                OK
              </button>
              <button 
                onClick={cancelAddApps}
                className="px-6 py-2 rounded-lg bg-cyan-400 text-[#0a1929] font-medium hover:bg-cyan-300 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
          
          {/* App Grid */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            {isLoadingApps ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              </div>
            ) : notIncludedApps.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <p>All apps have been added!</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-4">
                {notIncludedApps.map((app) => {
                  const isSelected = selectedApps.has(app.packageName);
                  return (
                    <button
                      key={app.packageName}
                      onClick={() => toggleAppSelection(app.packageName)}
                      className="flex flex-col items-center gap-2 p-2 rounded-xl transition-all relative group"
                    >
                      {/* Selection indicator */}
                      <div className={`absolute top-1 right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-cyan-400 border-cyan-400' 
                          : 'bg-white/10 border-white/30'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-[#0a1929]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>

                      {/* App Icon */}
                      <div className={`w-16 h-16 rounded-2xl overflow-hidden transition-all ${
                        isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#1a2635]' : ''
                      }`}>
                        {app.icon ? (
                          <img
                            src={`data:image/png;base64,${app.icon}`}
                            alt={app.appName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white/80">
                              {app.appName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* App Name */}
                      <span className="text-xs text-white/70 truncate w-full text-center max-w-[80px]">
                        {app.appName}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-60 bg-black/80" onClick={() => setShowMenu(false)}>
          <div 
            className="absolute right-0 top-0 bottom-0 w-64 bg-[#0a1929] border-l border-cyan-400/20 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-6">Menu</h3>
            <div className="space-y-4">
              <button className="w-full text-left text-white/70 hover:text-cyan-400 transition-colors py-2">
                Settings
              </button>
              <button className="w-full text-left text-white/70 hover:text-cyan-400 transition-colors py-2">
                Performance Mode
              </button>
              <button className="w-full text-left text-white/70 hover:text-cyan-400 transition-colors py-2">
                Game Library
              </button>
              <button 
                onClick={onClose}
                className="w-full text-left text-white/70 hover:text-cyan-400 transition-colors py-2"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

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
  );
};

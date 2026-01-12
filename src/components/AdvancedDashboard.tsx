import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Menu, ChevronRight, Plus, Loader2, Trash2, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { BoostAssistant } from "./BoostAssistant";
import assistantButton from "@/assets/assistant-button.png";


interface InstalledAppsPlugin {
  getInstalledApps(options?: { includeSystemApps?: boolean; includeIcons?: boolean; iconSize?: number }): Promise<{ apps: any[]; count: number }>;
  launchApp(options: { packageName: string }): Promise<{ success: boolean; packageName: string }>;
}

const InstalledAppsNative = Capacitor.isNativePlatform()
  ? registerPlugin<InstalledAppsPlugin>("InstalledApps")
  : null;

interface AdvancedDashboardProps {
  onClose: () => void;
  initialApp?: InstalledApp | null;
}

interface InstalledApp {
  packageName: string;
  appName: string;
  icon?: string;
  isIncluded: boolean;
  boosted: boolean;
}

export const AdvancedDashboard = ({ onClose, initialApp }: AdvancedDashboardProps) => {
  const [includedApps, setIncludedApps] = useState<InstalledApp[]>(() => {
    // If initialApp is provided, start with it included
    if (initialApp) {
      return [{ ...initialApp, isIncluded: true }];
    }
    return [];
  });
  const [allApps, setAllApps] = useState<InstalledApp[]>([]);
  const [currentAppIndex, setCurrentAppIndex] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [showAppPicker, setShowAppPicker] = useState(false);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showAssistantButton, setShowAssistantButton] = useState(false);
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
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showGraphicsSelector, setShowGraphicsSelector] = useState(false);
  const [selectedGraphicsApi, setSelectedGraphicsApi] = useState<"opengl" | "vulkan">("vulkan");
  const [vortexMode, setVortexMode] = useState<"disable" | "battery" | "performance" | "adaptive">("performance");
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

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
    
    if (Capacitor.isNativePlatform() && InstalledAppsNative) {
      try {
        // Use native InstalledApps plugin for real app names and icons
        const result = await InstalledAppsNative.getInstalledApps({
          includeSystemApps: false,
          includeIcons: true,
          iconSize: 96
        });
        
        if (result && result.apps) {
          const apps: InstalledApp[] = result.apps.map((app: any) => ({
            packageName: app.packageName,
            appName: app.appName || extractAppName(app.packageName),
            icon: app.icon,
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
    if (selectedApps.size === 0) {
      toast.info("No apps selected");
      setShowAppPicker(false);
      return;
    }

    const appsToAdd = allApps.filter(app => selectedApps.has(app.packageName));
    
    if (appsToAdd.length === 0) {
      toast.info("No new apps selected");
      setShowAppPicker(false);
      return;
    }
    
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
    // Show graphics API selector instead of launching directly
    setShowGraphicsSelector(true);
  };

  const launchWithGraphicsApi = async (api: "opengl" | "vulkan") => {
    setSelectedGraphicsApi(api);
    setShowGraphicsSelector(false);
    
    const app = includedApps[currentAppIndex];
    setIncludedApps(prev => 
      prev.map((a, i) => i === currentAppIndex ? { ...a, boosted: true } : a)
    );
    
    // Launch app with selected graphics API
    if (Capacitor.isNativePlatform() && InstalledAppsNative) {
      try {
        await InstalledAppsNative.launchApp({ packageName: app.packageName });
        toast.success(`Launching ${app.appName} with ${api.toUpperCase()}`);
        setShowAssistantButton(true);
        setShowAssistant(false);
      } catch (error) {
        console.error("Error launching app:", error);
        toast.error("Failed to launch app");
      }
    } else {
      toast.success(`${app.appName} started with ${api.toUpperCase()}!`);
      setShowAssistantButton(true);
      setShowAssistant(false);
    }
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

  const removeCurrentApp = () => {
    if (!currentApp) return;
    
    // Update allApps to mark as not included
    setAllApps(prev => prev.map(app => 
      app.packageName === currentApp.packageName ? { ...app, isIncluded: false } : app
    ));
    
    // Remove from includedApps
    setIncludedApps(prev => prev.filter(app => app.packageName !== currentApp.packageName));
    
    // Adjust index if needed
    if (currentAppIndex >= includedApps.length - 1) {
      setCurrentAppIndex(Math.max(0, includedApps.length - 2));
    }
    
    toast.success(`${currentApp.appName} removed`);
    setShowRemoveConfirm(false);
  };

  const handleLongPressStart = () => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setShowRemoveConfirm(true);
    }, 600);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const includedPackages = new Set(includedApps.map(app => app.packageName));
  const notIncludedApps = allApps.filter(app => !includedPackages.has(app.packageName));
  const currentApp = includedApps[currentAppIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0a1929] overflow-hidden"
      onClick={() => {
        // Hide assistant panel when clicking on main content
        if (showAssistant) {
          setShowAssistant(false);
        }
      }}
    >
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
      <div className="relative flex items-center justify-between px-6 py-4 z-10" onClick={(e) => e.stopPropagation()}>
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
      <div className="relative flex items-center justify-between h-[calc(100vh-180px)] px-4" onClick={(e) => e.stopPropagation()}>
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
              className="relative w-full bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 select-none"
              style={{ boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}
              onMouseDown={handleLongPressStart}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={handleLongPressStart}
              onTouchEnd={handleLongPressEnd}
            >
              {/* Blurred background effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-black/80" />
              </div>

              {/* Remove Confirmation Overlay */}
              {showRemoveConfirm && (
                <div className="absolute inset-0 rounded-2xl bg-black/90 z-20 flex flex-col items-center justify-center gap-4 animate-fade-in">
                  <Trash2 className="w-12 h-12 text-red-500" />
                  <p className="text-white text-lg font-medium">Remove {currentApp.appName}?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowRemoveConfirm(false)}
                      className="px-6 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={removeCurrentApp}
                      className="px-6 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

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
                
                {/* Long press hint */}
                <p className="text-white/30 text-xs mb-2">Hold to remove</p>
                
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

      {/* Menu Overlay - Vortex Mode */}
      {showMenu && (
        <div className="fixed inset-0 z-60 bg-black/80" onClick={() => setShowMenu(false)}>
          <div 
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#1a1a1a] p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Vortex Mode Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Vortex Mode</h2>
              <p className="text-white/50 text-sm mb-6">This features will change your booster profile on Apollo V-Space</p>
              
              {/* Mode Options */}
              <div className="grid grid-cols-4 gap-3">
                {/* Disable */}
                <button
                  onClick={() => setVortexMode("disable")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    vortexMode === "disable" 
                      ? "bg-[#2a2a2a] border-green-500" 
                      : "bg-[#1a1a1a] border-white/20 hover:border-white/40"
                  }`}
                >
                  <svg className="w-8 h-8 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M4.93 4.93l14.14 14.14"/>
                  </svg>
                  <span className="text-white/70 text-xs">Disable</span>
                </button>

                {/* Battery */}
                <button
                  onClick={() => setVortexMode("battery")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    vortexMode === "battery" 
                      ? "bg-[#2a2a2a] border-green-500" 
                      : "bg-[#1a1a1a] border-white/20 hover:border-white/40"
                  }`}
                >
                  <svg className="w-8 h-8 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="4" width="12" height="18" rx="2"/>
                    <rect x="9" y="1" width="6" height="2"/>
                    <rect x="8" y="10" width="8" height="8" fill="currentColor" opacity="0.3"/>
                  </svg>
                  <span className="text-white/70 text-xs">Battery</span>
                </button>

                {/* Performance */}
                <button
                  onClick={() => setVortexMode("performance")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    vortexMode === "performance" 
                      ? "bg-[#2a2a2a] border-green-500" 
                      : "bg-[#1a1a1a] border-white/20 hover:border-white/40"
                  }`}
                >
                  <svg className={`w-8 h-8 ${vortexMode === "performance" ? "text-green-500" : "text-white/70"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                    <path d="M8 12h8" strokeWidth="3"/>
                  </svg>
                  <span className={`text-xs ${vortexMode === "performance" ? "text-green-500" : "text-white/70"}`}>Performance</span>
                </button>

                {/* Adaptive */}
                <button
                  onClick={() => setVortexMode("adaptive")}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    vortexMode === "adaptive" 
                      ? "bg-[#2a2a2a] border-green-500" 
                      : "bg-[#1a1a1a] border-white/20 hover:border-white/40"
                  }`}
                >
                  <svg className="w-8 h-8 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                  <span className="text-white/70 text-xs">Adaptive</span>
                </button>
              </div>
            </div>

            {/* Select Render Section */}
            <div>
              <h2 className="text-2xl font-bold text-[#4ade80] mb-4">Select Render</h2>
              
              <div className="flex gap-4">
                {/* OpenGL Option */}
                <button
                  onClick={() => setSelectedGraphicsApi("opengl")}
                  className={`flex-1 p-4 rounded-xl bg-[#1a1a1a] border transition-all text-left ${
                    selectedGraphicsApi === "opengl"
                      ? "border-green-500"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <div className="mb-3">
                    <span className="text-white text-lg font-bold italic">Open</span>
                    <span className="text-white text-lg font-bold italic">GL</span>
                    <span className="text-red-500 text-xs align-top">®</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">
                    OpenGL is a cross-platform graphics API that enables developers to interact with a computer's GPU to render 2D and 3D graphics.
                  </p>
                </button>

                {/* Vulkan Option */}
                <button
                  onClick={() => setSelectedGraphicsApi("vulkan")}
                  className={`flex-1 p-4 rounded-xl bg-[#1a1a1a] border-2 transition-all text-left ${
                    selectedGraphicsApi === "vulkan"
                      ? "border-[#cc0000] shadow-[0_0_15px_rgba(204,0,0,0.3)]"
                      : "border-white/20 hover:border-white/40"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-1">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L4 20h16L12 2z" fill="#cc0000"/>
                      <path d="M12 7L7 17h10L12 7z" fill="#1a1a1a"/>
                    </svg>
                    <span className="text-[#cc0000] text-lg font-bold italic">Vulkan</span>
                    <span className="text-[#cc0000] text-[8px]">™</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">
                    Vulkan is a low-level graphics API designed for high-performance rendering on modern GPUs.
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Graphics API Selector */}
      {showGraphicsSelector && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowGraphicsSelector(false)}
        >
          <div 
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <h2 className="text-2xl font-bold text-[#4ade80] mb-6 ml-1">Select Render</h2>

            {/* Graphics Options */}
            <div className="flex gap-4">
              {/* OpenGL Option */}
              <button
                onClick={() => launchWithGraphicsApi("opengl")}
                className="flex-1 p-5 rounded-xl bg-[#1a1a1a] border border-white/20 hover:border-white/40 transition-all text-left"
              >
                {/* OpenGL Logo */}
                <div className="mb-4">
                  <svg className="h-8" viewBox="0 0 120 50" fill="none">
                    <text x="0" y="35" fill="white" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold" fontStyle="italic">
                      Open
                    </text>
                    <text x="55" y="35" fill="white" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold" fontStyle="italic">
                      GL
                    </text>
                    <text x="55" y="35" fill="white" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold" fontStyle="italic" style={{ letterSpacing: '-1px' }}>
                      <tspan fill="#cc0000">®</tspan>
                    </text>
                  </svg>
                </div>
                {/* Description */}
                <p className="text-white/60 text-sm leading-relaxed">
                  OpenGL is a cross-platform graphics API that enables developers to interact with a computer's GPU to render 2D and 3D graphics.
                </p>
              </button>

              {/* Vulkan Option */}
              <button
                onClick={() => launchWithGraphicsApi("vulkan")}
                className="flex-1 p-5 rounded-xl bg-[#1a1a1a] border-2 border-[#cc0000] hover:border-[#ff3333] transition-all text-left hover:shadow-[0_0_20px_rgba(204,0,0,0.3)]"
              >
                {/* Vulkan Logo */}
                <div className="mb-4 flex items-center gap-2">
                  <svg className="h-8" viewBox="0 0 30 30" fill="none">
                    <path d="M15 2L2 28h26L15 2z" fill="#cc0000"/>
                    <path d="M15 8L7 24h16L15 8z" fill="#1a1a1a"/>
                  </svg>
                  <span className="text-[#cc0000] text-2xl font-bold italic">Vulkan</span>
                  <span className="text-[#cc0000] text-xs">™</span>
                </div>
                {/* Description */}
                <p className="text-white/60 text-sm leading-relaxed">
                  Vulkan is a low-level graphics API designed for high-performance rendering on modern GPUs.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}


      {showAssistantButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAssistant(!showAssistant);
          }}
          className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-transparent flex items-center justify-center transform hover:scale-110 active:scale-95 transition-transform"
        >
          <img src={assistantButton} alt="Assistant" className="w-full h-full object-contain" />
        </button>
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

// Optimizer Mode Selector component
interface OptimizerModeSelectorProps {
  app: InstalledApp;
  onBasicSelect: () => void;
  onVSpaceSelect: () => void;
  onClose: () => void;
}

export const OptimizerModeSelector = ({ app, onBasicSelect, onVSpaceSelect, onClose }: OptimizerModeSelectorProps) => {
  return (
    <div 
      className="fixed inset-0 z-[200] bg-black/80 flex items-end justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-gradient-to-b from-[#1a2635] to-[#0d1821] rounded-2xl p-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lime-400 font-semibold">{app.appName}</span>
            <span className="text-white/60">•</span>
            <span className="text-white/60 text-sm">Select Optimizer Mode</span>
          </div>
          <button className="text-white/40 hover:text-white">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Options */}
        <div className="flex gap-3">
          {/* BASIC Mode */}
          <button
            onClick={onBasicSelect}
            className="flex-1 py-3 px-6 rounded-full bg-[#2a3a4a] text-white font-bold text-sm tracking-wider hover:bg-[#3a4a5a] transition-colors"
          >
            BASIC
          </button>

          {/* V-SPACE Mode */}
          <button
            onClick={onVSpaceSelect}
            className="flex-[2] py-3 px-6 rounded-full bg-lime-400 text-[#0a1929] font-bold text-sm tracking-wider hover:bg-lime-300 transition-colors flex items-center justify-center gap-2"
          >
            <span>V-SPACE</span>
            <div className="w-5 h-5 rounded border border-[#0a1929]/30 flex items-center justify-center">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="4" width="14" height="17" rx="2" />
                <path d="M9 9h6M9 13h6M9 17h4" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect, useCallback } from "react";
import { X, Home, Zap, Grid3X3, Plus, Music, Users, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import BoostAnimation from "./BoostAnimation";

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

  const startGame = (packageName: string) => {
    const app = includedApps.find(a => a.packageName === packageName);
    if (app) {
      setBoostingApp(app.appName);
      setShowBoostAnimation(true);
      setIncludedApps(prev => 
        prev.map(a => a.packageName === packageName ? { ...a, boosted: true } : a)
      );
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
      {/* Boost Animation Overlay */}
      <BoostAnimation 
        isVisible={showBoostAnimation} 
        onComplete={handleBoostComplete}
        appName={boostingApp}
      />
      
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
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
      <div className="relative flex-1 flex items-center justify-center h-[calc(100vh-140px)]">
        {activeTab === "lobby" ? (
          <>
            {/* Central Circular Design */}
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Outermost ring with tick marks */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4a1515" />
                    <stop offset="50%" stopColor="#7f1d1d" />
                    <stop offset="100%" stopColor="#4a1515" />
                  </linearGradient>
                </defs>
                {/* Outer decorative circle */}
                <circle cx="200" cy="200" r="195" fill="none" stroke="#1f1f1f" strokeWidth="8" />
                {/* Tick marks around the circle */}
                {Array.from({ length: 60 }).map((_, i) => {
                  const angle = (i * 6 - 90) * (Math.PI / 180);
                  const x1 = 200 + 185 * Math.cos(angle);
                  const y1 = 200 + 185 * Math.sin(angle);
                  const x2 = 200 + (i % 5 === 0 ? 175 : 180) * Math.cos(angle);
                  const y2 = 200 + (i % 5 === 0 ? 175 : 180) * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={i % 5 === 0 ? "#4a1515" : "#2a2a2a"}
                      strokeWidth={i % 5 === 0 ? 2 : 1}
                    />
                  );
                })}
                {/* Main ring */}
                <circle cx="200" cy="200" r="165" fill="none" stroke="url(#ringGrad)" strokeWidth="12" />
                {/* Inner ring */}
                <circle cx="200" cy="200" r="145" fill="none" stroke="#2a1a1a" strokeWidth="3" />
                {/* Tech detail arcs */}
                <path
                  d="M 200 60 A 140 140 0 0 1 340 200"
                  fill="none"
                  stroke="#3d1515"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 200 A 140 140 0 0 1 200 340"
                  fill="none"
                  stroke="#3d1515"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Corner brackets */}
                <rect x="85" y="85" width="20" height="6" rx="2" fill="#4a4a4a" transform="rotate(45 95 88)" />
                <rect x="295" y="85" width="20" height="6" rx="2" fill="#4a4a4a" transform="rotate(-45 305 88)" />
                <rect x="85" y="309" width="20" height="6" rx="2" fill="#4a4a4a" transform="rotate(-45 95 312)" />
                <rect x="295" y="309" width="20" height="6" rx="2" fill="#4a4a4a" transform="rotate(45 305 312)" />
              </svg>

              {/* Inner circle with grid pattern */}
              <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-[#1a0a0a] via-[#2d1010] to-[#1a0a0a] border-2 border-red-900/40 overflow-hidden">
                {/* Grid pattern overlay */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(127,29,29,0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(127,29,29,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
                {/* Radial glow */}
                <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-transparent to-transparent" />
              </div>

              {/* Center Logo */}
              <div className="absolute inset-[25%] flex items-center justify-center">
                <div className="relative">
                  {/* Glowing logo */}
                  <svg viewBox="0 0 60 80" className="w-16 h-20 md:w-20 md:h-24">
                    <defs>
                      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#7f1d1d" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    {/* Trident shape */}
                    <path
                      d="M30 0 L30 80 M15 15 L15 50 M45 15 L45 50 M8 25 L8 40 M52 25 L52 40"
                      stroke="url(#logoGrad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                      filter="url(#glow)"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Apps floating around - only visible when no app selected */}
            <div className="absolute bottom-32 left-8 hidden md:block">
              <div className="grid grid-cols-1 gap-2">
                {includedApps.slice(0, 2).map((app) => (
                  <button
                    key={app.packageName}
                    onClick={() => startGame(app.packageName)}
                    className={`w-12 h-12 rounded-xl transition-all ${
                      app.boosted ? 'bg-red-500/30 ring-2 ring-red-500' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {app.icon ? (
                      <img src={`data:image/png;base64,${app.icon}`} alt={app.appName} className="w-8 h-8 mx-auto rounded-lg" />
                    ) : (
                      <div className="w-8 h-8 mx-auto rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 font-bold">
                        {app.appName.charAt(0)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="absolute bottom-32 right-8 hidden md:block">
              <div className="grid grid-cols-1 gap-2">
                {includedApps.slice(2, 4).map((app) => (
                  <button
                    key={app.packageName}
                    onClick={() => startGame(app.packageName)}
                    className={`w-12 h-12 rounded-xl transition-all ${
                      app.boosted ? 'bg-red-500/30 ring-2 ring-red-500' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {app.icon ? (
                      <img src={`data:image/png;base64,${app.icon}`} alt={app.appName} className="w-8 h-8 mx-auto rounded-lg" />
                    ) : (
                      <div className="w-8 h-8 mx-auto rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 font-bold">
                        {app.appName.charAt(0)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
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
        <div className="fixed inset-0 z-60 bg-black/95 flex flex-col" onClick={() => setShowAppPicker(false)}>
          <div 
            className="flex-1 flex flex-col w-full max-w-lg mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-white/10">
              <button 
                onClick={() => setShowAppPicker(false)}
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <h3 className="text-xl font-bold text-white">Add Games</h3>
            </div>
            
            {/* Not Added Count */}
            <div className="px-4 py-3 text-white/60 text-sm">
              {notIncludedApps.length} Not added
            </div>
            
            {/* App List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
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

      {/* Right Side Icons */}
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
    </div>
    </>
  );
};

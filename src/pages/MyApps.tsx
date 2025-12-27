import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Zap, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Capacitor, registerPlugin } from "@capacitor/core";

interface InstalledApp {
  packageName: string;
  appName: string;
  icon?: string; // Base64 encoded icon
  isOptimized: boolean;
  isSystemApp?: boolean;
}

interface InstalledAppsPlugin {
  getInstalledApps(options?: { includeSystemApps?: boolean; includeIcons?: boolean; iconSize?: number }): Promise<{ apps: InstalledApp[]; count: number }>;
  launchApp(options: { packageName: string }): Promise<{ success: boolean }>;
  getAppIcon(options: { packageName: string; iconSize?: number }): Promise<{ icon: string }>;
}

const InstalledAppsNative = Capacitor.isNativePlatform() 
  ? registerPlugin<InstalledAppsPlugin>("InstalledApps") 
  : null;

export default function MyApps() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [filteredApps, setFilteredApps] = useState<InstalledApp[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSystemApps, setShowSystemApps] = useState(false);

  useEffect(() => {
    loadInstalledApps();
  }, [showSystemApps]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredApps(apps);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredApps(
        apps.filter(
          (app) =>
            app.appName.toLowerCase().includes(query) ||
            app.packageName.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, apps]);

  const loadInstalledApps = async () => {
    setIsLoading(true);
    
    if (Capacitor.isNativePlatform() && InstalledAppsNative) {
      try {
        const result = await InstalledAppsNative.getInstalledApps({
          includeSystemApps: showSystemApps,
          includeIcons: true,
          iconSize: 128,
        });
        
        if (result && result.apps) {
          const installedApps: InstalledApp[] = result.apps.map((app: any) => ({
            packageName: app.packageName,
            appName: app.appName,
            icon: app.icon,
            isOptimized: false,
            isSystemApp: app.isSystemApp,
          }));
          
          setApps(installedApps.sort((a, b) => a.appName.localeCompare(b.appName)));
          toast.success(`Found ${result.count} apps`);
        }
      } catch (error) {
        console.error("Error loading apps:", error);
        // Fallback to usage stats manager
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
            setIsLoading(false);
            return;
          }
          
          const packages = await CapacitorUsageStatsManager.queryAllPackages();
          
          if (packages && packages.packages) {
            const installedApps: InstalledApp[] = packages.packages.map((pkg: any) => ({
              packageName: pkg.packageName || pkg,
              appName: extractAppName(pkg.packageName || pkg),
              icon: pkg.icon,
              isOptimized: false,
            }));
            
            setApps(installedApps.sort((a, b) => a.appName.localeCompare(b.appName)));
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
          loadMockApps();
        }
      }
    } else {
      // Web fallback - show mock data
      loadMockApps();
    }
    
    setIsLoading(false);
  };

  const extractAppName = (packageName: string): string => {
    // Extract a readable name from package name
    const parts = packageName.split(".");
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };

  const loadMockApps = () => {
    // Mock data for web preview with sample icons
    const mockApps: InstalledApp[] = [
      { packageName: "com.instagram.android", appName: "Instagram", isOptimized: false },
      { packageName: "com.facebook.katana", appName: "Facebook", isOptimized: false },
      { packageName: "com.whatsapp", appName: "WhatsApp", isOptimized: false },
      { packageName: "com.google.android.youtube", appName: "YouTube", isOptimized: false },
      { packageName: "com.tencent.ig", appName: "PUBG Mobile", isOptimized: true },
      { packageName: "com.activision.callofduty.shooter", appName: "Call of Duty Mobile", isOptimized: true },
      { packageName: "com.dts.freefireth", appName: "Free Fire", isOptimized: false },
      { packageName: "com.mobile.legends", appName: "Mobile Legends", isOptimized: true },
      { packageName: "com.miHoYo.GenshinImpact", appName: "Genshin Impact", isOptimized: false },
      { packageName: "com.supercell.clashofclans", appName: "Clash of Clans", isOptimized: false },
      { packageName: "com.innersloth.spacemafia", appName: "Among Us", isOptimized: true },
      { packageName: "com.spotify.music", appName: "Spotify", isOptimized: false },
      { packageName: "com.netflix.mediaclient", appName: "Netflix", isOptimized: false },
      { packageName: "com.twitter.android", appName: "Twitter", isOptimized: false },
      { packageName: "com.snapchat.android", appName: "Snapchat", isOptimized: false },
      { packageName: "com.zhiliaoapp.musically", appName: "TikTok", isOptimized: false },
      { packageName: "com.discord", appName: "Discord", isOptimized: false },
      { packageName: "com.telegram.messenger", appName: "Telegram", isOptimized: false },
    ].sort((a, b) => a.appName.localeCompare(b.appName));
    
    setApps(mockApps);
  };

  const handleToggleOptimize = (e: React.MouseEvent, packageName: string) => {
    e.stopPropagation(); // Prevent app launch when toggling
    setApps((prevApps) =>
      prevApps.map((app) =>
        app.packageName === packageName
          ? { ...app, isOptimized: !app.isOptimized }
          : app
      )
    );
    
    const app = apps.find((a) => a.packageName === packageName);
    if (app) {
      toast.success(
        app.isOptimized
          ? `${app.appName} removed from boost`
          : `${app.appName} added to boost list`
      );
    }
  };

  const handleLaunchApp = async (packageName: string, appName: string) => {
    if (Capacitor.isNativePlatform() && InstalledAppsNative) {
      try {
        await InstalledAppsNative.launchApp({ packageName });
        toast.success(`Launching ${appName}...`);
      } catch (error) {
        // Fallback to intent
        try {
          window.location.href = `intent://#Intent;package=${packageName};end`;
          toast.success(`Launching ${appName}...`);
        } catch (e) {
          toast.error(`Cannot launch ${appName}`);
        }
      }
    } else {
      toast.info(`Would launch: ${appName}`, {
        description: "App launching works on native Android only"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card/80 border-b border-border shrink-0">
        <div className="text-center py-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 border-b border-border">
          <span className="text-xs text-muted-foreground">
            by <span className="font-semibold text-primary">B.Taha</span>
          </span>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-destructive text-3xl font-bold">X</span>
                <div>
                  <p className="text-muted-foreground text-sm leading-none">MY</p>
                  <h1 className="text-xl font-bold text-destructive leading-none">APPS</h1>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={loadInstalledApps}
              disabled={isLoading}
              className="shrink-0"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <span>{filteredApps.length} apps</span>
            <span>{apps.filter(a => a.isOptimized).length} optimized</span>
          </div>
        </div>
      </header>

      {/* Apps List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <p>No apps found</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filteredApps.map((app) => (
              <div
                key={app.packageName}
                onClick={() => handleLaunchApp(app.packageName, app.appName)}
                className={`flex items-center gap-4 p-3 rounded-lg bg-card/60 border border-border cursor-pointer transition-all hover:border-primary/50 active:scale-[0.98] ${
                  app.isOptimized ? "border-primary/30 bg-primary/5" : ""
                }`}
              >
                {/* App Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${
                    app.isOptimized
                      ? "ring-2 ring-primary shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                      : "bg-muted"
                  }`}
                >
                  {app.icon ? (
                    <img
                      src={`data:image/png;base64,${app.icon}`}
                      alt={app.appName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {app.appName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* App Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-destructive font-semibold truncate">
                    {app.appName}
                  </h3>
                  <p className="text-muted-foreground text-sm truncate">
                    {app.packageName}
                  </p>
                </div>

                {/* Boost Toggle Button */}
                <button
                  onClick={(e) => handleToggleOptimize(e, app.packageName)}
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    app.isOptimized 
                      ? "bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <Zap className={`h-5 w-5 ${app.isOptimized ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

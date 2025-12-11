import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";

interface InstalledApp {
  packageName: string;
  appName: string;
  icon?: string; // Base64 encoded icon
  isOptimized: boolean;
}

export default function MyApps() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [filteredApps, setFilteredApps] = useState<InstalledApp[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInstalledApps();
  }, []);

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
    
    if (Capacitor.isNativePlatform()) {
      try {
        // Try to use the native plugin
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
      } catch (error) {
        console.error("Error loading apps:", error);
        toast.error("Could not load installed apps");
        // Load mock data as fallback
        loadMockApps();
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
    // Mock data for web preview
    const mockApps: InstalledApp[] = [
      { packageName: "com.sobrr.agnes", appName: "Agnes", isOptimized: false },
      { packageName: "net.bat.store", appName: "AHA Games", isOptimized: false },
      { packageName: "com.gallery20", appName: "AI Gallery", isOptimized: false },
      { packageName: "com.innersloth.spacemafia", appName: "Among Us", isOptimized: true },
      { packageName: "com.gmail.heagoo.apkeditor", appName: "APK Editor", isOptimized: false },
      { packageName: "com.gmail.heagoo.apkeditor.pro", appName: "APK Editor Pro", isOptimized: false },
      { packageName: "com.apkeditor.new.explorer3", appName: "APK Explorer", isOptimized: false },
      { packageName: "ru.maximoff.apktool", appName: "Apktool M", isOptimized: false },
      { packageName: "com.tencent.ig", appName: "PUBG Mobile", isOptimized: true },
      { packageName: "com.activision.callofduty.shooter", appName: "Call of Duty Mobile", isOptimized: true },
      { packageName: "com.dts.freefireth", appName: "Free Fire", isOptimized: false },
      { packageName: "com.mobile.legends", appName: "Mobile Legends", isOptimized: true },
      { packageName: "com.miHoYo.GenshinImpact", appName: "Genshin Impact", isOptimized: false },
      { packageName: "com.supercell.clashofclans", appName: "Clash of Clans", isOptimized: false },
      { packageName: "com.king.candycrushsaga", appName: "Candy Crush Saga", isOptimized: false },
    ].sort((a, b) => a.appName.localeCompare(b.appName));
    
    setApps(mockApps);
  };

  const handleToggleOptimize = (packageName: string) => {
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
          <div className="flex items-center gap-3 mb-3">
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
                <p className="text-muted-foreground text-sm leading-none">GAME</p>
                <h1 className="text-xl font-bold text-destructive leading-none">MENU</h1>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for Games"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
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
                onClick={() => handleToggleOptimize(app.packageName)}
                className={`flex items-center gap-4 p-3 rounded-lg bg-card/60 border border-border cursor-pointer transition-all hover:border-primary/50 ${
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

                {/* Optimized Badge */}
                {app.isOptimized && (
                  <div className="shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

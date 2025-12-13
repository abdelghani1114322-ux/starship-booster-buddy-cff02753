import { useState } from "react";
import { X, Home, Zap, Grid3X3 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import pubgIcon from "@/assets/pubg-icon.png";
import freefireIcon from "@/assets/freefire-icon.png";
import chromeIcon from "@/assets/chrome-icon.png";
import youtubeIcon from "@/assets/youtube-icon.png";
import whatsappIcon from "@/assets/whatsapp-icon.png";

interface AdvancedDashboardProps {
  onClose: () => void;
}

const apps = [
  { id: 1, name: "PUBG Mobile", icon: pubgIcon, boosted: false },
  { id: 2, name: "Free Fire", icon: freefireIcon, boosted: false },
  { id: 3, name: "Chrome", icon: chromeIcon, boosted: false },
  { id: 4, name: "YouTube", icon: youtubeIcon, boosted: false },
  { id: 5, name: "WhatsApp", icon: whatsappIcon, boosted: false },
];

export const AdvancedDashboard = ({ onClose }: AdvancedDashboardProps) => {
  const [activeTab, setActiveTab] = useState<"lobby" | "superbase">("lobby");
  const [appList, setAppList] = useState(apps);

  const toggleBoost = (id: number) => {
    setAppList(prev => 
      prev.map(app => {
        if (app.id === id) {
          const newBoosted = !app.boosted;
          toast.success(newBoosted ? `${app.name} Boosted!` : `${app.name} Boost Disabled`);
          return { ...app, boosted: newBoosted };
        }
        return app;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur">
        <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          GAME SPACE
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Advanced Mode</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-destructive/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "lobby" ? (
          <div className="space-y-6">
            {/* Center Logo/Emblem */}
            <div className="flex justify-center py-8">
              <div className="relative w-48 h-48">
                {/* Outer rings */}
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 200 200" style={{ animationDuration: '20s' }}>
                  <circle cx="100" cy="100" r="95" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1" opacity="0.3" />
                  <circle cx="100" cy="100" r="85" fill="none" stroke="hsl(var(--destructive))" strokeWidth="2" opacity="0.5" strokeDasharray="10 5" />
                  <circle cx="100" cy="100" r="75" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1" opacity="0.4" />
                </svg>
                {/* Inner glow */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-red-900/50 to-black flex items-center justify-center border border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
                  <Zap className="w-16 h-16 text-destructive animate-pulse" />
                </div>
              </div>
            </div>

            {/* Apps Grid */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-destructive" />
                My Apps
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {appList.map((app) => (
                  <div
                    key={app.id}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                      app.boosted
                        ? "bg-destructive/10 border-destructive shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        : "bg-card/60 border-border hover:border-destructive/50"
                    }`}
                    onClick={() => toggleBoost(app.id)}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <img
                          src={app.icon}
                          alt={app.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        {app.boosted && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
                            <Zap className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-center truncate w-full">
                        {app.name}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        app.boosted
                          ? "bg-destructive/20 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {app.boosted ? "Boosted" : "Tap to Boost"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Super Base Content */}
            <div className="flex justify-center py-8">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-destructive/30 flex items-center justify-center">
                  <Zap className="w-12 h-12 text-destructive" />
                </div>
                <h2 className="text-xl font-bold">Super Base</h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Advanced performance tuning and system optimization settings
                </p>
              </div>
            </div>

            {/* Quick Boost Actions */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-destructive/30 hover:bg-destructive/10"
                onClick={() => toast.success("RAM Cleared!")}
              >
                <span className="text-2xl">🚀</span>
                <span className="text-xs">Boost All</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-destructive/30 hover:bg-destructive/10"
                onClick={() => toast.success("Cache Cleared!")}
              >
                <span className="text-2xl">🧹</span>
                <span className="text-xs">Clear Cache</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-destructive/30 hover:bg-destructive/10"
                onClick={() => toast.success("Memory Optimized!")}
              >
                <span className="text-2xl">💾</span>
                <span className="text-xs">Optimize RAM</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 border-destructive/30 hover:bg-destructive/10"
                onClick={() => toast.success("GPU Turbo Enabled!")}
              >
                <span className="text-2xl">⚡</span>
                <span className="text-xs">GPU Turbo</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tab Navigation */}
      <div className="flex items-center justify-center gap-2 p-4 border-t border-border bg-card/80 backdrop-blur">
        <button
          onClick={() => setActiveTab("lobby")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === "lobby"
              ? "bg-gradient-to-r from-red-500/20 to-red-600/20 border border-destructive text-foreground"
              : "bg-muted/30 border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Game Lobby</span>
        </button>
        <button
          onClick={() => setActiveTab("superbase")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === "superbase"
              ? "bg-gradient-to-r from-red-500/20 to-red-600/20 border border-destructive text-foreground"
              : "bg-muted/30 border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="font-medium">Super Base</span>
        </button>
      </div>
    </div>
  );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, MoreVertical, Zap, Trash2, Settings, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppItem {
  id: string;
  name: string;
  icon: string;
  packageName: string;
  isOptimized: boolean;
}

export default function MyApps() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<AppItem[]>([
    { id: "1", name: "PUBG Mobile", icon: "🎮", packageName: "com.tencent.ig", isOptimized: true },
    { id: "2", name: "Call of Duty", icon: "🔫", packageName: "com.activision.callofduty", isOptimized: true },
    { id: "3", name: "Genshin Impact", icon: "⚔️", packageName: "com.miHoYo.GenshinImpact", isOptimized: false },
    { id: "4", name: "Mobile Legends", icon: "🛡️", packageName: "com.mobile.legends", isOptimized: true },
    { id: "5", name: "Free Fire", icon: "🔥", packageName: "com.dts.freefireth", isOptimized: false },
  ]);

  const handleAddApp = () => {
    toast.info("App picker would open here", {
      description: "This requires native integration to list installed apps",
    });
  };

  const handleOptimizeApp = (appId: string) => {
    setApps(apps.map(app => 
      app.id === appId ? { ...app, isOptimized: !app.isOptimized } : app
    ));
    const app = apps.find(a => a.id === appId);
    if (app) {
      toast.success(app.isOptimized ? `${app.name} removed from boost` : `${app.name} added to boost list`);
    }
  };

  const handleRemoveApp = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    setApps(apps.filter(a => a.id !== appId));
    if (app) {
      toast.success(`${app.name} removed from list`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 bg-card/50 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">My Apps</h1>
        </div>
        <Button onClick={handleAddApp} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add App
        </Button>
      </header>

      {/* Apps Grid */}
      <div className="p-4">
        <p className="text-muted-foreground mb-4">
          {apps.length} apps • {apps.filter(a => a.isOptimized).length} optimized
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {apps.map((app) => (
            <Card
              key={app.id}
              className={`relative p-4 flex flex-col items-center gap-3 transition-all hover:border-primary/50 ${
                app.isOptimized ? "border-primary/30 bg-primary/5" : ""
              }`}
            >
              {/* Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-8 w-8"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleOptimizeApp(app.id)}>
                    <Zap className="h-4 w-4 mr-2" />
                    {app.isOptimized ? "Remove Boost" : "Add Boost"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("App settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRemoveApp(app.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* App Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-card flex items-center justify-center text-3xl border ${
                app.isOptimized ? "border-primary shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-border"
              }`}>
                {app.icon}
              </div>

              {/* App Name */}
              <span className="text-sm font-medium text-center line-clamp-2">
                {app.name}
              </span>

              {/* Optimized Badge */}
              {app.isOptimized && (
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Zap className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </Card>
          ))}

          {/* Add App Card */}
          <Card
            className="p-4 flex flex-col items-center justify-center gap-3 border-dashed cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[140px]"
            onClick={handleAddApp}
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Add App</span>
          </Card>
        </div>
      </div>
    </div>
  );
}

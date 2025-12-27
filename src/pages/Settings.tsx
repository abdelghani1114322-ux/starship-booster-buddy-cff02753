import { useState, useEffect } from "react";
import { Wifi, Bell, HelpCircle, User, ChevronDown, Grid3X3, Shield, Moon, Volume2, Vibrate, BellOff, Eye, Lock, RotateCcw, Smartphone, Settings as SettingsIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<"stats" | "general" | "notifications" | "permissions" | "about">("general");
  const [activeTab, setActiveTab] = useState<"precent" | "summary">("precent");
  const [timeFrame, setTimeFrame] = useState<"today" | "week">("today");
  const [totalHours] = useState(0);
  const [totalMinutes] = useState(0);
  const [rank] = useState("Rookie");

  // Settings states
  const [hideNotifications, setHideNotifications] = useState(() => {
    return localStorage.getItem("hideNotifications") === "true";
  });
  const [doNotDisturb, setDoNotDisturb] = useState(() => {
    return localStorage.getItem("doNotDisturb") === "true";
  });
  const [darkMode, setDarkMode] = useState(true);
  const [vibration, setVibration] = useState(() => {
    return localStorage.getItem("vibration") !== "false";
  });
  const [soundEffects, setSoundEffects] = useState(() => {
    return localStorage.getItem("soundEffects") !== "false";
  });
  const [autoLock, setAutoLock] = useState(() => {
    return localStorage.getItem("autoLock") === "true";
  });
  const [showFloatingWindow, setShowFloatingWindow] = useState(() => {
    return localStorage.getItem("showFloatingWindow") !== "false";
  });

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("hideNotifications", String(hideNotifications));
  }, [hideNotifications]);

  useEffect(() => {
    localStorage.setItem("doNotDisturb", String(doNotDisturb));
  }, [doNotDisturb]);

  useEffect(() => {
    localStorage.setItem("vibration", String(vibration));
  }, [vibration]);

  useEffect(() => {
    localStorage.setItem("soundEffects", String(soundEffects));
  }, [soundEffects]);

  useEffect(() => {
    localStorage.setItem("autoLock", String(autoLock));
  }, [autoLock]);

  useEffect(() => {
    localStorage.setItem("showFloatingWindow", String(showFloatingWindow));
  }, [showFloatingWindow]);

  const handleResetPermissions = () => {
    localStorage.removeItem("specialPermissionsGranted");
    toast.success("Permissions reset", {
      description: "Permission dialogs will show on next app start"
    });
  };

  const majorOutputData = [
    { color: "bg-red-500", percentage: 0 },
    { color: "bg-blue-500", percentage: 0 },
    { color: "bg-yellow-500", percentage: 0 },
    { color: "bg-purple-300", percentage: 0 },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 bg-card/50 border-r border-border flex flex-col">
        {/* Profile Section */}
        <div className="p-6 bg-gradient-to-r from-card to-primary/20 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">www.godTspeed.xyz</h3>
              <p className="text-sm text-muted-foreground">Game career: %1$hours</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-auto py-4 hover:bg-primary/10"
            onClick={() => navigate("/my-apps")}
          >
            <Grid3X3 className="w-5 h-5 mr-3" />
            <span className="text-base">My Apps</span>
          </Button>
          <Button
            variant={activeSection === "general" ? "default" : "ghost"}
            className="w-full justify-start text-left h-auto py-4 hover:bg-primary/10"
            onClick={() => setActiveSection("general")}
          >
            <SettingsIcon className="w-5 h-5 mr-3" />
            <span className="text-base">General Settings</span>
          </Button>
          <Button
            variant={activeSection === "notifications" ? "default" : "ghost"}
            className="w-full justify-start text-left h-auto py-4 hover:bg-primary/10"
            onClick={() => setActiveSection("notifications")}
          >
            <Bell className="w-5 h-5 mr-3" />
            <span className="text-base">Notifications</span>
          </Button>
          <Button
            variant={activeSection === "permissions" ? "default" : "ghost"}
            className="w-full justify-start text-left h-auto py-4 hover:bg-primary/10"
            onClick={() => setActiveSection("permissions")}
          >
            <Shield className="w-5 h-5 mr-3" />
            <span className="text-base">Permissions</span>
          </Button>
          <Button
            variant={activeSection === "stats" ? "default" : "ghost"}
            className="w-full justify-start text-left h-auto py-4 hover:bg-primary/10"
            onClick={() => setActiveSection("stats")}
          >
            <Wifi className="w-5 h-5 mr-3" />
            <span className="text-base">Usage Stats</span>
          </Button>
          <Button
            variant={activeSection === "about" ? "default" : "ghost"}
            className="w-full justify-start text-left h-auto py-4 hover:bg-primary/10"
            onClick={() => setActiveSection("about")}
          >
            <Info className="w-5 h-5 mr-3" />
            <span className="text-base">About This App</span>
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-card/30 border-b border-border flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-2xl font-bold"
            >
              ← Game Space Center
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          {activeSection === "general" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-3xl font-semibold mb-8">General Settings</h2>
              
              {/* Dark Mode */}
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Moon className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">Enable dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </Card>

              {/* Sound Effects */}
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Volume2 className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Sound Effects</h3>
                    <p className="text-sm text-muted-foreground">Enable app sound effects</p>
                  </div>
                </div>
                <Switch 
                  checked={soundEffects} 
                  onCheckedChange={(checked) => {
                    setSoundEffects(checked);
                    toast.success(checked ? "Sound effects enabled" : "Sound effects disabled");
                  }} 
                />
              </Card>

              {/* Vibration */}
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Vibrate className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Vibration</h3>
                    <p className="text-sm text-muted-foreground">Enable haptic feedback</p>
                  </div>
                </div>
                <Switch 
                  checked={vibration} 
                  onCheckedChange={(checked) => {
                    setVibration(checked);
                    toast.success(checked ? "Vibration enabled" : "Vibration disabled");
                  }} 
                />
              </Card>

              {/* Auto Lock */}
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Lock className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Auto Lock</h3>
                    <p className="text-sm text-muted-foreground">Lock screen during gaming</p>
                  </div>
                </div>
                <Switch 
                  checked={autoLock} 
                  onCheckedChange={(checked) => {
                    setAutoLock(checked);
                    toast.success(checked ? "Auto lock enabled" : "Auto lock disabled");
                  }} 
                />
              </Card>

              {/* Floating Window */}
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Smartphone className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Floating Window</h3>
                    <p className="text-sm text-muted-foreground">Show floating game tools</p>
                  </div>
                </div>
                <Switch 
                  checked={showFloatingWindow} 
                  onCheckedChange={(checked) => {
                    setShowFloatingWindow(checked);
                    toast.success(checked ? "Floating window enabled" : "Floating window disabled");
                  }} 
                />
              </Card>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-3xl font-semibold mb-8">Notifications</h2>
              
              {/* Hide Notifications */}
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <BellOff className="w-6 h-6 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">Hide Notifications</h3>
                    <p className="text-sm text-muted-foreground">Hide all notifications while gaming</p>
                  </div>
                </div>
                <Switch 
                  checked={hideNotifications} 
                  onCheckedChange={(checked) => {
                    setHideNotifications(checked);
                    toast.success(checked ? "Notifications hidden" : "Notifications visible");
                  }} 
                />
              </Card>

              {/* Do Not Disturb */}
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Moon className="w-6 h-6 text-purple-500" />
                  <div>
                    <h3 className="font-semibold">Do Not Disturb</h3>
                    <p className="text-sm text-muted-foreground">Block all interruptions</p>
                  </div>
                </div>
                <Switch 
                  checked={doNotDisturb} 
                  onCheckedChange={(checked) => {
                    setDoNotDisturb(checked);
                    toast.success(checked ? "Do not disturb enabled" : "Do not disturb disabled");
                  }} 
                />
              </Card>

              {/* Notification Preview */}
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Eye className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">Notification Preview</h3>
                    <p className="text-sm text-muted-foreground">Show notification content preview</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </Card>
            </div>
          )}

          {activeSection === "permissions" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-3xl font-semibold mb-8">Permissions</h2>
              
              {/* Reset Permissions */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <RotateCcw className="w-6 h-6 text-orange-500" />
                    <div>
                      <h3 className="font-semibold">Reset Permissions</h3>
                      <p className="text-sm text-muted-foreground">Show permission dialogs again on next start</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleResetPermissions}
                    className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
                  >
                    Reset
                  </Button>
                </div>
              </Card>

              {/* Overlay Permission Status */}
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Smartphone className="w-6 h-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Floating Over Apps</h3>
                    <p className="text-sm text-muted-foreground">Display overlay windows</p>
                  </div>
                </div>
                <span className="text-green-500 text-sm font-medium">Granted</span>
              </Card>

              {/* Write Settings Permission Status */}
              <Card className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SettingsIcon className="w-6 h-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Modify System Settings</h3>
                    <p className="text-sm text-muted-foreground">Adjust brightness and volume</p>
                  </div>
                </div>
                <span className="text-green-500 text-sm font-medium">Granted</span>
              </Card>
            </div>
          )}

          {activeSection === "about" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-3xl font-semibold mb-8">About This App</h2>
              
              {/* App Logo and Name */}
              <Card className="p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-foreground">EX</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">Energy-X Game Space</h3>
                <p className="text-muted-foreground mt-2">Version 1.0.0</p>
              </Card>

              {/* App Description */}
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <Info className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Energy-X Game Space is your ultimate gaming companion. Optimize your device performance, 
                      manage your games, and enhance your gaming experience with advanced tools like Gravity-X 
                      temperature control, game boosting, and smart notifications management.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Features */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Key Features</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Game Boost Mode - Optimize CPU & GPU performance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    Gravity-X - Advanced temperature monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Smart Notifications - Block interruptions while gaming
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Floating Assistant - Quick access game tools
                  </li>
                </ul>
              </Card>

              {/* Developer Info */}
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <User className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Developer</h3>
                    <p className="text-sm text-muted-foreground">GodTSpeed Team</p>
                  </div>
                </div>
              </Card>

              {/* Copyright */}
              <div className="text-center text-sm text-muted-foreground pt-4">
                <p>© 2024 Energy-X Game Space</p>
                <p className="mt-1">All rights reserved</p>
              </div>
            </div>
          )}

          {activeSection === "stats" && (
            <>
              {/* Tab Selector and Time Frame Toggle */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-semibold">
                  {activeTab === "precent" ? "Precent" : "Summary"}
                </h2>
                <div className="flex gap-2 bg-card/50 p-1 rounded-lg">
                  <Button
                    variant={timeFrame === "today" ? "default" : "ghost"}
                    onClick={() => setTimeFrame("today")}
                    className="px-8"
                  >
                    Today
                  </Button>
                  <Button
                    variant={timeFrame === "week" ? "default" : "ghost"}
                    onClick={() => setTimeFrame("week")}
                    className="px-8"
                  >
                    Week
                  </Button>
                </div>
              </div>

              {activeTab === "precent" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Large Circular Gauge - Total Time */}
                  <div className="flex justify-center">
                    <div className="relative">
                      {/* Circular progress ring */}
                      <svg className="w-80 h-80 -rotate-90">
                        <circle
                          cx="160"
                          cy="160"
                          r="140"
                          fill="none"
                          stroke="hsl(var(--border))"
                          strokeWidth="8"
                        />
                        <circle
                          cx="160"
                          cy="160"
                          r="140"
                          fill="none"
                          stroke="hsl(var(--destructive))"
                          strokeWidth="12"
                          strokeDasharray={`${(totalMinutes / 60) * 880} 880`}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                          style={{ filter: "drop-shadow(0 0 10px hsl(var(--destructive)))" }}
                        />
                      </svg>
                      
                      {/* Center content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-muted-foreground text-lg mb-4">Total time</span>
                        <div className="flex items-end gap-4">
                          <div className="text-center">
                            <div className="text-6xl font-bold">{totalHours}</div>
                            <div className="text-muted-foreground mt-2">Hour</div>
                          </div>
                          <div className="text-4xl font-light mb-4">:</div>
                          <div className="text-center">
                            <div className="text-6xl font-bold">{totalMinutes}</div>
                            <div className="text-muted-foreground mt-2">Minute</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Major Output Section */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-muted-foreground mb-8">Major output</h3>
                    <div className="space-y-4">
                      {majorOutputData.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded ${item.color}`} />
                          <span className="text-2xl font-semibold w-20">{item.percentage}%</span>
                          <span className="text-2xl text-muted-foreground">--</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Total Gauge */}
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-semibold mb-4">Total</h3>
                      <div className="relative">
                        <svg className="w-56 h-56 -rotate-90">
                          <circle
                            cx="112"
                            cy="112"
                            r="100"
                            fill="none"
                            stroke="hsl(var(--border))"
                            strokeWidth="6"
                          />
                          <circle
                            cx="112"
                            cy="112"
                            r="100"
                            fill="none"
                            stroke="hsl(var(--destructive))"
                            strokeWidth="8"
                            strokeDasharray={`${(totalMinutes / 60) * 628} 628`}
                            strokeLinecap="round"
                            style={{ filter: "drop-shadow(0 0 8px hsl(var(--destructive)))" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-sm text-muted-foreground">{totalMinutes}Minute</span>
                          <div className="text-5xl font-bold mt-2">{totalHours}</div>
                          <span className="text-muted-foreground mt-2">Hour</span>
                        </div>
                      </div>
                    </div>

                    {/* Rank Gauge */}
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-semibold mb-4">Rank</h3>
                      <div className="relative">
                        <svg className="w-56 h-56 -rotate-90">
                          <circle
                            cx="112"
                            cy="112"
                            r="100"
                            fill="none"
                            stroke="hsl(var(--border))"
                            strokeWidth="6"
                          />
                          <circle
                            cx="112"
                            cy="112"
                            r="100"
                            fill="none"
                            stroke="hsl(var(--destructive))"
                            strokeWidth="8"
                            strokeDasharray="157 628"
                            strokeLinecap="round"
                            style={{ filter: "drop-shadow(0 0 8px hsl(var(--destructive)))" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-4xl font-bold">{rank}</div>
                        </div>
                        {/* Rank indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">3</div>
                          <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center text-sm font-bold">1</div>
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">2</div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Summary Gauge */}
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-semibold mb-4">Detailed Summary</h3>
                      <div className="relative">
                        <svg className="w-56 h-56 -rotate-90">
                          <circle
                            cx="112"
                            cy="112"
                            r="100"
                            fill="none"
                            stroke="hsl(var(--border))"
                            strokeWidth="6"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded bg-muted/50 flex items-center justify-center mb-2">
                            <span className="text-2xl">🎮</span>
                          </div>
                          <span className="text-sm text-muted-foreground">No games</span>
                          <div className="text-lg font-semibold mt-2">{totalMinutes} Minute</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Health Message */}
                  <div className="text-center">
                    <p className="text-lg text-muted-foreground">
                      Keep good physical and mental health with only moderate play
                    </p>
                  </div>
                </div>
              )}

              {/* Toggle Button */}
              <div className="flex justify-center mt-12">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab(activeTab === "precent" ? "summary" : "precent")}
                  className="text-destructive hover:text-destructive"
                >
                  <ChevronDown className="w-8 h-8 animate-bounce" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
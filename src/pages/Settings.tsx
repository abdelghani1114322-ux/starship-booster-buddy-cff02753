import { useState } from "react";
import { Wifi, Bell, HelpCircle, User, ChevronDown, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"precent" | "summary">("precent");
  const [timeFrame, setTimeFrame] = useState<"today" | "week">("today");
  const [totalHours] = useState(0);
  const [totalMinutes] = useState(0);
  const [rank] = useState("Rookie");

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
            variant="ghost"
            className="w-full justify-start text-left h-auto py-4 hover:bg-primary/10"
            onClick={() => {}}
          >
            <Wifi className="w-5 h-5 mr-3" />
            <span className="text-base">Net Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-auto py-4 hover:bg-primary/10"
            onClick={() => {}}
          >
            <Bell className="w-5 h-5 mr-3" />
            <span className="text-base">General Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-auto py-4 hover:bg-primary/10"
            onClick={() => {}}
          >
            <HelpCircle className="w-5 h-5 mr-3" />
            <span className="text-base">Help</span>
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
            <span className="text-muted-foreground">Historical notices</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
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
        </div>
      </div>
    </div>
  );
}

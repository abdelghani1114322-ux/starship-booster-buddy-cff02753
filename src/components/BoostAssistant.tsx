import { useState, useEffect } from "react";
import { Sparkles, X, Minimize2, Maximize2, Lightbulb, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface BoostAssistantProps {
  cpuUsage: number;
  ramUsage: number;
  fps: number;
  isBoosted: boolean;
}

export const BoostAssistant = ({ cpuUsage, ramUsage, fps, isBoosted }: BoostAssistantProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tip, setTip] = useState("");

  // Generate dynamic tips based on performance
  useEffect(() => {
    if (isBoosted) {
      setTip("Performance mode active! Your games should run smoother now.");
    } else if (cpuUsage > 70) {
      setTip("High CPU usage detected. Consider closing background applications.");
    } else if (ramUsage > 75) {
      setTip("RAM usage is high. Click 'Free RAM' to optimize memory.");
    } else if (fps < 60) {
      setTip("Low FPS detected. Try activating the performance boost.");
    } else {
      setTip("System is running smoothly. Ready for gaming!");
    }
  }, [cpuUsage, ramUsage, fps, isBoosted]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const getStatusIcon = () => {
    if (isBoosted) return <CheckCircle className="w-4 h-4 text-primary" />;
    if (cpuUsage > 70 || ramUsage > 75 || fps < 60) {
      return <AlertCircle className="w-4 h-4 text-accent" />;
    }
    return <CheckCircle className="w-4 h-4 text-primary" />;
  };

  return (
    <div
      className="fixed z-50 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "320px",
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className="bg-card/90 backdrop-blur-xl border-primary/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] cursor-move">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-bold text-foreground">Performance Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-4 space-y-4">
            {/* Status Alert */}
            <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="mt-0.5">{getStatusIcon()}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold text-foreground">
                    Smart Tip
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-semibold ${isBoosted ? "text-primary" : "text-foreground"}`}>
                  {isBoosted ? "Boosted" : "Normal"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current FPS</span>
                <span className="font-semibold text-accent">{Math.round(fps)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">System Load</span>
                <span className="font-semibold">
                  {Math.round((cpuUsage + ramUsage) / 2)}%
                </span>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="p-3 bg-secondary/5 rounded-lg border border-secondary/20">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-secondary">💡 Pro Tip:</span> Keep
                your drivers updated and close unnecessary background apps for best
                performance.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

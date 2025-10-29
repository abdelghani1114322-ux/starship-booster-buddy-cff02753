import { useState } from "react";
import { Sparkles, Rocket, Gauge, Zap, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";

interface AssistantPanelProps {
  score: number;
  fuel: number;
  boosts: number;
}

export const AssistantPanel = ({ score, fuel, boosts }: AssistantPanelProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useState(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  });

  return (
    <div
      className="fixed z-50 select-none"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-card/70 backdrop-blur-lg border border-primary/30 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.3)] cursor-move">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-glow" />
            <span className="font-bold text-primary">Space Assistant</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-foreground/60 hover:text-primary hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-4 space-y-4 min-w-[280px]">
            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-foreground/80">Score</span>
                </div>
                <span className="text-lg font-bold text-primary">{score}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-secondary/10">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground/80">Fuel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-secondary transition-all duration-300"
                      style={{ width: `${fuel}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-accent">{fuel}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-accent/10">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground/80">Boosts</span>
                </div>
                <span className="text-lg font-bold text-primary">{boosts}</span>
              </div>
            </div>

            {/* Tips */}
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs text-foreground/70 leading-relaxed">
                <span className="font-semibold text-primary">💡 Tip:</span> Press{" "}
                <kbd className="px-2 py-0.5 bg-background/50 rounded border border-primary/20 text-primary">SPACE</kbd>{" "}
                or{" "}
                <kbd className="px-2 py-0.5 bg-background/50 rounded border border-primary/20 text-primary">CLICK</kbd>{" "}
                to boost your rocket upward!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

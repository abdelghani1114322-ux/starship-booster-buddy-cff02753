import { useState, useEffect, useCallback } from "react";
import { SpaceBackground } from "./SpaceBackground";
import rocketImage from "@/assets/rocket.png";
import { toast } from "sonner";

interface Particle {
  x: number;
  y: number;
  id: number;
}

export const SpaceBoosterGame = () => {
  const [rocketY, setRocketY] = useState(50); // percentage from top
  const [velocity, setVelocity] = useState(0);
  const [score, setScore] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [boosts, setBoosts] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const gravity = 0.3;
  const boostPower = -8;

  const boost = useCallback(() => {
    if (fuel > 0) {
      setVelocity(boostPower);
      setBoosts((prev) => prev + 1);
      setFuel((prev) => Math.max(0, prev - 5));
      
      // Add particles
      const newParticles: Particle[] = Array.from({ length: 5 }, (_, i) => ({
        x: 50,
        y: rocketY,
        id: Date.now() + i,
      }));
      setParticles((prev) => [...prev, ...newParticles]);

      if (!gameStarted) {
        setGameStarted(true);
        toast.success("Game Started! Keep boosting!");
      }
    } else {
      toast.error("Out of fuel! Game Over!");
    }
  }, [fuel, rocketY, gameStarted]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        boost();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [boost]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVelocity((v) => v + gravity);
      setRocketY((y) => {
        const newY = y + velocity;
        // Keep rocket on screen
        if (newY > 90) return 90;
        if (newY < 5) return 5;
        return newY;
      });

      if (gameStarted) {
        setScore((s) => s + 1);
        setFuel((f) => Math.min(100, f + 0.1)); // Slow fuel regeneration
      }

      // Remove old particles
      setParticles((prev) => prev.filter((p) => Date.now() - p.id < 600));
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [velocity, gameStarted]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <SpaceBackground />

      {/* Game Area */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Start Instructions */}
        {!gameStarted && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center animate-float z-10">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-neon bg-clip-text text-transparent">
              Space Booster
            </h1>
            <p className="text-xl text-foreground/80 mb-2">Press SPACE or CLICK to boost!</p>
            <p className="text-sm text-foreground/60">Keep your rocket flying and avoid running out of fuel</p>
          </div>
        )}

        {/* Rocket */}
        <div
          className="absolute left-1/4 transition-transform cursor-pointer"
          style={{
            top: `${rocketY}%`,
            transform: `translateY(-50%) rotate(${Math.max(-30, Math.min(30, velocity * 3))}deg)`,
          }}
          onClick={boost}
        >
          <img
            src={rocketImage}
            alt="Rocket"
            className="w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(0,240,255,0.8)] animate-glow"
          />
        </div>

        {/* Boost Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-3 h-3 bg-gradient-boost rounded-full animate-boost"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
          />
        ))}

        {/* Score Display */}
        {gameStarted && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-6xl font-bold bg-gradient-neon bg-clip-text text-transparent">
              {Math.floor(score / 10)}
            </div>
            <div className="text-sm text-foreground/60 mt-1">Distance</div>
          </div>
        )}
      </div>

    </div>
  );
};

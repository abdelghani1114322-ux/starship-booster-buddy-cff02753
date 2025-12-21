import { useState, useEffect } from "react";
import { Cpu, HardDrive, Thermometer, Clock, Zap } from "lucide-react";

interface GravityXDashboardProps {
  cpuTemp: number;
  gpuTemp: number;
  cpuMHz: number;
  gpuMHz: number;
  memoryUsed: number;
  memoryTotal: number;
  storageUsed: number;
  storageTotal: number;
  batteryTimeRemaining: number | null;
}

export const GravityXDashboard = ({
  cpuTemp,
  gpuTemp,
  cpuMHz,
  gpuMHz,
  memoryUsed,
  memoryTotal,
  storageUsed,
  storageTotal,
  batteryTimeRemaining,
}: GravityXDashboardProps) => {
  const [centralTemp, setCentralTemp] = useState(40);
  
  // Calculate average temp
  useEffect(() => {
    setCentralTemp(Math.round((cpuTemp + gpuTemp) / 2));
  }, [cpuTemp, gpuTemp]);

  // Format remaining time
  const formatRemainingTime = (minutes: number | null) => {
    if (!minutes) return "Calculating...";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hours ${mins} minutes`;
  };

  // Get temp color
  const getTempColor = (temp: number) => {
    if (temp < 45) return "text-green-500";
    if (temp < 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-red-950/20 to-gray-900 rounded-2xl p-6 border border-red-900/30 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl" />
      </div>

      {/* Title */}
      <div className="relative text-center mb-6">
        <h2 className="text-lg font-bold text-white/90 tracking-wider">Games Lobby</h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <Zap className="w-4 h-4 text-red-500" />
          <span className="text-red-500 text-xs font-semibold">GRAVITY-X</span>
          <Zap className="w-4 h-4 text-red-500" />
        </div>
      </div>

      <div className="relative flex items-center justify-between">
        {/* Left Side - CPU Stats */}
        <div className="flex-1 space-y-4">
          <div className="text-left">
            <span className="text-red-500 font-bold text-sm">CPU</span>
            <div className="flex items-center gap-2 mt-1">
              <Thermometer className="w-4 h-4 text-red-400" />
              <span className={`text-lg font-bold ${getTempColor(cpuTemp)}`}>{Math.round(cpuTemp)}°C</span>
            </div>
            <div className="text-white/70 text-sm font-medium">{Math.round(cpuMHz)}MHz</div>
          </div>
          
          <div className="text-left">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              <span className="text-cyan-400 font-bold text-lg">{memoryUsed.toFixed(1)}GB</span>
            </div>
            <div className="text-white/50 text-xs">{memoryTotal}GB</div>
            <div className="text-white/40 text-xs">Memory Used</div>
          </div>
        </div>

        {/* Center - Main Temperature Circle */}
        <div className="relative flex-shrink-0 mx-4">
          {/* Outer rotating ring */}
          <div className="relative w-36 h-36">
            {/* Animated outer ring */}
            <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="2"
                strokeDasharray="20 10"
                className="opacity-60"
              />
            </svg>
            
            {/* Static middle ring */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#dc2626"
                strokeWidth="3"
                className="opacity-80"
              />
              {/* Arc indicators */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray={`${centralTemp * 2.5} 251`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
              />
            </svg>
            
            {/* Inner circle with temperature */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-red-900/50 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
              <div className="text-center">
                <span className={`text-4xl font-bold ${getTempColor(centralTemp)} drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]`}>
                  {centralTemp}
                </span>
                <span className="text-xl text-white/60">°C</span>
              </div>
            </div>
            
            {/* Corner accent lights */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </div>
        </div>

        {/* Right Side - GPU Stats */}
        <div className="flex-1 space-y-4">
          <div className="text-right">
            <span className="text-red-500 font-bold text-sm">GPU</span>
            <div className="flex items-center justify-end gap-2 mt-1">
              <span className={`text-lg font-bold ${getTempColor(gpuTemp)}`}>{Math.round(gpuTemp)}°C</span>
              <Thermometer className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-white/70 text-sm font-medium">{Math.round(gpuMHz)}MHz</div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-cyan-400 font-bold text-lg">{storageUsed.toFixed(2)}GB</span>
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
            </div>
            <div className="text-white/50 text-xs">{storageTotal}GB</div>
            <div className="text-white/40 text-xs">Storage Used</div>
          </div>
        </div>
      </div>

      {/* Bottom - Remaining Time */}
      <div className="relative mt-6 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-900/50 px-4 py-2 rounded-lg border border-red-900/30">
          <Clock className="w-4 h-4 text-red-400" />
          <span className="text-white/60 text-sm">Remaining time</span>
        </div>
        <div className="mt-2 text-white font-bold text-lg">
          {formatRemainingTime(batteryTimeRemaining)}
        </div>
      </div>

      {/* Side lock icons */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <div className="w-6 h-6 rounded bg-red-900/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <div className="w-6 h-6 rounded bg-red-900/30 flex items-center justify-center">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

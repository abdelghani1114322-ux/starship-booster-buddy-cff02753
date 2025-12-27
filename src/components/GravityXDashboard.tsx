import { useState, useEffect } from "react";
import { Thermometer, Clock, Zap, Fan } from "lucide-react";
import { Slider } from "@/components/ui/slider";

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
  const [fanSpeed, setFanSpeed] = useState(50);
  const [fanMode, setFanMode] = useState<'auto' | 'manual'>('auto');
  
  // Calculate average temp
  useEffect(() => {
    setCentralTemp(Math.round((cpuTemp + gpuTemp) / 2));
  }, [cpuTemp, gpuTemp]);

  // Auto fan speed based on temperature
  useEffect(() => {
    if (fanMode === 'auto') {
      if (centralTemp < 40) setFanSpeed(30);
      else if (centralTemp < 50) setFanSpeed(50);
      else if (centralTemp < 60) setFanSpeed(70);
      else setFanSpeed(100);
    }
  }, [centralTemp, fanMode]);

  // Get fan speed label
  const getFanSpeedLabel = (speed: number) => {
    if (speed < 30) return "Silent";
    if (speed < 50) return "Low";
    if (speed < 70) return "Medium";
    if (speed < 90) return "High";
    return "Max";
  };

  // Get fan color based on speed
  const getFanColor = (speed: number) => {
    if (speed < 30) return "text-blue-400";
    if (speed < 50) return "text-cyan-400";
    if (speed < 70) return "text-yellow-400";
    if (speed < 90) return "text-orange-400";
    return "text-red-500";
  };

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

        {/* Center - Main Temperature Circle with X Lines */}
        <div className="relative flex-shrink-0 mx-4">
          <div className="relative w-44 h-44">
            {/* Diagonal X lines - Top Left (red) */}
            <div className="absolute -top-2 -left-2 w-12 h-1 bg-gradient-to-r from-red-500 to-red-400 rounded-full transform -rotate-45 origin-right shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
            {/* Diagonal X lines - Top Right (blue) */}
            <div className="absolute -top-2 -right-2 w-12 h-1 bg-gradient-to-l from-cyan-400 to-blue-500 rounded-full transform rotate-45 origin-left shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
            {/* Diagonal X lines - Bottom Left (blue) */}
            <div className="absolute -bottom-2 -left-2 w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transform rotate-45 origin-right shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
            {/* Diagonal X lines - Bottom Right (red) */}
            <div className="absolute -bottom-2 -right-2 w-12 h-1 bg-gradient-to-l from-red-500 to-red-400 rounded-full transform -rotate-45 origin-left shadow-[0_0_10px_rgba(239,68,68,0.6)]" />

            {/* Outer circular ring with gradient */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="ringGradientNew" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" stopOpacity="0.8" />
                  <stop offset="25%" stopColor="#dc2626" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#7f1d1d" stopOpacity="0.7" />
                  <stop offset="75%" stopColor="#e5e5e5" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#f87171" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Main ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#ringGradientNew)"
                strokeWidth="4"
                filter="url(#glow)"
              />
            </svg>
            
            {/* Inner glowing orb */}
            <div className="absolute inset-6 rounded-full overflow-hidden">
              {/* Multiple layers for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-full" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ef4444_0%,_#dc2626_30%,_#991b1b_50%,_#7f1d1d_70%,_transparent_100%)] rounded-full shadow-[0_0_60px_rgba(239,68,68,0.5),inset_0_0_30px_rgba(239,68,68,0.3)]" />
              {/* Central bright glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-[radial-gradient(circle_at_center,_#fca5a5_0%,_#ef4444_40%,_transparent_80%)] rounded-full blur-sm animate-pulse" />
              </div>
              {/* Temperature display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className={`text-4xl font-bold ${getTempColor(centralTemp)} drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]`}>
                    {centralTemp}
                  </span>
                  <span className="text-xl text-white/80">°C</span>
                </div>
              </div>
            </div>
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

      {/* Fan Speed Control Section */}
      <div className="relative mt-6 bg-gray-900/50 rounded-xl p-4 border border-red-900/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Fan 
              className={`w-6 h-6 ${getFanColor(fanSpeed)} ${fanSpeed > 0 ? 'animate-spin' : ''}`}
              style={{ animationDuration: `${Math.max(0.1, 1 - fanSpeed / 100)}s` }}
            />
            <span className="text-white font-bold text-sm">Fan Speed</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFanMode(fanMode === 'auto' ? 'manual' : 'auto')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                fanMode === 'auto' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-white/60 hover:bg-gray-600'
              }`}
            >
              AUTO
            </button>
            <span className={`text-lg font-bold ${getFanColor(fanSpeed)}`}>
              {fanSpeed}%
            </span>
          </div>
        </div>
        
        {/* Fan Speed Slider */}
        <div className="flex items-center gap-3">
          <span className="text-blue-400 text-xs">🌀</span>
          <Slider
            value={[fanSpeed]}
            onValueChange={(value) => {
              setFanMode('manual');
              setFanSpeed(value[0]);
            }}
            min={0}
            max={100}
            step={5}
            className="flex-1"
          />
          <span className="text-red-500 text-xs">🔥</span>
        </div>
        
        {/* Speed Level Indicator */}
        <div className="flex items-center justify-between mt-3">
          <span className={`text-xs font-semibold ${getFanColor(fanSpeed)}`}>
            {getFanSpeedLabel(fanSpeed)}
          </span>
          <div className="flex gap-1">
            {[0, 25, 50, 75, 100].map((level) => (
              <div
                key={level}
                className={`w-2 h-2 rounded-full transition-all ${
                  fanSpeed >= level 
                    ? level < 50 ? 'bg-cyan-400' : level < 75 ? 'bg-yellow-400' : 'bg-red-500'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <span className="text-white/40 text-xs">
            {fanMode === 'auto' ? 'Auto Mode' : 'Manual'}
          </span>
        </div>
      </div>

      {/* Bottom - Remaining Time */}
      <div className="relative mt-4 text-center">
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

import { useState, useEffect, useCallback } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { App } from "@capacitor/app";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Layers, Settings, CheckCircle, ChevronRight } from "lucide-react";

interface PermissionDialogProps {
  onAllPermissionsGranted: () => void;
}

interface EnergyXOverlayPlugin {
  checkOverlayPermission(): Promise<{ granted: boolean }>;
  requestOverlayPermission(): Promise<{ granted: boolean }>;
  checkWriteSettingsPermission(): Promise<{ granted: boolean }>;
  requestWriteSettingsPermission(): Promise<{ granted: boolean }>;
  startOverlayService(): Promise<void>;
}

type PermissionStep = "intro" | "overlay" | "write_settings" | "done";

export const PermissionDialog = ({ onAllPermissionsGranted }: PermissionDialogProps) => {
  const [currentStep, setCurrentStep] = useState<PermissionStep>("intro");
  const [isVisible, setIsVisible] = useState(true);
  const [overlayGranted, setOverlayGranted] = useState(false);
  const [writeSettingsGranted, setWriteSettingsGranted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const EnergyXOverlay = Capacitor.isNativePlatform() 
    ? registerPlugin<EnergyXOverlayPlugin>("EnergyXOverlay")
    : null;

  // Check permissions on app resume (when user returns from settings)
  const checkPermissions = useCallback(async () => {
    if (!EnergyXOverlay) return;
    
    setIsChecking(true);
    try {
      const overlayResult = await EnergyXOverlay.checkOverlayPermission();
      setOverlayGranted(overlayResult.granted);
      
      const writeResult = await EnergyXOverlay.checkWriteSettingsPermission();
      setWriteSettingsGranted(writeResult.granted);

      // Auto-advance if permissions are granted
      if (overlayResult.granted && currentStep === "overlay") {
        setCurrentStep("write_settings");
      }
      if (writeResult.granted && currentStep === "write_settings") {
        handleComplete();
      }
      if (overlayResult.granted && writeResult.granted) {
        handleComplete();
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
    }
    setIsChecking(false);
  }, [EnergyXOverlay, currentStep]);

  // Initial check and listen for app resume
  useEffect(() => {
    const permissionsGranted = localStorage.getItem("specialPermissionsGranted");
    if (permissionsGranted === "true" || !Capacitor.isNativePlatform()) {
      setIsVisible(false);
      onAllPermissionsGranted();
      return;
    }

    // Check on mount
    checkPermissions();

    // Listen for app resume to re-check permissions
    const resumeListener = App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        checkPermissions();
      }
    });

    return () => {
      resumeListener.then(l => l.remove());
    };
  }, [checkPermissions, onAllPermissionsGranted]);

  const handleOverlayPermission = async () => {
    if (!EnergyXOverlay) {
      // Fallback for non-native (testing)
      setCurrentStep("write_settings");
      return;
    }

    try {
      // This will open Android settings for overlay permission
      await EnergyXOverlay.requestOverlayPermission();
    } catch (error) {
      console.error("Error requesting overlay permission:", error);
    }
  };

  const handleWriteSettingsPermission = async () => {
    if (!EnergyXOverlay) {
      // Fallback for non-native (testing)
      handleComplete();
      return;
    }

    try {
      // This will open Android settings for write settings permission
      await EnergyXOverlay.requestWriteSettingsPermission();
    } catch (error) {
      console.error("Error requesting write settings permission:", error);
    }
  };

  const handleComplete = async () => {
    localStorage.setItem("specialPermissionsGranted", "true");
    setCurrentStep("done");
    
    // Start the overlay service
    if (EnergyXOverlay) {
      try {
        await EnergyXOverlay.startOverlayService();
      } catch (error) {
        console.error("Error starting overlay service:", error);
      }
    }

    setTimeout(() => {
      setIsVisible(false);
      onAllPermissionsGranted();
    }, 1500);
  };

  const handleStart = () => {
    setCurrentStep("overlay");
  };

  const handleSkip = () => {
    localStorage.setItem("specialPermissionsGranted", "skipped");
    setIsVisible(false);
    onAllPermissionsGranted();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-2xl border border-orange-500/30"
          >
            {/* Intro Step */}
            {currentStep === "intro" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  Special Permissions
                </h2>
                <p className="text-gray-400 text-center text-sm mb-6">
                  To show the boost overlay in games, we need some special permissions
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700">
                    <Layers className="w-6 h-6 text-orange-500" />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Display over apps</p>
                      <p className="text-gray-500 text-xs">Show overlay in games</p>
                    </div>
                    {overlayGranted && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                  
                  <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700">
                    <Settings className="w-6 h-6 text-orange-500" />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Modify settings</p>
                      <p className="text-gray-500 text-xs">Adjust brightness & volume</p>
                    </div>
                    {writeSettingsGranted && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleSkip}
                  className="w-full mt-3 py-2 text-gray-500 text-sm hover:text-gray-300 transition-colors"
                >
                  Skip for now
                </button>
              </motion.div>
            )}

            {/* Overlay Permission Step */}
            {currentStep === "overlay" && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="flex justify-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <div className="w-3 h-3 rounded-full bg-gray-600" />
                </div>
                
                <h2 className="text-xl font-bold text-white text-center mb-2">
                  Display Over Apps
                </h2>
                <p className="text-gray-400 text-center text-sm mb-6">
                  Tap the button below and enable "Allow display over other apps" for this app
                </p>

                {overlayGranted ? (
                  <div className="flex flex-col items-center gap-3">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                    <p className="text-green-400 font-medium">Permission Granted!</p>
                    <button
                      onClick={() => setCurrentStep("write_settings")}
                      className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl"
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleOverlayPermission}
                      disabled={isChecking}
                      className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50"
                    >
                      {isChecking ? "Checking..." : "Open Settings"}
                    </button>
                    
                    <p className="text-gray-500 text-xs text-center mt-4">
                      After enabling, return to this app
                    </p>
                  </>
                )}
              </motion.div>
            )}

            {/* Write Settings Permission Step */}
            {currentStep === "write_settings" && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="flex justify-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                </div>
                
                <h2 className="text-xl font-bold text-white text-center mb-2">
                  Modify Settings
                </h2>
                <p className="text-gray-400 text-center text-sm mb-6">
                  Tap the button below and enable "Allow modifying system settings" for this app
                </p>

                {writeSettingsGranted ? (
                  <div className="flex flex-col items-center gap-3">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                    <p className="text-green-400 font-medium">Permission Granted!</p>
                    <button
                      onClick={handleComplete}
                      className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl"
                    >
                      Complete Setup
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleWriteSettingsPermission}
                      disabled={isChecking}
                      className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50"
                    >
                      {isChecking ? "Checking..." : "Open Settings"}
                    </button>
                    
                    <p className="text-gray-500 text-xs text-center mt-4">
                      After enabling, return to this app
                    </p>
                  </>
                )}
              </motion.div>
            )}

            {/* Done Step */}
            {currentStep === "done" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  All Set!
                </h2>
                <p className="text-gray-400 text-sm">
                  Energy-X overlay is now active
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

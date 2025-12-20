import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { motion, AnimatePresence } from "framer-motion";

interface PermissionDialogProps {
  onAllPermissionsGranted: () => void;
}

type PermissionStep = "overlay" | "write_settings" | "done";

export const PermissionDialog = ({ onAllPermissionsGranted }: PermissionDialogProps) => {
  const [currentStep, setCurrentStep] = useState<PermissionStep>("overlay");
  const [isVisible, setIsVisible] = useState(true);

  // Check if permissions were already granted (stored in localStorage)
  useEffect(() => {
    const permissionsGranted = localStorage.getItem("specialPermissionsGranted");
    if (permissionsGranted === "true" || !Capacitor.isNativePlatform()) {
      setIsVisible(false);
      onAllPermissionsGranted();
    }
  }, [onAllPermissionsGranted]);

  const handleOverlayPermission = async () => {
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android") {
      try {
        // Open Android settings for overlay permission
        // ACTION_MANAGE_OVERLAY_PERMISSION
        window.open("intent://#Intent;action=android.settings.action.MANAGE_OVERLAY_PERMISSION;end", "_system");
      } catch (error) {
        console.error("Error opening overlay settings:", error);
      }
    }
    // Move to next step after a delay (user returns from settings)
    setTimeout(() => {
      setCurrentStep("write_settings");
    }, 500);
  };

  const handleWriteSettingsPermission = async () => {
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android") {
      try {
        // Open Android settings for write settings permission
        // ACTION_MANAGE_WRITE_SETTINGS
        window.open("intent://#Intent;action=android.settings.action.MANAGE_WRITE_SETTINGS;end", "_system");
      } catch (error) {
        console.error("Error opening write settings:", error);
      }
    }
    // Mark as complete
    setTimeout(() => {
      localStorage.setItem("specialPermissionsGranted", "true");
      setCurrentStep("done");
      setIsVisible(false);
      onAllPermissionsGranted();
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm bg-[#1a1a2e] rounded-2xl p-6 shadow-2xl border border-orange-500/20"
          >
            {currentStep === "overlay" && (
              <>
                <h2 className="text-xl font-bold text-orange-500 text-center mb-3">
                  Permission Needed!
                </h2>
                <p className="text-gray-400 text-center text-sm mb-6">
                  Please allow "Floating other apps" Permission
                </p>
                <button
                  onClick={handleOverlayPermission}
                  className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all shadow-lg shadow-orange-500/30"
                >
                  Allow Floating other apps
                </button>
              </>
            )}

            {currentStep === "write_settings" && (
              <>
                <h2 className="text-xl font-bold text-orange-500 text-center mb-3">
                  Permission Needed!
                </h2>
                <p className="text-gray-400 text-center text-sm mb-6">
                  Please allow "Write Settings" Permission
                </p>
                <button
                  onClick={handleWriteSettingsPermission}
                  className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all shadow-lg shadow-orange-500/30"
                >
                  Allow Write Settings
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
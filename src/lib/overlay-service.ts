/**
 * Native Android Overlay Service for Energy-X
 * 
 * This service handles showing overlay notifications on top of games
 * when they are launched on the device.
 * 
 * Requirements:
 * - SYSTEM_ALERT_WINDOW permission
 * - UsageStats permission (already implemented)
 */

import { Capacitor } from "@capacitor/core";

export interface OverlayConfig {
  duration: number; // Duration in milliseconds
  message: string;
  appName: string;
}

class OverlayService {
  private isPermissionGranted = false;

  /**
   * Check if overlay permission is granted
   */
  async checkOverlayPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      console.log("Overlay permission check: Not on native platform");
      return false;
    }

    try {
      // This will be handled by native code
      const result = await this.callNativeMethod("checkOverlayPermission");
      this.isPermissionGranted = result?.granted ?? false;
      return this.isPermissionGranted;
    } catch (error) {
      console.error("Error checking overlay permission:", error);
      return false;
    }
  }

  /**
   * Request overlay permission from user
   */
  async requestOverlayPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      console.log("Overlay permission request: Not on native platform");
      return false;
    }

    try {
      const result = await this.callNativeMethod("requestOverlayPermission");
      this.isPermissionGranted = result?.granted ?? false;
      return this.isPermissionGranted;
    } catch (error) {
      console.error("Error requesting overlay permission:", error);
      return false;
    }
  }

  /**
   * Start the overlay service to monitor game launches
   */
  async startOverlayService(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      console.log("Start overlay service: Not on native platform");
      return false;
    }

    if (!this.isPermissionGranted) {
      const granted = await this.checkOverlayPermission();
      if (!granted) {
        console.log("Overlay permission not granted");
        return false;
      }
    }

    try {
      await this.callNativeMethod("startOverlayService");
      return true;
    } catch (error) {
      console.error("Error starting overlay service:", error);
      return false;
    }
  }

  /**
   * Stop the overlay service
   */
  async stopOverlayService(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await this.callNativeMethod("stopOverlayService");
    } catch (error) {
      console.error("Error stopping overlay service:", error);
    }
  }

  /**
   * Set the list of games to monitor
   */
  async setMonitoredGames(packageNames: string[]): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await this.callNativeMethod("setMonitoredGames", { packages: packageNames });
    } catch (error) {
      console.error("Error setting monitored games:", error);
    }
  }

  /**
   * Configure the overlay appearance
   */
  async configureOverlay(config: OverlayConfig): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await this.callNativeMethod("configureOverlay", config);
    } catch (error) {
      console.error("Error configuring overlay:", error);
    }
  }

  /**
   * Call native method through Capacitor bridge
   */
  private async callNativeMethod(method: string, args?: any): Promise<any> {
    // This connects to the native Android plugin
    const { registerPlugin } = await import("@capacitor/core");
    
    const EnergyXOverlay = registerPlugin<any>("EnergyXOverlay");
    
    if (!EnergyXOverlay || !EnergyXOverlay[method]) {
      console.warn("EnergyXOverlay plugin or method not available:", method);
      return null;
    }

    return EnergyXOverlay[method](args);
  }
}

export const overlayService = new OverlayService();

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1a0ab7cd044f46268f98d5d2f780a1cd',
  appName: 'starship-booster-buddy',
  webDir: 'dist',
  server: {
    url: 'https://1a0ab7cd-044f-4626-8f98-d5d2f780a1cd.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0a0a0a",
      showSpinner: false
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#0a0a0a"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon",
      iconColor: "#10B981"
    }
  }
};

export default config;

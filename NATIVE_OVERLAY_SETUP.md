# Energy-X Native Overlay Setup Guide

This guide explains how to set up the native Android overlay feature that shows the Energy-X notification on top of any launched game.

## Prerequisites

1. Export project to GitHub
2. Clone the repository locally
3. Have Android Studio installed

## Setup Steps

### 1. Add Required Permissions to AndroidManifest.xml

After running `npx cap sync android`, open `android/app/src/main/AndroidManifest.xml` and add these permissions:

```xml
<!-- Inside <manifest> tag, before <application> -->
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" tools:ignore="ProtectedPermissions" />

<!-- Add tools namespace to manifest tag -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    ...>
```

### 2. Register the Service and Plugin in AndroidManifest.xml

Add inside the `<application>` tag:

```xml
<!-- Energy-X Overlay Service -->
<service
    android:name="app.lovable.energyx.EnergyXOverlayService"
    android:enabled="true"
    android:exported="false"
    android:foregroundServiceType="specialUse" />
```

### 3. Register the Plugin in MainActivity

Open `android/app/src/main/java/.../MainActivity.java` and add:

```java
import app.lovable.energyx.EnergyXOverlayPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register the plugin
        registerPlugin(EnergyXOverlayPlugin.class);
    }
}
```

### 4. Copy Native Files

Copy these files from the project to your android folder:
- `android/app/src/main/java/app/lovable/energyx/EnergyXOverlayPlugin.java`
- `android/app/src/main/java/app/lovable/energyx/EnergyXOverlayService.java`
- `android/app/src/main/res/layout/energy_x_overlay.xml`
- `android/app/src/main/res/drawable/overlay_background.xml`
- `android/app/src/main/res/drawable/energy_x_icon_bg.xml`

### 5. Build and Run

```bash
npm run build
npx cap sync android
npx cap run android
```

## How It Works

1. **Permission Request**: When enabled, the app requests SYSTEM_ALERT_WINDOW permission
2. **Background Service**: A foreground service monitors which app is in the foreground
3. **Game Detection**: When a monitored game is launched, the overlay appears
4. **Overlay Display**: The Energy-X notification shows for 2 seconds then fades out
5. **Auto-dismiss**: The overlay automatically disappears without user interaction

## Usage in App

```typescript
import { overlayService } from '@/lib/overlay-service';

// Check permission
const hasPermission = await overlayService.checkOverlayPermission();

// Request permission
if (!hasPermission) {
  await overlayService.requestOverlayPermission();
}

// Set games to monitor
await overlayService.setMonitoredGames([
  'com.tencent.ig',           // PUBG Mobile
  'com.dts.freefireth',       // Free Fire
  'com.mobile.legends',       // Mobile Legends
]);

// Start the overlay service
await overlayService.startOverlayService();

// Stop when not needed
await overlayService.stopOverlayService();
```

## Customization

You can customize the overlay appearance by modifying:
- `energy_x_overlay.xml` - Layout structure
- `overlay_background.xml` - Background style
- `energy_x_icon_bg.xml` - Icon background

## Troubleshooting

### Overlay not showing
1. Make sure SYSTEM_ALERT_WINDOW permission is granted
2. Check that UsageStats permission is also granted
3. Verify the game package name is in the monitored list

### Service stops unexpectedly
- Some devices have aggressive battery optimization
- Add the app to battery optimization whitelist

### Permission dialog not appearing
- On some devices, you need to manually go to Settings > Apps > [App Name] > Display over other apps

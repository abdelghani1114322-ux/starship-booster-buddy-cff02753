package app.lovable.energyx;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "EnergyXOverlay")
public class EnergyXOverlayPlugin extends Plugin {

    private static final int OVERLAY_PERMISSION_REQUEST_CODE = 1234;
    private static final int WRITE_SETTINGS_REQUEST_CODE = 1235;

    @PluginMethod
    public void checkOverlayPermission(PluginCall call) {
        boolean granted = hasOverlayPermission();
        JSObject result = new JSObject();
        result.put("granted", granted);
        call.resolve(result);
    }

    @PluginMethod
    public void checkWriteSettingsPermission(PluginCall call) {
        boolean granted = hasWriteSettingsPermission();
        JSObject result = new JSObject();
        result.put("granted", granted);
        call.resolve(result);
    }

    @PluginMethod
    public void requestOverlayPermission(PluginCall call) {
        if (hasOverlayPermission()) {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
            return;
        }

        // Open settings to grant overlay permission
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + getContext().getPackageName())
            );
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            
            // Resolve immediately - we'll check permission when user returns
            JSObject result = new JSObject();
            result.put("granted", false);
            result.put("opened", true);
            call.resolve(result);
        } else {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
        }
    }

    @PluginMethod
    public void requestWriteSettingsPermission(PluginCall call) {
        if (hasWriteSettingsPermission()) {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
            return;
        }

        // Open settings to grant write settings permission
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent(
                Settings.ACTION_MANAGE_WRITE_SETTINGS,
                Uri.parse("package:" + getContext().getPackageName())
            );
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            
            // Resolve immediately - we'll check permission when user returns
            JSObject result = new JSObject();
            result.put("granted", false);
            result.put("opened", true);
            call.resolve(result);
        } else {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
        }
    }

    @PluginMethod
    public void startOverlayService(PluginCall call) {
        if (!hasOverlayPermission()) {
            call.reject("Overlay permission not granted");
            return;
        }
        
        Context context = getContext();
        Intent serviceIntent = new Intent(context, EnergyXOverlayService.class);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(serviceIntent);
        } else {
            context.startService(serviceIntent);
        }
        
        call.resolve();
    }

    @PluginMethod
    public void stopOverlayService(PluginCall call) {
        Context context = getContext();
        Intent serviceIntent = new Intent(context, EnergyXOverlayService.class);
        context.stopService(serviceIntent);
        call.resolve();
    }

    @PluginMethod
    public void setMonitoredGames(PluginCall call) {
        JSArray packagesArray = call.getArray("packages");
        if (packagesArray == null) {
            call.reject("No packages provided");
            return;
        }

        try {
            List<String> packages = new ArrayList<>();
            for (int i = 0; i < packagesArray.length(); i++) {
                packages.add(packagesArray.getString(i));
            }
            
            // Store in shared preferences for the service to use
            EnergyXOverlayService.setMonitoredPackages(getContext(), packages);
            call.resolve();
        } catch (Exception e) {
            call.reject("Error setting monitored games", e);
        }
    }

    @PluginMethod
    public void configureOverlay(PluginCall call) {
        int duration = call.getInt("duration", 2000);
        String message = call.getString("message", "Game Boosted");
        String appName = call.getString("appName", "");

        EnergyXOverlayService.setOverlayConfig(getContext(), duration, message, appName);
        call.resolve();
    }

    private boolean hasOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.canDrawOverlays(getContext());
        }
        return true;
    }

    private boolean hasWriteSettingsPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.System.canWrite(getContext());
        }
        return true;
    }
}

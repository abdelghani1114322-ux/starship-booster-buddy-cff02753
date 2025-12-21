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

    @PluginMethod
    public void checkOverlayPermission(PluginCall call) {
        boolean granted = hasOverlayPermission();
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
            startActivityForResult(call, intent, OVERLAY_PERMISSION_REQUEST_CODE);
        } else {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
        }
    }

    @PluginMethod
    public void startOverlayService(PluginCall call) {
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

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);
        
        if (requestCode == OVERLAY_PERMISSION_REQUEST_CODE) {
            PluginCall savedCall = getSavedCall();
            if (savedCall != null) {
                JSObject result = new JSObject();
                result.put("granted", hasOverlayPermission());
                savedCall.resolve(result);
            }
        }
    }
}

package app.lovable.energyx;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Base64;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.util.List;

@CapacitorPlugin(name = "InstalledApps")
public class InstalledAppsPlugin extends Plugin {

    @PluginMethod
    public void getInstalledApps(PluginCall call) {
        boolean includeSystemApps = call.getBoolean("includeSystemApps", false);
        boolean includeIcons = call.getBoolean("includeIcons", true);
        int iconSize = call.getInt("iconSize", 96);
        
        Context context = getContext();
        PackageManager pm = context.getPackageManager();
        
        // Get all launchable apps
        Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);
        mainIntent.addCategory(Intent.CATEGORY_LAUNCHER);
        
        List<ResolveInfo> apps = pm.queryIntentActivities(mainIntent, 0);
        
        JSArray appsArray = new JSArray();
        
        for (ResolveInfo app : apps) {
            try {
                ApplicationInfo appInfo = pm.getApplicationInfo(app.activityInfo.packageName, 0);
                
                // Skip system apps if not requested
                if (!includeSystemApps && (appInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0) {
                    continue;
                }
                
                JSObject appObject = new JSObject();
                appObject.put("packageName", app.activityInfo.packageName);
                appObject.put("appName", pm.getApplicationLabel(appInfo).toString());
                appObject.put("isSystemApp", (appInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0);
                
                // Get app icon as base64
                if (includeIcons) {
                    try {
                        Drawable icon = pm.getApplicationIcon(appInfo);
                        String iconBase64 = drawableToBase64(icon, iconSize);
                        if (iconBase64 != null) {
                            appObject.put("icon", iconBase64);
                        }
                    } catch (Exception e) {
                        // Icon not available
                    }
                }
                
                appsArray.put(appObject);
            } catch (PackageManager.NameNotFoundException e) {
                // Skip apps that can't be found
            }
        }
        
        JSObject result = new JSObject();
        result.put("apps", appsArray);
        result.put("count", appsArray.length());
        call.resolve(result);
    }

    @PluginMethod
    public void launchApp(PluginCall call) {
        String packageName = call.getString("packageName");
        
        if (packageName == null || packageName.isEmpty()) {
            call.reject("Package name is required");
            return;
        }
        
        Context context = getContext();
        PackageManager pm = context.getPackageManager();
        
        try {
            Intent launchIntent = pm.getLaunchIntentForPackage(packageName);
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(launchIntent);
                
                JSObject result = new JSObject();
                result.put("success", true);
                result.put("packageName", packageName);
                call.resolve(result);
            } else {
                call.reject("App not found or cannot be launched");
            }
        } catch (Exception e) {
            call.reject("Error launching app: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getAppIcon(PluginCall call) {
        String packageName = call.getString("packageName");
        int iconSize = call.getInt("iconSize", 96);
        
        if (packageName == null || packageName.isEmpty()) {
            call.reject("Package name is required");
            return;
        }
        
        Context context = getContext();
        PackageManager pm = context.getPackageManager();
        
        try {
            ApplicationInfo appInfo = pm.getApplicationInfo(packageName, 0);
            Drawable icon = pm.getApplicationIcon(appInfo);
            String iconBase64 = drawableToBase64(icon, iconSize);
            
            if (iconBase64 != null) {
                JSObject result = new JSObject();
                result.put("icon", iconBase64);
                result.put("packageName", packageName);
                call.resolve(result);
            } else {
                call.reject("Could not get app icon");
            }
        } catch (PackageManager.NameNotFoundException e) {
            call.reject("App not found");
        }
    }

    private String drawableToBase64(Drawable drawable, int size) {
        try {
            Bitmap bitmap;
            
            if (drawable instanceof BitmapDrawable) {
                bitmap = ((BitmapDrawable) drawable).getBitmap();
            } else {
                bitmap = Bitmap.createBitmap(
                    drawable.getIntrinsicWidth() > 0 ? drawable.getIntrinsicWidth() : size,
                    drawable.getIntrinsicHeight() > 0 ? drawable.getIntrinsicHeight() : size,
                    Bitmap.Config.ARGB_8888
                );
                Canvas canvas = new Canvas(bitmap);
                drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
                drawable.draw(canvas);
            }
            
            // Scale bitmap to desired size
            if (bitmap.getWidth() != size || bitmap.getHeight() != size) {
                bitmap = Bitmap.createScaledBitmap(bitmap, size, size, true);
            }
            
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.PNG, 90, byteArrayOutputStream);
            byte[] byteArray = byteArrayOutputStream.toByteArray();
            
            return Base64.encodeToString(byteArray, Base64.NO_WRAP);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

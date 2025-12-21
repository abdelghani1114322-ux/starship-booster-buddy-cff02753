package app.lovable.energyx;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.app.usage.UsageEvents;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class EnergyXOverlayService extends Service {

    private static final String CHANNEL_ID = "energy_x_overlay";
    private static final String PREFS_NAME = "energy_x_prefs";
    private static final String KEY_PACKAGES = "monitored_packages";
    private static final String KEY_DURATION = "overlay_duration";
    private static final String KEY_MESSAGE = "overlay_message";
    private static final int NOTIFICATION_ID = 1001;

    private WindowManager windowManager;
    private View overlayView;
    private Handler handler;
    private Set<String> monitoredPackages;
    private String lastForegroundApp = "";
    private boolean isOverlayShowing = false;

    private Runnable checkForegroundAppRunnable = new Runnable() {
        @Override
        public void run() {
            checkForegroundApp();
            handler.postDelayed(this, 1000); // Check every second
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        handler = new Handler(Looper.getMainLooper());
        loadMonitoredPackages();
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startForeground(NOTIFICATION_ID, createNotification());
        handler.post(checkForegroundAppRunnable);
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        handler.removeCallbacks(checkForegroundAppRunnable);
        removeOverlay();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void checkForegroundApp() {
        UsageStatsManager usageStatsManager = (UsageStatsManager) getSystemService(Context.USAGE_STATS_SERVICE);
        if (usageStatsManager == null) return;

        long currentTime = System.currentTimeMillis();
        UsageEvents usageEvents = usageStatsManager.queryEvents(currentTime - 5000, currentTime);
        
        String foregroundApp = "";
        UsageEvents.Event event = new UsageEvents.Event();
        
        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event);
            if (event.getEventType() == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                foregroundApp = event.getPackageName();
            }
        }

        if (!foregroundApp.isEmpty() && !foregroundApp.equals(lastForegroundApp)) {
            lastForegroundApp = foregroundApp;
            
            if (monitoredPackages.contains(foregroundApp) && !isOverlayShowing) {
                showOverlay(foregroundApp);
            }
        }
    }

    private void showOverlay(String packageName) {
        if (isOverlayShowing) return;
        isOverlayShowing = true;

        handler.post(() -> {
            try {
                // Inflate overlay layout
                LayoutInflater inflater = LayoutInflater.from(this);
                overlayView = inflater.inflate(R.layout.energy_x_overlay, null);

                // Set app name
                TextView appNameText = overlayView.findViewById(R.id.appNameText);
                String appName = getAppName(packageName);
                appNameText.setText(appName + " Boosted");

                // Window params
                int layoutFlag;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    layoutFlag = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
                } else {
                    layoutFlag = WindowManager.LayoutParams.TYPE_PHONE;
                }

                WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    layoutFlag,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                    WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE |
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                    PixelFormat.TRANSLUCENT
                );
                params.gravity = Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL;
                params.y = 100; // Margin from bottom

                windowManager.addView(overlayView, params);

                // Fade in animation
                AlphaAnimation fadeIn = new AlphaAnimation(0f, 1f);
                fadeIn.setDuration(300);
                overlayView.startAnimation(fadeIn);

                // Get duration from prefs
                SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
                int duration = prefs.getInt(KEY_DURATION, 2000);

                // Remove after duration
                handler.postDelayed(() -> {
                    removeOverlay();
                }, duration);

            } catch (Exception e) {
                e.printStackTrace();
                isOverlayShowing = false;
            }
        });
    }

    private void removeOverlay() {
        if (overlayView != null) {
            // Fade out animation
            AlphaAnimation fadeOut = new AlphaAnimation(1f, 0f);
            fadeOut.setDuration(300);
            fadeOut.setAnimationListener(new Animation.AnimationListener() {
                @Override
                public void onAnimationStart(Animation animation) {}

                @Override
                public void onAnimationEnd(Animation animation) {
                    try {
                        windowManager.removeView(overlayView);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    overlayView = null;
                    isOverlayShowing = false;
                }

                @Override
                public void onAnimationRepeat(Animation animation) {}
            });
            overlayView.startAnimation(fadeOut);
        }
    }

    private String getAppName(String packageName) {
        try {
            return getPackageManager()
                .getApplicationLabel(getPackageManager().getApplicationInfo(packageName, 0))
                .toString();
        } catch (Exception e) {
            // Extract name from package
            String[] parts = packageName.split("\\.");
            String name = parts[parts.length - 1];
            return name.substring(0, 1).toUpperCase() + name.substring(1);
        }
    }

    private void loadMonitoredPackages() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        monitoredPackages = prefs.getStringSet(KEY_PACKAGES, new HashSet<>());
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Energy-X Overlay",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Shows Energy-X overlay when games are launched");
            
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    private Notification createNotification() {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Energy-X Active")
            .setContentText("Monitoring game launches")
            .setSmallIcon(android.R.drawable.ic_menu_manage)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build();
    }

    // Static methods to set configuration
    public static void setMonitoredPackages(Context context, List<String> packages) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        prefs.edit().putStringSet(KEY_PACKAGES, new HashSet<>(packages)).apply();
    }

    public static void setOverlayConfig(Context context, int duration, String message, String appName) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        prefs.edit()
            .putInt(KEY_DURATION, duration)
            .putString(KEY_MESSAGE, message)
            .apply();
    }
}

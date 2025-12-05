import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Filesystem } from '@capacitor/filesystem';

export interface PermissionStatus {
  camera: boolean;
  photos: boolean;
  location: boolean;
  notifications: boolean;
  filesystem: boolean;
  motion: boolean;
  overlayPermission: boolean;
  systemSettings: boolean;
}

export async function requestAllPermissions(): Promise<PermissionStatus> {
  const status: PermissionStatus = {
    camera: false,
    photos: false,
    location: false,
    notifications: false,
    filesystem: false,
    motion: false,
    overlayPermission: false,
    systemSettings: false
  };

  try {
    // Camera permission
    const cameraStatus = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
    status.camera = cameraStatus.camera === 'granted';
    status.photos = cameraStatus.photos === 'granted';
  } catch (e) {
    console.log('Camera permission not available:', e);
  }

  try {
    // Location permission
    const locationStatus = await Geolocation.requestPermissions();
    status.location = locationStatus.location === 'granted';
  } catch (e) {
    console.log('Location permission not available:', e);
  }

  try {
    // Push notifications permission
    const notifStatus = await PushNotifications.requestPermissions();
    status.notifications = notifStatus.receive === 'granted';
  } catch (e) {
    console.log('Push notifications not available:', e);
  }

  try {
    // Local notifications permission
    await LocalNotifications.requestPermissions();
  } catch (e) {
    console.log('Local notifications not available:', e);
  }

  try {
    // Filesystem permission
    const fsStatus = await Filesystem.requestPermissions();
    status.filesystem = fsStatus.publicStorage === 'granted';
  } catch (e) {
    console.log('Filesystem permission not available:', e);
  }

  try {
    // Motion - just mark as available (permission handled by OS on use)
    status.motion = true;
  } catch (e) {
    console.log('Motion not available:', e);
  }

  return status;
}

export async function checkAllPermissions(): Promise<PermissionStatus> {
  const status: PermissionStatus = {
    camera: false,
    photos: false,
    location: false,
    notifications: false,
    filesystem: false,
    motion: false,
    overlayPermission: false,
    systemSettings: false
  };

  try {
    const cameraStatus = await Camera.checkPermissions();
    status.camera = cameraStatus.camera === 'granted';
    status.photos = cameraStatus.photos === 'granted';
  } catch (e) {
    console.log('Camera check not available');
  }

  try {
    const locationStatus = await Geolocation.checkPermissions();
    status.location = locationStatus.location === 'granted';
  } catch (e) {
    console.log('Location check not available');
  }

  try {
    const notifStatus = await PushNotifications.checkPermissions();
    status.notifications = notifStatus.receive === 'granted';
  } catch (e) {
    console.log('Notifications check not available');
  }

  try {
    const fsStatus = await Filesystem.checkPermissions();
    status.filesystem = fsStatus.publicStorage === 'granted';
  } catch (e) {
    console.log('Filesystem check not available');
  }

  return status;
}

// Note: These special Android permissions require native implementation
// Add to AndroidManifest.xml:
// <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
// <uses-permission android:name="android.permission.WRITE_SETTINGS" />
export function getSpecialPermissionsInfo() {
  return {
    overlayPermission: {
      name: 'Display over other apps',
      androidPermission: 'android.permission.SYSTEM_ALERT_WINDOW',
      description: 'Allows floating windows over other apps',
      requiresManualGrant: true
    },
    systemSettings: {
      name: 'Modify system settings',
      androidPermission: 'android.permission.WRITE_SETTINGS',
      description: 'Allows modifying brightness, volume, etc.',
      requiresManualGrant: true
    }
  };
}

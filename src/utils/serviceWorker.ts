
// Service worker registration and management utility

/**
 * Register the service worker
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/chat-worker.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered successfully:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  
  console.warn('Service Workers are not supported in this browser');
  return null;
};

/**
 * Request permission for push notifications
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Register for background sync
 */
export const registerBackgroundSync = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.warn('Background Sync is not supported in this browser');
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-messages');
    console.log('Background sync registered successfully');
    return true;
  } catch (error) {
    console.error('Background sync registration failed:', error);
    return false;
  }
};

/**
 * Listen for service worker messages
 */
export const listenForServiceWorkerMessages = (
  callback: (event: MessageEvent) => void
): (() => void) => {
  if (!('serviceWorker' in navigator)) {
    return () => {}; // No-op cleanup function
  }
  
  const messageHandler = (event: MessageEvent) => {
    callback(event);
  };
  
  navigator.serviceWorker.addEventListener('message', messageHandler);
  
  // Return cleanup function
  return () => {
    navigator.serviceWorker.removeEventListener('message', messageHandler);
  };
};

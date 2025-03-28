
/**
 * ServiceWorker sync API polyfill
 * 
 * This provides a basic fallback for browsers that don't support
 * the Background Sync API.
 */

// Add the sync property to ServiceWorkerRegistration interface
declare global {
  interface ServiceWorkerRegistration {
    sync: {
      register: (tag: string) => Promise<void>;
      getTags: () => Promise<string[]>;
    };
  }
}

/**
 * Polyfill the sync API for service worker
 */
export function polyfillServiceWorkerSync(): void {
  if ('serviceWorker' in navigator) {
    // Check if we need to polyfill
    if (navigator.serviceWorker.controller && 
        !('sync' in ServiceWorkerRegistration.prototype)) {
      
      // Add our own implementation
      Object.defineProperty(ServiceWorkerRegistration.prototype, 'sync', {
        get: function() {
          // Pending tasks we'd like to sync
          const pendingTasks: Set<string> = new Set();
          
          return {
            // Register a sync task
            register: async (tag: string): Promise<void> => {
              pendingTasks.add(tag);
              
              // Log that we're using the polyfill
              console.log(`[Sync Polyfill] Registered sync task: ${tag}`);
              
              // Try to perform the sync immediately as a fallback
              try {
                await this.active?.postMessage({
                  type: 'sync',
                  tag
                });
              } catch (err) {
                console.error(`[Sync Polyfill] Error posting message to SW:`, err);
              }
              
              return Promise.resolve();
            },
            
            // Get all registered sync tags
            getTags: async (): Promise<string[]> => {
              return Array.from(pendingTasks);
            }
          };
        }
      });
      
      console.log('[Sync Polyfill] Background Sync API polyfilled');
    }
  }
}

// Apply the polyfill automatically
polyfillServiceWorkerSync();

export default polyfillServiceWorkerSync;

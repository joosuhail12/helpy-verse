
/**
 * Asset types that can be preloaded
 */
type AssetType = 'image' | 'script' | 'style' | 'font';

/**
 * Asset configuration for preloading
 */
interface AssetConfig {
  url: string;
  type: AssetType;
  priority?: 'high' | 'low' | 'auto';
  crossOrigin?: 'anonymous' | 'use-credentials';
}

/**
 * Preload a single asset
 */
export const preloadAsset = (config: AssetConfig): Promise<Event> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    
    link.rel = 'preload';
    link.href = config.url;
    link.as = config.type;
    
    if (config.priority) {
      link.setAttribute('fetchpriority', config.priority);
    }
    
    if (config.crossOrigin) {
      link.crossOrigin = config.crossOrigin;
    }
    
    link.onload = (event) => resolve(event);
    link.onerror = (error) => reject(error);
    
    document.head.appendChild(link);
  });
};

/**
 * Preload multiple assets
 */
export const preloadAssets = (configs: AssetConfig[]): Promise<Event[]> => {
  return Promise.all(configs.map(config => preloadAsset(config)));
};

/**
 * Prioritize loading critical CSS
 */
export const loadCriticalCSS = (url: string): Promise<Event> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    
    link.rel = 'stylesheet';
    link.href = url;
    link.setAttribute('fetchpriority', 'high');
    
    link.onload = (event) => resolve(event);
    link.onerror = (error) => reject(error);
    
    document.head.appendChild(link);
  });
};

/**
 * Lazy load images when they come into viewport
 */
export const setupLazyLoading = (): void => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target as HTMLImageElement;
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove('lazy-load');
            imageObserver.unobserve(lazyImage);
          }
        }
      });
    });
    
    const lazyImages = document.querySelectorAll('img.lazy-load');
    lazyImages.forEach(image => {
      imageObserver.observe(image);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    const lazyImages = document.querySelectorAll('img.lazy-load');
    lazyImages.forEach(image => {
      const img = image as HTMLImageElement;
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }
};

/**
 * Default list of chat widget assets to preload
 */
export const chatWidgetCriticalAssets: AssetConfig[] = [
  { url: '/chat-widget.css', type: 'style', priority: 'high' },
  { url: '/chat-widget-standalone.js', type: 'script', priority: 'high' },
  { url: '/favicon.ico', type: 'image', priority: 'low' }
];

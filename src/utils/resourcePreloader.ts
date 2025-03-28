
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
 * Image loading configuration
 */
export interface ImageLoadConfig {
  src: string;
  placeholderSrc?: string;
  width?: number;
  height?: number;
  alt?: string;
  lazy?: boolean;
  blurhash?: string;
  priority?: boolean;
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
 * Generate a tiny placeholder for progressive loading
 */
export const generatePlaceholder = (width: number, height: number, color = '#f3f4f6'): string => {
  // Create a tiny SVG placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="${color}" />
    </svg>
  `;
  // Encode the SVG as a data URL
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
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
            // Create a new image to preload
            const img = new Image();
            img.onload = () => {
              lazyImage.src = lazyImage.dataset.src!;
              lazyImage.classList.remove('lazy-load');
              lazyImage.classList.add('loaded');
            };
            img.src = lazyImage.dataset.src!;
            imageObserver.unobserve(lazyImage);
          }
        }
      });
    }, {
      rootMargin: '200px 0px', // Start loading 200px before they come into view
      threshold: 0.01
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
        img.classList.remove('lazy-load');
        img.classList.add('loaded');
      }
    });
  }
};

/**
 * Preload critical images
 */
export const preloadCriticalImages = (imageUrls: string[]): void => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Default list of chat widget assets to preload
 */
export const chatWidgetCriticalAssets: AssetConfig[] = [
  { url: '/chat-widget.css', type: 'style', priority: 'high' },
  { url: '/chat-widget-standalone.js', type: 'script', priority: 'high' },
  { url: '/favicon.ico', type: 'image', priority: 'low' }
];


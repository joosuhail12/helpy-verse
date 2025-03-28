
import React, { useState, useEffect } from 'react';
import { generatePlaceholder } from '@/utils/resourcePreloader';
import { cn } from '@/utils/helpers/cn';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholderSrc?: string;
  priority?: boolean;
  blurhash?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = '',
  width = 300,
  height = 200,
  placeholderSrc,
  priority = false,
  blurhash,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(
    placeholderSrc || generatePlaceholder(width, height)
  );

  useEffect(() => {
    // If priority is true, we don't lazy load, just load immediately
    if (priority) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
      };
      return;
    }

    // Setup IntersectionObserver for lazy loading
    if ('IntersectionObserver' in window) {
      const imgElement = document.getElementById(`progressive-img-${src.replace(/\W/g, '')}`);
      if (!imgElement) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                setCurrentSrc(src);
                setIsLoaded(true);
              };
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '200px 0px', threshold: 0.01 }
      );

      observer.observe(imgElement);
      return () => {
        if (imgElement) observer.unobserve(imgElement);
      };
    } else {
      // Fallback for browsers without IntersectionObserver
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
      };
    }
  }, [src, priority, placeholderSrc]);

  return (
    <div 
      className={cn(
        "overflow-hidden relative",
        className
      )} 
      style={{ width, height }}
    >
      <img
        id={`progressive-img-${src.replace(/\W/g, '')}`}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-500 object-cover w-full h-full",
          isLoaded ? "opacity-100" : "opacity-60"
        )}
        loading={priority ? "eager" : "lazy"}
        {...(priority ? { fetchpriority: "high" } : {})}
      />
      
      {/* Optional blur overlay that fades out when the image loads */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 backdrop-blur-sm bg-gray-200/30 animate-pulse"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
    </div>
  );
};


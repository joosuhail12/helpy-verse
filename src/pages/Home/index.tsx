
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { setupLazyLoading, preloadAssets, chatWidgetCriticalAssets } from '@/utils/resourcePreloader';

const Home = () => {
  useEffect(() => {
    // Set up lazy loading for images
    setupLazyLoading();
    
    // Preload critical assets
    preloadAssets(chatWidgetCriticalAssets).catch(err => {
      console.warn('Failed to preload some assets:', err);
    });
    
    // Preload common images that will likely be needed soon
    const commonImages = [
      'https://framerusercontent.com/images/9N8Z1vTRbJsHlrIuTjm6Ajga4dI.png', // Logo
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158' // Default avatar
    ];
    
    commonImages.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Outlet />
    </div>
  );
};

export default Home;

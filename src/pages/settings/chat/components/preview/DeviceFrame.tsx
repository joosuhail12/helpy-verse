
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DeviceType = 'iphone' | 'android' | 'tablet' | 'desktop';

interface DeviceFrameProps {
  children: ReactNode;
  deviceType: DeviceType;
  className?: string;
  orientation?: 'portrait' | 'landscape';
}

/**
 * A component that wraps content in realistic device frames
 */
const DeviceFrame: React.FC<DeviceFrameProps> = ({ 
  children, 
  deviceType = 'iphone',
  className,
  orientation = 'portrait'
}) => {
  const isLandscape = orientation === 'landscape';
  
  // Apply landscape specific styles
  const landscapeStyles = isLandscape ? {
    transform: 'rotate(-90deg)',
    width: deviceType === 'tablet' ? '600px' : '500px',
    height: deviceType === 'tablet' ? '400px' : '280px',
  } : {};
  
  return (
    <div className={cn("relative mx-auto", className)} style={landscapeStyles}>
      {deviceType === 'iphone' && (
        <div className="relative mx-auto bg-black rounded-[3rem] overflow-hidden shadow-xl border-[14px] border-black max-w-[320px]">
          {/* Notch */}
          <div className="absolute top-0 left-0 right-0 h-7 bg-black z-10 flex justify-center items-end pb-1">
            <div className="w-36 h-[1.1rem] bg-black rounded-b-2xl flex justify-center items-center">
              <div className="w-20 h-[0.25rem] bg-gray-800 rounded-full"></div>
            </div>
          </div>
          {/* Status Bar */}
          <div className="h-7"></div>
          {/* Content */}
          <div className="h-[calc(100%-7px)] w-full overflow-hidden bg-white">
            {children}
          </div>
          {/* Home Indicator */}
          <div className="h-6 bg-black flex justify-center items-center">
            <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      )}

      {deviceType === 'android' && (
        <div className="relative mx-auto bg-black rounded-[1.5rem] overflow-hidden shadow-xl border-[8px] border-black max-w-[320px]">
          {/* Status Bar */}
          <div className="h-5 bg-gray-900 flex justify-end items-center px-3 space-x-1">
            <div className="w-3 h-3 rounded-full bg-gray-700"></div>
            <div className="w-3 h-3 rounded-full bg-gray-700"></div>
            <div className="w-3 h-3 rounded-full bg-gray-700"></div>
          </div>
          {/* Content */}
          <div className="h-[calc(100%-10px)] w-full overflow-hidden bg-white">
            {children}
          </div>
          {/* Navigation Bar */}
          <div className="h-5 bg-gray-900 flex justify-center items-center space-x-8">
            <div className="w-5 h-1 bg-gray-600 rounded-full transform rotate-45"></div>
            <div className="w-4 h-4 rounded-full border-2 border-gray-600"></div>
            <div className="w-5 h-1 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      )}

      {deviceType === 'tablet' && (
        <div className="relative mx-auto bg-gray-800 rounded-[2rem] overflow-hidden shadow-xl border-[12px] border-gray-800 max-w-[500px]">
          {/* Content */}
          <div className="w-full overflow-hidden bg-white h-full">
            {children}
          </div>
        </div>
      )}

      {deviceType === 'desktop' && (
        <div className="relative w-full mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          {/* Browser Bar */}
          <div className="h-6 bg-gray-900 flex items-center px-2 space-x-1">
            <div className="flex space-x-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-4 flex-1 px-2 h-4 bg-gray-700 rounded-full"></div>
          </div>
          {/* Content */}
          <div className="w-full overflow-hidden bg-white">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceFrame;

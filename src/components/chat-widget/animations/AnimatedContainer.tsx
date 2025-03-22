
import React from 'react';
import { useTheme } from '../theme/ThemeContext';

interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: 'fadeIn' | 'slideIn' | 'scaleIn' | 'none';
  delay?: string;
  children: React.ReactNode;
}

/**
 * Animated container component with configurable animations
 */
const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ 
  animation = 'fadeIn', 
  delay = '0ms',
  className = '',
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const animationEnabled = theme.animation?.enabled ?? true;
  const duration = theme.animation?.duration ?? '300ms';
  
  if (!animationEnabled || animation === 'none') {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }
  
  const getAnimationClass = () => {
    switch (animation) {
      case 'fadeIn':
        return 'animate-fadeSlideIn';
      case 'slideIn':
        return 'animate-slideInRight';
      case 'scaleIn':
        return 'animate-scaleIn';
      default:
        return '';
    }
  };
  
  return (
    <div 
      className={`${className} ${getAnimationClass()}`} 
      style={{ 
        animationDuration: duration,
        animationDelay: delay,
        animationFillMode: 'both' 
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;

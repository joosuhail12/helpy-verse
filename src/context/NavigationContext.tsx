
import React, { createContext, useContext, useState, ReactNode } from 'react';

type NavigateFunction = (path: string) => void;

interface NavigationContextType {
  activeMainNav: string;
  setActiveMainNav: (id: string) => void;
  expandedItems: string[];
  toggleExpanded: (itemTitle: string) => void;
  isSecondPanelCollapsed: boolean;
  toggleSecondPanel: () => void;
  navigate: NavigateFunction;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{
  children: ReactNode;
  navigateOverride?: NavigateFunction;
}> = ({ children, navigateOverride }) => {
  const [activeMainNav, setActiveMainNav] = useState('home');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isSecondPanelCollapsed, setIsSecondPanelCollapsed] = useState(false);

  // Default navigation function (fallback to window.location if needed)
  const defaultNavigate: NavigateFunction = (path: string) => {
    console.log('Navigating to:', path);
    window.location.href = path;
  };

  const navigate = navigateOverride || defaultNavigate;

  const toggleExpanded = (itemTitle: string) => {
    setExpandedItems(prev => 
      prev.includes(itemTitle) 
        ? prev.filter(item => item !== itemTitle)
        : [...prev, itemTitle]
    );
  };

  const toggleSecondPanel = () => {
    setIsSecondPanelCollapsed(prev => !prev);
  };

  return (
    <NavigationContext.Provider
      value={{
        activeMainNav,
        setActiveMainNav,
        expandedItems,
        toggleExpanded,
        isSecondPanelCollapsed,
        toggleSecondPanel,
        navigate
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// Safe version that doesn't throw errors if used outside context
export const useSafeNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    // Return default values when used outside context
    return {
      activeMainNav: 'home',
      setActiveMainNav: () => console.warn('Navigation context not available'),
      expandedItems: [],
      toggleExpanded: () => console.warn('Navigation context not available'),
      isSecondPanelCollapsed: false,
      toggleSecondPanel: () => console.warn('Navigation context not available'),
      navigate: (path) => {
        console.warn('Navigation attempted outside context:', path);
        window.location.href = path;
      }
    };
  }
  return context;
};

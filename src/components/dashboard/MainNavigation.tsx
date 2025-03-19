
import { Button } from '@/components/ui/button';
import { mainNavItems } from './navigationConfig';
import { NavigateFunction, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MainNavigationProps {
  activeMainNav: string;
  setActiveMainNav: (id: string) => void;
  navigate: NavigateFunction;
}

const MainNavigation = ({ activeMainNav, setActiveMainNav, navigate }: MainNavigationProps) => {
  const location = useLocation();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.altKey) {
        mainNavItems.forEach((item, index) => {
          if (event.key === `${index + 1}`) {
            setActiveMainNav(item.id);
            // Only navigate if it's the home item, otherwise just open the secondary panel
            if (item.id === 'home') {
              navigate(item.path);
            }
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, setActiveMainNav]);

  const handleNavClick = (itemId: string, path: string) => {
    setActiveMainNav(itemId);
    // Only navigate if it's the home item, otherwise just open the secondary panel
    if (itemId === 'home') {
      navigate(path);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {mainNavItems.map((item, index) => {
        const isActive = location.pathname.startsWith(`/home/${item.id}`) || 
                         (item.id === 'home' && location.pathname === '/home');
        
        return (
          <TooltipProvider key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group overflow-hidden ${
                    isActive 
                      ? 'text-primary bg-primary/5 shadow-sm hover:shadow-md hover:bg-primary/10' 
                      : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                  }`}
                  onClick={() => handleNavClick(item.id, item.path)}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-primary/5 animate-pulse" />
                  )}
                  <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                  <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 relative z-10" />
                  <span className="sr-only">{item.title}</span>
                  {isActive && (
                    <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full animate-fade-in" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex flex-col gap-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">Alt + {index + 1}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

export default MainNavigation;

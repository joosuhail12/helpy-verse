
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavigateFunction } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import SubNavigation from './SubNavigation';
import { mainNavItems, subNavItems } from './navigationConfig';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';
import { toast } from '@/components/ui/use-toast';

interface SidebarProps {
  // Optional props for when Sidebar is used in a context without Router
  navigateOverride?: (path: string) => void;
}

const Sidebar = ({ navigateOverride }: SidebarProps = {}) => {
  // Create safe versions of the router hooks that won't crash when not in router context
  let navigate: NavigateFunction | ((path: string) => void);
  let location: { pathname: string };
  let currentPath = '';
  
  try {
    // Try to use the real router hooks
    navigate = navigateOverride || useNavigate();
    location = useLocation();
    currentPath = location.pathname;
  } catch (error) {
    // Fallback if router context is not available
    console.warn('Router context not available, using fallback navigation');
    navigate = navigateOverride || ((path: string) => {
      console.warn('Navigation attempted outside router context:', path);
      window.location.href = path; // Fallback to window location change
    });
    location = { pathname: window.location.pathname };
    currentPath = window.location.pathname;
  }
  
  const dispatch = useAppDispatch();
  
  // Get the current route segment to determine active nav
  const currentRoute = currentPath.split('/');
  const initialMainNav = currentRoute[1] === 'inbox' ? 'inbox' : 
                        (currentRoute[1] === 'home' && currentRoute[2] ? currentRoute[2] : 'home');
  
  const [activeMainNav, setActiveMainNav] = useState(initialMainNav);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isSecondPanelCollapsed, setIsSecondPanelCollapsed] = useState(false);

  // Update activeMainNav when route changes
  useEffect(() => {
    const currentRoute = currentPath.split('/');
    if (currentRoute[1] === 'inbox') {
      setActiveMainNav('inbox');
    } else if (currentRoute[1] === 'home' && currentRoute[2]) {
      setActiveMainNav(currentRoute[2]);
    } else if (currentRoute[1] === 'home') {
      setActiveMainNav('home');
    }
  }, [currentPath]);

  const handleLogout = () => {
    // Dispatch the logout action which will handle token clearing and redirection
    console.log("Logging out user...");
    dispatch(logout());
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

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

  // Show secondary nav only for non-home items that have sub-items
  const shouldShowSecondaryNav = activeMainNav !== 'home' && subNavItems[activeMainNav as keyof typeof subNavItems];

  return (
    <>
      <div className="w-16 min-h-screen bg-white/80 backdrop-blur-xl border-r border-purple-100/50 shadow-lg flex flex-col items-center justify-between py-6 relative z-10">
        <div className="flex flex-col items-center gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <img 
              src="https://framerusercontent.com/images/9N8Z1vTRbJsHlrIuTjm6Ajga4dI.png" 
              alt="Logo" 
              className="w-10 h-10 object-contain transition-all duration-300 group-hover:scale-110 relative z-10"
            />
          </div>
          
          <MainNavigation 
            activeMainNav={activeMainNav}
            setActiveMainNav={setActiveMainNav}
            navigate={navigate}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50/80 flex justify-center items-center transition-all duration-300 hover:shadow-md relative group"
          onClick={handleLogout}
        >
          <div className="absolute inset-0 bg-red-100/50 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <LogOut className="h-5 w-5 relative z-10" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>

      {shouldShowSecondaryNav && (
        <SubNavigation 
          activeMainNav={activeMainNav}
          isSecondPanelCollapsed={isSecondPanelCollapsed}
          toggleSecondPanel={toggleSecondPanel}
          expandedItems={expandedItems}
          toggleExpanded={toggleExpanded}
          navigate={navigate}
        />
      )}
    </>
  );
};

export default Sidebar;

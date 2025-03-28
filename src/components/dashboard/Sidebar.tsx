
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useNavigate, useLocation, NavigateFunction } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import SubNavigation from './SubNavigation';
import { mainNavItems, subNavItems } from './navigationConfig';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';
import { toast } from '@/components/ui/use-toast';
import { NavigationProvider } from '@/context/NavigationContext';

interface SidebarProps {
  // Optional props for when Sidebar is used in a context without Router
  navigateOverride?: (path: string) => void;
}

const Sidebar = ({ navigateOverride }: SidebarProps = {}) => {
  // Create safe versions of the router hooks that won't crash when not in router context
  let navigate: NavigateFunction | ((path: string) => void);
  let currentPath = '';
  
  try {
    // Try to use the real router hooks
    navigate = navigateOverride || useNavigate();
    const location = useLocation();
    currentPath = location.pathname;
  } catch (error) {
    // Fallback if router context is not available
    console.warn('Router context not available, using fallback navigation');
    navigate = navigateOverride || ((path: string) => {
      console.warn('Navigation attempted outside router context:', path);
      window.location.href = path; // Fallback to window location change
    });
    currentPath = window.location.pathname;
  }
  
  const dispatch = useAppDispatch();
  
  // Get the current route segment to determine active nav
  const currentRoute = currentPath.split('/');
  const initialMainNav = currentRoute[1] === 'inbox' ? 'inbox' : 
                        (currentRoute[1] === 'home' && currentRoute[2] ? currentRoute[2] : 'home');

  const handleLogout = () => {
    // Dispatch the logout action which will handle token clearing and redirection
    console.log("Logging out user...");
    dispatch(logout());
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
  };

  return (
    <NavigationProvider navigateOverride={navigate}>
      <div className="flex">
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
            
            <MainNavigation />
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

        <SidebarSecondaryPanel initialMainNav={initialMainNav} />
      </div>
    </NavigationProvider>
  );
};

// Separate component to handle secondary panel rendering
const SidebarSecondaryPanel = ({ initialMainNav }: { initialMainNav: string }) => {
  const { activeMainNav, setActiveMainNav } = useSafeNavigation();
  
  // Set initial active nav on mount
  useEffect(() => {
    setActiveMainNav(initialMainNav);
  }, [initialMainNav, setActiveMainNav]);

  // Show secondary nav only for non-home items that have sub-items
  const shouldShowSecondaryNav = activeMainNav !== 'home' && subNavItems[activeMainNav as keyof typeof subNavItems];

  if (!shouldShowSecondaryNav) {
    return null;
  }

  return <SubNavigation />;
};

export default Sidebar;

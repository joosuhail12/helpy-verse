
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import SubNavigation from './SubNavigation';
import { mainNavItems, subNavItems } from './navigationConfig';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';
import { toast } from '@/components/ui/use-toast';

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeMainNav, setActiveMainNav] = useState(window.location.pathname.split('/')[1] || 'home');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isSecondPanelCollapsed, setIsSecondPanelCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    navigate('/sign-in', { replace: true });
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

  // Add debug logging
  console.log('Current auth state:', localStorage.getItem('auth'));
  console.log('Current path:', window.location.pathname);
  console.log('Active main nav:', activeMainNav);

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

      {activeMainNav !== 'home' && subNavItems[activeMainNav as keyof typeof subNavItems] && (
        <SubNavigation 
          navItems={subNavItems[activeMainNav as keyof typeof subNavItems]}
          isCollapsed={isSecondPanelCollapsed}
          toggleCollapsed={toggleSecondPanel}
          expandedItems={expandedItems}
          onItemToggle={toggleExpanded}
          onNavigate={(path) => navigate(path)}
        />
      )}
    </>
  );
};

export default Sidebar;

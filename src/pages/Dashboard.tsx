
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Settings, Headphones, Home, MessageSquare, HardDrive, Bot, BookText, Tag, Send, ArrowRight } from 'lucide-react';
import MainNavigation from '@/components/dashboard/MainNavigation';
import SubNavigation from '@/components/dashboard/SubNavigation';
import HeaderNavigation from '@/components/dashboard/HeaderNavigation';
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import { cn } from '@/lib/utils';
import { type MainNavItem } from '@/components/dashboard/types/navigation';
import { CaslProvider } from '@/components/CaslProvider';

const mainNavItems: MainNavItem[] = [
  {
    id: 'home',
    title: 'Home',
    path: '/home',
    icon: Home
  },
  {
    id: 'tickets',
    title: 'Tickets',
    path: '/home/tickets',
    icon: Headphones,
    children: [
      {
        title: 'All Tickets',
        path: '/home/tickets'
      },
      {
        title: 'My Tickets',
        path: '/home/tickets/my-tickets'
      },
      {
        title: 'Unassigned',
        path: '/home/tickets/unassigned'
      }
    ]
  },
  {
    id: 'contacts',
    title: 'Contacts',
    path: '/home/contacts',
    icon: Users,
    children: [
      {
        title: 'All Contacts',
        path: '/home/contacts'
      },
      {
        title: 'Companies',
        path: '/home/contacts/companies'
      },
      {
        title: 'Tags',
        path: '/home/contacts/tags'
      }
    ]
  },
  {
    id: 'teammates',
    title: 'Teammates',
    path: '/home/teammates',
    icon: Users,
  },
  {
    id: 'channels',
    title: 'Channels',
    path: '/home/channels',
    icon: Send,
    children: [
      {
        title: 'Email',
        path: '/home/channels/email'
      },
      {
        title: 'Live Chat',
        path: '/home/channels/chat'
      },
      {
        title: 'Knowledge Base',
        path: '/home/channels/kb'
      }
    ]
  },
  {
    id: 'automation',
    title: 'Automation',
    path: '/home/automation',
    icon: Bot,
    children: [
      {
        title: 'Chatbots',
        path: '/home/automation/chatbots'
      },
      {
        title: 'Content Manager',
        path: '/home/automation/content'
      },
      {
        title: 'Actions',
        path: '/home/automation/actions'
      }
    ]
  },
  {
    id: 'settings',
    title: 'Settings',
    path: '/home/settings',
    icon: Settings,
    children: [
      {
        title: 'General',
        path: '/home/settings'
      },
      {
        title: 'Teams',
        path: '/home/settings/teams'
      },
      {
        title: 'Custom Data',
        path: '/home/settings/custom-data'
      },
      {
        title: 'Canned Responses',
        path: '/home/settings/canned-responses'
      },
      {
        title: 'Tags',
        path: '/home/settings/tags'
      }
    ]
  }
];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMainNav, setActiveMainNav] = useState<string>('');
  const [subNavItems, setSubNavItems] = useState<any[]>([]);

  const userData = useAppSelector((state) => state.auth);
  console.log('Current auth state:', userData);

  useEffect(() => {
    const currentPath = location.pathname;
    console.log('Current path:', currentPath);
    
    // Find which main nav item is active based on the current path
    const activeItem = mainNavItems.find(item => 
      currentPath === item.path || currentPath.startsWith(`${item.path}/`)
    );
    
    const activeId = activeItem?.id || '';
    setActiveMainNav(activeId);
    console.log('Active main nav:', activeId);
    
    // Set sub-navigation items based on the active main nav
    if (activeItem && activeItem.children) {
      setSubNavItems(activeItem.children);
    } else {
      setSubNavItems([]);
    }
  }, [location.pathname]);
  
  // Get the appropriate email display - note the fallback for development
  const userEmail = "user@example.com"; // Default fallback email
  
  return (
    <CaslProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Main Navigation */}
        <MainNavigation 
          items={mainNavItems} 
          activeItem={activeMainNav}
          isCollapsed={isCollapsed}
          onCollapsedChange={setIsCollapsed}
        />
        
        {/* Sub Navigation - conditionally rendered */}
        <AnimatePresence mode="wait">
          {subNavItems.length > 0 && (
            <SubNavigation 
              items={subNavItems} 
              isCollapsed={isCollapsed} 
              onToggle={() => setIsCollapsed(!isCollapsed)}
            />
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <motion.div 
          className={cn(
            "flex flex-col flex-1 h-full overflow-hidden",
            subNavItems.length === 0 && !isCollapsed ? "ml-[280px]" : "",
            subNavItems.length === 0 && isCollapsed ? "ml-[80px]" : "",
            subNavItems.length > 0 ? "ml-0" : ""
          )}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <HeaderNavigation email={userEmail} />
          
          {/* Content Area */}
          <div className="flex-1 overflow-auto bg-gray-50">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </CaslProvider>
  );
};

export default Dashboard;

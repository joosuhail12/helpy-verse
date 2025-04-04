
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Inbox, Settings, Users, Building2, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Main application sidebar navigation
 */
const Sidebar = () => {
  const location = useLocation();
  
  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Inbox, label: 'Inbox', path: '/inbox' },
    { icon: Users, label: 'Contacts', path: '/contacts' },
    { icon: Building2, label: 'Companies', path: '/companies' },
    { icon: Bot, label: 'Automation', path: '/automation' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="w-16 lg:w-64 h-screen bg-background border-r flex flex-col">
      <div className="p-4 border-b">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="font-bold text-xl hidden lg:block">Pullse</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-muted-foreground">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

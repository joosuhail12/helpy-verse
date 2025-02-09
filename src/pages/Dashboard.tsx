
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';
import { 
  Home, 
  Inbox, 
  Users, 
  Bot, 
  BarChart, 
  Settings,
  Menu,
  LogOut
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const navItems = [
  { title: 'Home', icon: Home, path: '/dashboard' },
  { title: 'Inbox', icon: Inbox, path: '/dashboard/inbox' },
  { title: 'Contacts', icon: Users, path: '/dashboard/contacts' },
  { title: 'AI & Automation', icon: Bot, path: '/dashboard/automation' },
  { title: 'Reporting', icon: BarChart, path: '/dashboard/reporting' },
  { title: 'Settings', icon: Settings, path: '/dashboard/settings' }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    navigate('/sign-in');
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      {/* Sidebar */}
      <Sidebar className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent>
          <div className="p-4 flex items-center justify-between">
            <h1 className={`font-bold text-xl transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              Dashboard
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <SidebarGroup>
            <SidebarGroupLabel className={isSidebarOpen ? 'opacity-100' : 'opacity-0'}>
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className={`transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <div className="mt-auto p-4">
          <Button
            variant="ghost"
            className="w-full flex items-center gap-3 justify-center"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className={`transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
              Logout
            </span>
          </Button>
        </div>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header with Breadcrumbs */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-primary font-medium">Home</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">Welcome, {user?.email}</h1>
          <p className="text-gray-600">Select an option from the sidebar to get started.</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

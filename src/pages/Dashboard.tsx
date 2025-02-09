import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
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
  SidebarProvider
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
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    navigate('/sign-in');
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-white via-purple-50/30 to-purple-100/30">
        {/* Sidebar */}
        <Sidebar className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <div className="h-full flex flex-col bg-white/60 backdrop-blur-lg border-r border-purple-100/50 shadow-lg">
            <SidebarContent>
              <div className="p-4 flex items-center justify-between border-b border-purple-100/50">
                <h1 className={`font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  Dashboard
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="hover:bg-primary/10 transition-colors"
                >
                  <Menu className="h-5 w-5 text-primary" />
                </Button>
              </div>
              
              <SidebarGroup>
                <SidebarGroupLabel className={`px-4 pt-6 text-sm font-medium text-purple-600/70 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 rounded-lg transition-all duration-300 group relative overflow-hidden"
                        >
                          <div className="relative z-10 flex items-center gap-3">
                            <item.icon className={`h-5 w-5 transition-colors duration-300 ${
                              location.pathname === item.path 
                                ? 'text-primary' 
                                : 'text-gray-500 group-hover:text-primary'
                            }`} />
                            <span className={`text-sm font-medium transition-all duration-300 ${
                              isSidebarOpen ? 'opacity-100' : 'opacity-0'
                            } ${
                              location.pathname === item.path 
                                ? 'text-primary' 
                                : 'text-gray-600 group-hover:text-primary'
                            }`}>
                              {item.title}
                            </span>
                          </div>
                          {location.pathname === item.path && (
                            <div className="absolute inset-0 bg-primary/10 rounded-lg" />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <div className="mt-auto p-4 border-t border-purple-100/50">
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 justify-center text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span className={`text-sm font-medium transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  Logout
                </span>
              </Button>
            </div>
          </div>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header with Breadcrumbs */}
          <header className="bg-white/50 backdrop-blur-sm border-b border-purple-100 px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Dashboard</span>
              <span className="text-gray-400">/</span>
              <span className="text-primary font-medium">Home</span>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.email}</h1>
                <p className="text-gray-600">Select an option from the sidebar to get started with your journey.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {navItems.slice(0, 3).map((item) => (
                  <button
                    key={item.title}
                    onClick={() => navigate(item.path)}
                    className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-sm 
                             hover:shadow-md hover:border-primary/20 transition-all duration-300 group text-left"
                  >
                    <item.icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Access your {item.title.toLowerCase()} and manage your workflow
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

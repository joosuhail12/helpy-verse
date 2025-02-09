
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
  LogOut,
  ChevronRight,
  MessageSquare,
  AtSign,
  ListFilter,
  InboxIcon,
  UsersRound,
  User
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

const mainNavItems = [
  { id: 'home', title: 'Home', icon: Home, path: '/dashboard' },
  { id: 'inbox', title: 'Inbox', icon: Inbox, path: '/dashboard/inbox' },
  { id: 'contacts', title: 'Contacts', icon: Users, path: '/dashboard/contacts' },
  { id: 'automation', title: 'AI & Automation', icon: Bot, path: '/dashboard/automation' },
  { id: 'reporting', title: 'Reporting', icon: BarChart, path: '/dashboard/reporting' },
  { id: 'settings', title: 'Settings', icon: Settings, path: '/dashboard/settings' }
];

const subNavItems = {
  inbox: [
    { title: 'Your Inbox', icon: InboxIcon, path: '/dashboard/inbox/your-inbox' },
    { title: 'Mentions', icon: AtSign, path: '/dashboard/inbox/mentions' },
    { title: 'All', icon: ListFilter, path: '/dashboard/inbox/all' },
    { title: 'Unassigned', icon: MessageSquare, path: '/dashboard/inbox/unassigned' },
    {
      title: 'Teams',
      icon: UsersRound,
      children: [
        { title: 'All Teams', path: '/dashboard/inbox/teams' },
        { title: 'Team 1 View', path: '/dashboard/inbox/teams/1' },
        { title: 'Team 2 View', path: '/dashboard/inbox/teams/2' },
        { title: 'Team 3 View', path: '/dashboard/inbox/teams/3' },
      ]
    },
    {
      title: 'Teammates',
      icon: User,
      children: [
        { title: 'Teammate 1 View', path: '/dashboard/inbox/teammates/1' },
        { title: 'Teammate 2 View', path: '/dashboard/inbox/teammates/2' },
        { title: 'Teammate 3 View', path: '/dashboard/inbox/teammates/3' },
      ]
    }
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const [activeMainNav, setActiveMainNav] = useState('home');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    navigate('/sign-in');
  };

  const toggleExpanded = (itemTitle: string) => {
    setExpandedItems(prev => 
      prev.includes(itemTitle) 
        ? prev.filter(item => item !== itemTitle)
        : [...prev, itemTitle]
    );
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-white via-purple-50/30 to-purple-100/30">
        {/* Main Navigation Panel */}
        <div className="w-20 min-h-screen bg-white/60 backdrop-blur-lg border-r border-purple-100/50 shadow-lg flex flex-col items-center py-6">
          <div className="mb-8">
            <h1 className="font-bold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              L
            </h1>
          </div>
          
          <div className="flex-1 flex flex-col gap-6">
            {mainNavItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                className={`relative group ${
                  activeMainNav === item.id 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                }`}
                onClick={() => {
                  setActiveMainNav(item.id);
                  navigate(item.path);
                }}
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.title}</span>
                {activeMainNav === item.id && (
                  <div className="absolute left-0 w-1 h-full bg-primary rounded-r-full" />
                )}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="mt-auto text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>

        {/* Sub Navigation Panel */}
        {activeMainNav !== 'home' && subNavItems[activeMainNav as keyof typeof subNavItems] && (
          <div className="w-64 min-h-screen bg-white/40 backdrop-blur-sm border-r border-purple-100/50">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {mainNavItems.find(item => item.id === activeMainNav)?.title}
              </h2>
              <div className="space-y-1">
                {subNavItems[activeMainNav as keyof typeof subNavItems]?.map((item: any, index: number) => (
                  <div key={item.title}>
                    {item.children ? (
                      <div>
                        <Button
                          variant="ghost"
                          className="w-full justify-between text-left font-medium"
                          onClick={() => toggleExpanded(item.title)}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                          </div>
                          <ChevronRight className={`h-4 w-4 transition-transform ${
                            expandedItems.includes(item.title) ? 'rotate-90' : ''
                          }`} />
                        </Button>
                        {expandedItems.includes(item.title) && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.children.map((child: any) => (
                              <Button
                                key={child.title}
                                variant="ghost"
                                className="w-full justify-start text-sm"
                                onClick={() => navigate(child.path)}
                              >
                                {child.title}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-medium"
                        onClick={() => navigate(item.path)}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span>{item.title}</span>
                        </div>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header with Breadcrumbs */}
          <header className="bg-white/50 backdrop-blur-sm border-b border-purple-100 px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Dashboard</span>
              <span className="text-gray-400">/</span>
              <span className="text-primary font-medium">
                {mainNavItems.find(item => item.id === activeMainNav)?.title}
              </span>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.email}</h1>
                <p className="text-gray-600">Select an option from the sidebar to get started with your journey.</p>
              </div>

              {activeMainNav === 'home' && (
                <div className="grid md:grid-cols-3 gap-4">
                  {mainNavItems.slice(1, 4).map((item) => (
                    <button
                      key={item.title}
                      onClick={() => {
                        setActiveMainNav(item.id);
                        navigate(item.path);
                      }}
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
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

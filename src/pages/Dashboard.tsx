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
  LogOut,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  AtSign,
  ListFilter,
  InboxIcon,
  UsersRound,
  User,
  Building2,
  BrainCircuit,
  ScrollText,
  FileSpreadsheet,
  UserCog,
  MessagesSquare,
  Mail,
  Database,
  Tags,
  MessageCircle,
  Reply,
  Brain,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import React from 'react';

const mainNavItems = [
  { id: 'home', title: 'Home', icon: Home, path: '/home' },
  { id: 'inbox', title: 'Inbox', icon: Inbox, path: '/home/inbox' },
  { id: 'contacts', title: 'Contacts', icon: Users, path: '/home/contacts' },
  { id: 'automation', title: 'AI & Automation', icon: Bot, path: '/home/automation' },
  { id: 'reporting', title: 'Reporting', icon: BarChart, path: '/home/reporting' },
  { id: 'settings', title: 'Settings', icon: Settings, path: '/home/settings' }
];

const subNavItems = {
  inbox: [
    { title: 'Your Inbox', icon: InboxIcon, path: '/home/inbox/your-inbox' },
    { title: 'Mentions', icon: AtSign, path: '/home/inbox/mentions' },
    { title: 'All', icon: ListFilter, path: '/home/inbox/all' },
    { title: 'Unassigned', icon: MessageSquare, path: '/home/inbox/unassigned' },
    {
      title: 'Teams',
      icon: UsersRound,
      children: [
        { title: 'All Teams', path: '/home/inbox/teams' },
        { title: 'Team 1 View', path: '/home/inbox/teams/1' },
        { title: 'Team 2 View', path: '/home/inbox/teams/2' },
        { title: 'Team 3 View', path: '/home/inbox/teams/3' },
      ]
    },
    {
      title: 'Teammates',
      icon: User,
      children: [
        { title: 'Teammate 1 View', path: '/home/inbox/teammates/1' },
        { title: 'Teammate 2 View', path: '/home/inbox/teammates/2' },
        { title: 'Teammate 3 View', path: '/home/inbox/teammates/3' },
      ]
    }
  ],
  contacts: [
    {
      title: 'Contacts',
      icon: Users,
      children: [
        { title: 'All Contacts', path: '/home/contacts/all' },
        { title: 'Visitors', path: '/home/contacts/visitors' },
        { title: 'Customers', path: '/home/contacts/customers' }
      ]
    },
    { title: 'Companies', icon: Building2, path: '/home/contacts/companies' }
  ],
  automation: [
    {
      title: 'AI',
      icon: BrainCircuit,
      children: [
        { title: 'Chatbot Profiles', path: '/home/automation/ai/chatbot-profiles' },
        { title: 'Content Center', path: '/home/automation/ai/content-center' },
        { title: 'Action Center', path: '/home/automation/ai/action-center' },
        {
          title: 'Bot Inboxes',
          children: [
            { title: 'Bot 1 Inbox', path: '/home/automation/ai/bot-inboxes/1' },
            { title: 'Bot 2 Inbox', path: '/home/automation/ai/bot-inboxes/2' },
            { title: 'Bot 3 Inbox', path: '/home/automation/ai/bot-inboxes/3' }
          ]
        },
        { title: 'Copilot', path: '/home/automation/ai/copilot' }
      ]
    },
    { title: 'Workflows', icon: Activity, path: '/home/automation/workflows' },
    { title: 'Workflow Templates', icon: ScrollText, path: '/home/automation/workflow-templates' }
  ],
  reporting: [
    { title: 'Dashboard', icon: BarChart, path: '/home/reporting/dashboard' },
    {
      title: 'Reports',
      icon: FileSpreadsheet,
      children: [
        { title: 'Report 1', path: '/home/reporting/reports/1' },
        { title: 'Report 2', path: '/home/reporting/reports/2' },
        { title: 'Report 3', path: '/home/reporting/reports/3' }
      ]
    },
    {
      title: 'Custom Reports',
      icon: FileSpreadsheet,
      children: [
        { title: 'Custom Report 1', path: '/home/reporting/custom/1' },
        { title: 'Custom Report 2', path: '/home/reporting/custom/2' },
        { title: 'Custom Report 3', path: '/home/reporting/custom/3' }
      ]
    }
  ],
  settings: [
    { title: 'Teammates', icon: UserCog, path: '/home/settings/teammates' },
    { title: 'Teams', icon: Users, path: '/home/settings/teams' },
    { title: 'Chat', icon: MessagesSquare, path: '/home/settings/chat' },
    {
      title: 'Email',
      icon: Mail,
      children: [
        { title: 'Domains', path: '/home/settings/email/domains' },
        { title: 'Sender Email Address', path: '/home/settings/email/sender' },
        { title: 'Email Settings', path: '/home/settings/email/settings' }
      ]
    },
    { title: 'Custom Data', icon: Database, path: '/home/settings/custom-data' },
    { title: 'Tags', icon: Tags, path: '/home/settings/tags' },
    { title: 'Topics', icon: MessageCircle, path: '/home/settings/topics' },
    { title: 'Canned Responses', icon: Reply, path: '/home/settings/canned-responses' },
    { title: 'Sentiment', icon: Activity, path: '/home/settings/sentiment' },
    { title: 'AutoQA', icon: Brain, path: '/home/settings/autoqa' },
    { title: 'Auto Reply', icon: Reply, path: '/home/settings/auto-reply' }
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const [activeMainNav, setActiveMainNav] = useState('home');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isSecondPanelCollapsed, setIsSecondPanelCollapsed] = useState(false);

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

  const toggleSecondPanel = () => {
    setIsSecondPanelCollapsed(prev => !prev);
  };

  const getCurrentPageTitle = () => {
    const currentMainNav = mainNavItems.find(item => location.pathname.startsWith(item.path));
    if (!currentMainNav) return {
      main: '',
      exact: ''
    };

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    let exactPageTitle = '';
    if (currentMainNav.id !== 'home') {
      const searchForTitle = (items: any[]): string => {
        for (const item of items) {
          if (item.path?.endsWith(lastSegment)) {
            return item.title;
          }
          if (item.children) {
            const found = searchForTitle(item.children);
            if (found) return found;
          }
        }
        return '';
      };
      
      exactPageTitle = searchForTitle(subNavItems[currentMainNav.id as keyof typeof subNavItems] || []);
    }

    return {
      main: currentMainNav.title,
      exact: exactPageTitle || currentMainNav.title
    };
  };

  const pageTitle = getCurrentPageTitle();

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-white via-purple-50/30 to-purple-100/30">
      <div className="w-16 min-h-screen bg-white/80 backdrop-blur-xl border-r border-purple-100 shadow-lg flex flex-col items-center justify-between py-6">
        <div className="flex flex-col items-center gap-8">
          <div className="relative group">
            <img 
              src="https://framerusercontent.com/images/9N8Z1vTRbJsHlrIuTjm6Ajga4dI.png" 
              alt="Logo" 
              className="w-10 h-10 object-contain transition-all duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-125 transition-transform duration-300" />
          </div>
          
          <div className="flex flex-col items-center justify-center gap-3">
            {mainNavItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group ${
                  activeMainNav === item.id 
                    ? 'text-primary bg-primary/10 shadow-sm hover:shadow-md hover:bg-primary/15' 
                    : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                }`}
                onClick={() => {
                  setActiveMainNav(item.id);
                  navigate(item.path);
                }}
              >
                <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="sr-only">{item.title}</span>
                {activeMainNav === item.id && (
                  <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full animate-fade-in" />
                )}
              </Button>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 flex justify-center items-center transition-all duration-300 hover:shadow-md"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>

      {activeMainNav !== 'home' && subNavItems[activeMainNav as keyof typeof subNavItems] && (
        <div 
          className={`${
            isSecondPanelCollapsed ? 'w-12' : 'w-64'
          } min-h-screen bg-white/60 backdrop-blur-lg border-r border-purple-100/50 transition-all duration-300 ease-in-out relative`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              {!isSecondPanelCollapsed && (
                <h2 className="text-lg font-semibold text-gray-800 ml-2">
                  {mainNavItems.find(item => item.id === activeMainNav)?.title}
                </h2>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg flex justify-center items-center hover:bg-primary/5 transition-colors"
                onClick={toggleSecondPanel}
              >
                {isSecondPanelCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="space-y-1">
              {subNavItems[activeMainNav as keyof typeof subNavItems]?.map((item: any, index: number) => (
                <div key={item.title}>
                  {item.children ? (
                    <div>
                      <Button
                        variant="ghost"
                        className={`w-full flex items-center rounded-lg transition-colors ${
                          isSecondPanelCollapsed ? 'justify-center p-2' : 'justify-between px-4 py-2'
                        } hover:bg-primary/5`}
                        onClick={() => toggleExpanded(item.title)}
                      >
                        <div className={`flex items-center ${isSecondPanelCollapsed ? 'justify-center' : 'gap-3'}`}>
                          {item.icon && (
                            <div className="flex items-center justify-center w-5">
                              <item.icon className="h-4 w-4" />
                            </div>
                          )}
                          {!isSecondPanelCollapsed && <span>{item.title}</span>}
                        </div>
                        {!isSecondPanelCollapsed && (
                          <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
                            expandedItems.includes(item.title) ? 'rotate-90' : ''
                          }`} />
                        )}
                      </Button>
                      {expandedItems.includes(item.title) && !isSecondPanelCollapsed && (
                        <div className="ml-8 mt-1 space-y-1 animate-accordion-down">
                          {item.children.map((child: any) => (
                            <Button
                              key={child.title}
                              variant="ghost"
                              className="w-full flex items-center justify-start text-sm px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
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
                      className={`w-full flex items-center rounded-lg transition-colors ${
                        isSecondPanelCollapsed ? 'justify-center p-2' : 'justify-start px-4 py-2'
                      } hover:bg-primary/5`}
                      onClick={() => navigate(item.path)}
                    >
                      <div className={`flex items-center ${isSecondPanelCollapsed ? 'justify-center' : 'gap-3'}`}>
                        {item.icon && (
                          <div className="flex items-center justify-center w-5">
                            <item.icon className="h-4 w-4" />
                          </div>
                        )}
                        {!isSecondPanelCollapsed && <span>{item.title}</span>}
                      </div>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-white/50 backdrop-blur-sm border-b border-purple-100 px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium text-primary">{pageTitle.main}</span>
            {pageTitle.exact !== pageTitle.main && (
              <>
                <span className="text-gray-400">/</span>
                <span>{pageTitle.exact}</span>
              </>
            )}
          </div>
        </header>

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
  );
};

export default Dashboard;


import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import Sidebar from '@/components/dashboard/Sidebar';
import { mainNavItems, subNavItems } from '@/components/dashboard/navigationConfig';
import { ChevronRight, Hash } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

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

  const getBreadcrumbs = () => {
    const currentMainNav = mainNavItems.find(item => location.pathname.startsWith(item.path));
    if (!currentMainNav) return [];

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    const breadcrumbs = [{
      title: currentMainNav.title,
      path: currentMainNav.path,
      icon: currentMainNav.icon
    }];

    if (currentMainNav.id !== 'home' && lastSegment !== currentMainNav.id) {
      const searchForBreadcrumb = (items: any[]): { title: string; icon: any } | null => {
        for (const item of items) {
          if (item.path?.endsWith(lastSegment)) {
            return { title: item.title, icon: item.icon || Hash };
          }
          if (item.children) {
            const found = searchForBreadcrumb(item.children);
            if (found) return found;
          }
        }
        return null;
      };

      const currentSection = searchForBreadcrumb(subNavItems[currentMainNav.id as keyof typeof subNavItems] || []);
      if (currentSection) {
        breadcrumbs.push({
          title: currentSection.title,
          path: location.pathname,
          icon: currentSection.icon
        });
      }
    }

    return breadcrumbs;
  };

  const pageTitle = getCurrentPageTitle();
  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-white via-purple-50/30 to-purple-100/30">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="sticky top-0 z-10 bg-white/50 backdrop-blur-sm border-b border-purple-100 px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
                <button
                  onClick={() => navigate(crumb.path)}
                  className={`flex items-center gap-2 hover:text-primary transition-colors ${
                    index === breadcrumbs.length - 1 
                      ? 'text-primary font-medium' 
                      : 'text-gray-600'
                  }`}
                >
                  {crumb.icon && <crumb.icon className="h-4 w-4" />}
                  {crumb.title}
                </button>
              </div>
            ))}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {location.pathname === '/home' ? (
              <>
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.email}</h1>
                    <p className="text-gray-600">Select an option from the sidebar to get started with your journey.</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {mainNavItems.slice(1, 4).map((item) => (
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
              </>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

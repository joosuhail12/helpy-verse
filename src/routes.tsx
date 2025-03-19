import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Companies = lazy(() => import('./pages/contacts/Companies'));
const DashboardLayoutComponent = lazy(() => import('./layouts/DashboardLayout').catch(() => {
  console.error('Failed to load DashboardLayout');
  throw new Error('Failed to load DashboardLayout');
}));

// Page components
const Home = lazy(() => import('./pages/Home').catch(() => {
  console.error('Failed to load Home page');
  throw new Error('Failed to load Home page');
}));
const Automation = lazy(() => import('./pages/automation').catch(() => {
  console.error('Failed to load Automation page');
  throw new Error('Failed to load Automation page');
}));
const ActionCenter = lazy(() => import('./pages/automation/ActionCenter').catch(() => {
  console.error('Failed to load ActionCenter');
  throw new Error('Failed to load ActionCenter');
}));
const CreateAction = lazy(() => import('./pages/automation/CreateAction').catch(() => {
  console.error('Failed to load CreateAction');
  throw new Error('Failed to load CreateAction');
}));
const ChatbotProfiles = lazy(() => import('./pages/automation/ChatbotProfiles').catch(() => {
  console.error('Failed to load ChatbotProfiles');
  throw new Error('Failed to load ChatbotProfiles');
}));
const ChatbotDetail = lazy(() => import('./pages/automation/ChatbotDetail').catch(() => {
  console.error('Failed to load ChatbotDetail');
  throw new Error('Failed to load ChatbotDetail');
}));
const CreateChatbot = lazy(() => import('./pages/automation/CreateChatbot').catch(() => {
  console.error('Failed to load CreateChatbot');
  throw new Error('Failed to load CreateChatbot');
}));

// Inbox pages
const Inbox = lazy(() => import('./pages/Inbox').catch(() => {
  console.error('Failed to load Inbox page');
  throw new Error('Failed to load Inbox page');
}));
const AllTickets = lazy(() => import('./pages/inbox/All').catch(() => {
  console.error('Failed to load All Tickets page');
  throw new Error('Failed to load All Tickets page');
}));
const YourInbox = lazy(() => import('./pages/inbox/YourInbox').catch(() => {
  console.error('Failed to load Your Inbox page');
  throw new Error('Failed to load Your Inbox page');
}));
const Mentions = lazy(() => import('./pages/inbox/Mentions').catch(() => {
  console.error('Failed to load Mentions page');
  throw new Error('Failed to load Mentions page');
}));
const Unassigned = lazy(() => import('./pages/inbox/Unassigned').catch(() => {
  console.error('Failed to load Unassigned page');
  throw new Error('Failed to load Unassigned page');
}));

// Settings pages
const Settings = lazy(() => import('./pages/Settings'));
const EmailDomainsSettings = lazy(() => import('./pages/settings/email/domains/Domains'));
const EmailDomainDetail = lazy(() => import('./pages/settings/email/domain-detail/DomainDetail'));
const EmailChannels = lazy(() => import('./pages/settings/email/channels/Channels'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayoutComponent />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'home',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'home/contacts/companies',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Companies />
          </Suspense>
        ),
      },
      {
        path: 'inbox',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Inbox />
          </Suspense>
        ),
        children: [
          {
            path: 'all',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <AllTickets />
              </Suspense>
            ),
          },
          {
            path: 'your-inbox',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <YourInbox />
              </Suspense>
            ),
          },
          {
            path: 'mentions',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Mentions />
              </Suspense>
            ),
          },
          {
            path: 'unassigned',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <Unassigned />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'home/settings',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Settings />
          </Suspense>
        ),
        children: [
          {
            path: 'email/domains',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <EmailDomainsSettings />
              </Suspense>
            ),
          },
          {
            path: 'email/domains/:id',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <EmailDomainDetail />
              </Suspense>
            ),
          },
          {
            path: 'email/channels',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <EmailChannels />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'home/automation',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Automation />
          </Suspense>
        ),
        children: [
          {
            path: 'ai/action-center',
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ActionCenter />
                </Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: 'ai/action-center/create',
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <CreateAction />
                </Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: 'ai/chatbot-profiles',
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ChatbotProfiles />
                </Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: 'ai/chatbot-profiles/create',
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <CreateChatbot />
                </Suspense>
              </ProtectedRoute>
            ),
          },
          {
            path: 'ai/chatbot-profiles/:id',
            element: (
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ChatbotDetail />
                </Suspense>
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;

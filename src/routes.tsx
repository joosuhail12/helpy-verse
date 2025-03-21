import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Layouts
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout').catch(() => {
  console.error('Failed to load DashboardLayout');
  throw new Error('Failed to load DashboardLayout');
}));

// Auth Pages
const SignIn = lazy(() => import('@/pages/SignIn').catch(() => {
  console.error('Failed to load SignIn page');
  throw new Error('Failed to load SignIn page');
}));
const SignUp = lazy(() => import('@/pages/SignUp').catch(() => {
  console.error('Failed to load SignUp page');
  throw new Error('Failed to load SignUp page');
}));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword').catch(() => {
  console.error('Failed to load ForgotPassword page');
  throw new Error('Failed to load ForgotPassword page');
}));

// Page components
const Home = lazy(() => import('@/pages/Home').catch(() => {
  console.error('Failed to load Home page');
  throw new Error('Failed to load Home page');
}));
const Automation = lazy(() => import('@/pages/automation').catch(() => {
  console.error('Failed to load Automation page');
  throw new Error('Failed to load Automation page');
}));
const ActionCenter = lazy(() => import('@/pages/automation/ActionCenter').catch(() => {
  console.error('Failed to load ActionCenter');
  throw new Error('Failed to load ActionCenter');
}));
const CreateAction = lazy(() => import('@/pages/automation/CreateAction').catch(() => {
  console.error('Failed to load CreateAction');
  throw new Error('Failed to load CreateAction');
}));
const ChatbotProfiles = lazy(() => import('@/pages/automation/ChatbotProfiles').catch(() => {
  console.error('Failed to load ChatbotProfiles');
  throw new Error('Failed to load ChatbotProfiles');
}));
const ChatbotDetail = lazy(() => import('@/pages/automation/ChatbotDetail').catch(() => {
  console.error('Failed to load ChatbotDetail');
  throw new Error('Failed to load ChatbotDetail');
}));
const CreateChatbot = lazy(() => import('@/pages/automation/CreateChatbot').catch(() => {
  console.error('Failed to load CreateChatbot');
  throw new Error('Failed to load CreateChatbot');
}));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    path: '/sign-in',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    path: '/sign-up',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SignUp />
      </Suspense>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'automation',
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
]);

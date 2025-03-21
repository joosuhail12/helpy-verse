
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from './components/ui/toaster';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Suspense, lazy, useEffect } from 'react';
import { useAppSelector } from "./hooks/useAppSelector";
import CaslProvider from "./components/CaslProvider";
import { getCookie } from "./utils/helpers/helpers";

// Lazy load components with explicit chunk names
const SignIn = lazy(() => import(/* webpackChunkName: "signin" */ "./pages/SignIn"));
const CreateChatbot = lazy(() => import(/* webpackChunkName: "create-chatbot" */ "./pages/automation/CreateChatbot"));
const SignUp = lazy(() => import(/* webpackChunkName: "signup" */ "./pages/SignUp"));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "forgot-password" */ "./pages/ForgotPassword"));
const Home = lazy(() => import(/* webpackChunkName: "home" */ "./pages/Dashboard"));
const AllTickets = lazy(() => import(/* webpackChunkName: "all-tickets" */ "./pages/inbox/All"));
const AllContacts = lazy(() => import(/* webpackChunkName: "all-contacts" */ "./pages/contacts/All"));
const ContactDetail = lazy(() => import(/* webpackChunkName: "contact-detail" */ "./pages/contacts/Detail"));
const Tags = lazy(() => import(/* webpackChunkName: "tags" */ "./pages/settings/Tags"));
const TeammateDetail = lazy(() => import(/* webpackChunkName: "teammate-detail" */ "./pages/settings/TeammateDetail"));
const CustomData = lazy(() => import(/* webpackChunkName: "custom-data" */ "./pages/settings/CustomData"));
const CustomObjects = lazy(() => import(/* webpackChunkName: "custom-objects" */ "./pages/settings/customObjects"));
const Teams = lazy(() => import(/* webpackChunkName: "teams" */ "./pages/settings/Teams"));
const Teammates = lazy(() => import(/* webpackChunkName: "teammates" */ "./pages/settings/Teammates"));
const NotFound = lazy(() => import(/* webpackChunkName: "not-found" */ "./pages/NotFound"));
const CreateTeam = lazy(() => import(/* webpackChunkName: "create-team" */ "./pages/settings/CreateTeam"));
const TeamDetail = lazy(() => import(/* webpackChunkName: "team-detail" */ "./pages/settings/TeamDetail"));
const CustomObjectDetail = lazy(() => import(/* webpackChunkName: "custom-object-detail" */ "./pages/settings/customObjects/CustomObjectDetail"));
const CannedResponses = lazy(() => import(/* webpackChunkName: "canned-responses" */ "./pages/settings/CannedResponses"));
const CannedResponseDetail = lazy(() => import(/* webpackChunkName: "canned-response-detail" */ "./pages/settings/CannedResponseDetail"));
const CreateCannedResponse = lazy(() => import(/* webpackChunkName: "create-canned-response" */ "./pages/settings/CreateCannedResponse"));
const Domains = lazy(() => import(/* webpackChunkName: "domains" */ "./pages/settings/email/domains"));
const DomainDetail = lazy(() => import(/* webpackChunkName: "domain-detail" */ "./pages/settings/email/domain-detail"));
const Channels = lazy(() => import(/* webpackChunkName: "channels" */ "./pages/settings/email/channels"));
const CreateChannel = lazy(() => import(/* webpackChunkName: "create-channel" */ "./pages/settings/email/channels/CreateChannel"));
const EmailChannelDetail = lazy(() => import(/* webpackChunkName: "email-channel-detail" */ "./pages/settings/email/channels/EmailChannelDetail"));
const Companies = lazy(() => import(/* webpackChunkName: "companies" */ "./pages/contacts/Companies"));
const CompanyDetail = lazy(() => import(/* webpackChunkName: "company-detail" */ "./pages/contacts/CompanyDetail"));
const ContentCenter = lazy(() => import(/* webpackChunkName: "content-center" */ "./pages/automation/ContentCenter"));
const CreateContent = lazy(() => import(/* webpackChunkName: "create-content" */ "./pages/automation/CreateContent"));
const ContentDetail = lazy(() => import(/* webpackChunkName: "content-detail" */ "./pages/automation/ContentDetail"));
const ActionCenter = lazy(() => import(/* webpackChunkName: "action-center" */ "./pages/automation/ActionCenter"));
const CreateAction = lazy(() => import(/* webpackChunkName: "create-action" */ "./pages/automation/CreateAction"));
const ChatbotProfiles = lazy(() => import(/* webpackChunkName: "chatbot-profiles" */ "./pages/automation/ChatbotProfiles"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const RootComponent = () => {
  const customerToken = getCookie("customerToken");
  return customerToken ? <Navigate to="/home" replace /> : <Navigate to="/sign-in" replace />;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

import CaslProvider from './components/CaslProvider';
import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    console.log('App mounted');
    
    // Log authentication state on start
    const authState = store.getState().auth;
    console.log('Initial auth state:', authState);
  }, []);

  return (
    <Provider store={store}>
      <CaslProvider>
        <RouterProvider router={router} />
        <Toaster />
      </CaslProvider>
    </Provider>
  );
}

export default App;

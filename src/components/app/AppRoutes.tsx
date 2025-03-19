
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LoadingFallback from './LoadingFallback';
import RootRedirect from './RootRedirect';

// Lazy load components with explicit chunk names
const SignIn = lazy(() => import(/* webpackChunkName: "signin" */ "@/pages/SignIn"));
const CreateChatbot = lazy(() => import(/* webpackChunkName: "create-chatbot" */ "@/pages/automation/CreateChatbot"));
const SignUp = lazy(() => import(/* webpackChunkName: "signup" */ "@/pages/SignUp"));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "forgot-password" */ "@/pages/ForgotPassword"));
const Home = lazy(() => import(/* webpackChunkName: "home" */ "@/pages/Dashboard"));
const AllTickets = lazy(() => import(/* webpackChunkName: "all-tickets" */ "@/pages/inbox/All"));
const AllContacts = lazy(() => import(/* webpackChunkName: "all-contacts" */ "@/pages/contacts/All"));
const ContactDetail = lazy(() => import(/* webpackChunkName: "contact-detail" */ "@/pages/contacts/Detail"));
const Tags = lazy(() => import(/* webpackChunkName: "tags" */ "@/pages/settings/Tags"));
const TeammateDetail = lazy(() => import(/* webpackChunkName: "teammate-detail" */ "@/pages/settings/TeammateDetail"));
const CustomData = lazy(() => import(/* webpackChunkName: "custom-data" */ "@/pages/settings/CustomData"));
const CustomObjects = lazy(() => import(/* webpackChunkName: "custom-objects" */ "@/pages/settings/CustomObjects"));
const Teams = lazy(() => import(/* webpackChunkName: "teams" */ "@/pages/settings/Teams"));
const Teammates = lazy(() => import(/* webpackChunkName: "teammates" */ "@/pages/settings/Teammates"));
const CreateTeam = lazy(() => import(/* webpackChunkName: "create-team" */ "@/pages/settings/CreateTeam"));
const TeamDetail = lazy(() => import(/* webpackChunkName: "team-detail" */ "@/pages/settings/TeamDetail"));
const CustomObjectDetail = lazy(() => import(/* webpackChunkName: "custom-object-detail" */ "@/pages/settings/CustomObjectDetail"));
const CannedResponses = lazy(() => import(/* webpackChunkName: "canned-responses" */ "@/pages/settings/CannedResponses"));
const CannedResponseDetail = lazy(() => import(/* webpackChunkName: "canned-response-detail" */ "@/pages/settings/CannedResponseDetail"));
const CreateCannedResponse = lazy(() => import(/* webpackChunkName: "create-canned-response" */ "@/pages/settings/CreateCannedResponse"));
const Domains = lazy(() => import(/* webpackChunkName: "domains" */ "@/pages/settings/email/domains"));
const DomainDetail = lazy(() => import(/* webpackChunkName: "domain-detail" */ "@/pages/settings/email/domain-detail"));
const Channels = lazy(() => import(/* webpackChunkName: "channels" */ "@/pages/settings/email/channels"));
const CreateChannel = lazy(() => import(/* webpackChunkName: "create-channel" */ "@/pages/settings/email/channels/CreateChannel"));
const EmailChannelDetail = lazy(() => import(/* webpackChunkName: "email-channel-detail" */ "@/pages/settings/email/channels/EmailChannelDetail"));
const Companies = lazy(() => import(/* webpackChunkName: "companies" */ "@/pages/contacts/Companies"));
const CompanyDetail = lazy(() => import(/* webpackChunkName: "company-detail" */ "@/pages/contacts/CompanyDetail"));
const ContentCenter = lazy(() => import(/* webpackChunkName: "content-center" */ "@/pages/automation/ContentCenter"));
const CreateContent = lazy(() => import(/* webpackChunkName: "create-content" */ "@/pages/automation/CreateContent"));
const ContentDetail = lazy(() => import(/* webpackChunkName: "content-detail" */ "@/pages/automation/ContentDetail"));
const ActionCenter = lazy(() => import(/* webpackChunkName: "action-center" */ "@/pages/automation/ActionCenter"));
const CreateAction = lazy(() => import(/* webpackChunkName: "create-action" */ "@/pages/automation/CreateAction"));
const ChatbotProfiles = lazy(() => import(/* webpackChunkName: "chatbot-profiles" */ "@/pages/automation/ChatbotProfiles"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/home/inbox/all" replace />} />
          <Route path="inbox/all" element={<AllTickets />} />
          <Route path="contacts/all" element={<AllContacts />} />
          <Route path="contacts/companies" element={<Companies />} />
          <Route path="contacts/companies/:id" element={<CompanyDetail />} />
          <Route path="contacts/:id" element={<ContactDetail />} />
          <Route path="settings/tags" element={<Tags />} />
          <Route path="settings/teams" element={<Teams />} />
          <Route path="settings/teams/create" element={<CreateTeam />} />
          <Route path="settings/teammates" element={<Teammates />} />
          <Route path="settings/teammates/:id" element={<TeammateDetail />} />
          <Route path="settings/teams/:id" element={<TeamDetail />} />
          <Route path="settings/custom-data" element={<CustomData />} />
          <Route path="settings/custom-objects" element={<CustomObjects />} />
          <Route path="settings/custom-objects/:id" element={<CustomObjectDetail />} />
          <Route path="settings/canned-responses" element={<CannedResponses />} />
          <Route path="settings/canned-responses/create" element={<CreateCannedResponse />} />
          <Route path="settings/canned-responses/:id" element={<CannedResponseDetail />} />
          <Route path="settings/email/domains" element={<Domains />} />
          <Route path="settings/email/domains/:id" element={<DomainDetail />} />
          <Route path="settings/email/channels" element={<Channels />} />
          <Route path="settings/email/channels/create" element={<CreateChannel />} />
          <Route path="settings/email/channels/:id" element={<EmailChannelDetail />} />
          <Route path="automation/ai/content-center" element={<ContentCenter />} />
          <Route path="automation/ai/content-center/create" element={<CreateContent />} />
          <Route path="automation/ai/content-center/:id" element={<ContentDetail />} />
          <Route path="automation/ai/action-center" element={<ActionCenter />} />
          <Route path="automation/ai/action-center/create" element={<CreateAction />} />
          <Route path="automation/ai/chatbot-profiles" element={<ChatbotProfiles />} />
          <Route path="automation/ai/chatbot-profiles/create" element={<CreateChatbot />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

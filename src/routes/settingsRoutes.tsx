
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingFallback from '../components/app/LoadingFallback';

// Lazy-load settings pages
const Tags = lazy(() => import('../pages/settings/Tags'));
const Teams = lazy(() => import('../pages/settings/Teams'));
const TeamDetail = lazy(() => import('../pages/settings/TeamDetail'));
const CreateTeam = lazy(() => import('../pages/settings/CreateTeam'));
const EditTeam = lazy(() => import('../pages/settings/EditTeam'));
const Teammates = lazy(() => import('../pages/settings/teammates/TeammatesPage'));
const TeammateDetail = lazy(() => import('../pages/settings/teammates/TeammateDetail'));
const CannedResponses = lazy(() => import('../pages/settings/CannedResponses'));
const CannedResponseDetail = lazy(() => import('../pages/settings/CannedResponseDetail'));
const CreateCannedResponse = lazy(() => import('../pages/settings/CreateCannedResponse'));
const CustomData = lazy(() => import('../pages/settings/CustomData'));
const CustomObjects = lazy(() => import('../pages/settings/CustomObjects'));
const CustomObjectDetail = lazy(() => import('../pages/settings/CustomObjectDetail'));
const AutoReply = lazy(() => import('../pages/settings/AutoReply'));
const AutoQA = lazy(() => import('../pages/settings/AutoQA'));
const Topics = lazy(() => import('../pages/settings/Topics'));
const Sentiment = lazy(() => import('../pages/settings/Sentiment'));
const ChatSettings = lazy(() => import('../pages/settings/chat/ChatSettings'));

const SettingsRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/settings/tags" replace />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/create" element={<CreateTeam />} />
        <Route path="/teams/:teamId" element={<TeamDetail />} />
        <Route path="/teams/:teamId/edit" element={<EditTeam />} />
        <Route path="/teammates" element={<Teammates />} />
        <Route path="/teammates/:teammateId" element={<TeammateDetail />} />
        <Route path="/canned-responses" element={<CannedResponses />} />
        <Route path="/canned-responses/create" element={<CreateCannedResponse />} />
        <Route path="/canned-responses/:responseId" element={<CannedResponseDetail />} />
        <Route path="/custom-data" element={<CustomData />} />
        <Route path="/custom-objects" element={<CustomObjects />} />
        <Route path="/custom-objects/:objectId" element={<CustomObjectDetail />} />
        <Route path="/auto-reply" element={<AutoReply />} />
        <Route path="/auto-qa" element={<AutoQA />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/sentiment" element={<Sentiment />} />
        <Route path="/chat" element={<ChatSettings />} />
      </Routes>
    </Suspense>
  );
};

export default SettingsRoutes;

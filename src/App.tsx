import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Inbox from './pages/Inbox';
import Contacts from './pages/Contacts';
import Automation from './pages/Automation';
import Reporting from './pages/Reporting';
import Settings from './pages/Settings';
import YourInbox from './pages/inbox/YourInbox';
import Mentions from './pages/inbox/Mentions';
import All from './pages/inbox/All';
import Unassigned from './pages/inbox/Unassigned';
import Teams from './pages/inbox/Teams';
import Teammates from './pages/inbox/Teammates';
import AllContacts from './pages/contacts/AllContacts';
import Visitors from './pages/contacts/Visitors';
import Customers from './pages/contacts/Customers';
import Companies from './pages/contacts/Companies';
import ContentCenter from './pages/automation/ContentCenter';
import ChatbotProfiles from './pages/automation/ChatbotProfiles';
import ActionCenter from './pages/automation/ActionCenter';
import Workflows from './pages/automation/Workflows';
import WorkflowTemplates from './pages/automation/WorkflowTemplates';
import Domains from './pages/settings/email/Domains';
import ManageChannels from './pages/settings/email/ManageChannels';
import CustomObjects from './pages/settings/CustomObjects';
import CustomData from './pages/settings/CustomData';
import Tags from './pages/settings/Tags';
import Topics from './pages/settings/Topics';
import CannedResponses from './pages/settings/CannedResponses';
import AutoQA from './pages/settings/AutoQA';
import AutoReply from './pages/settings/AutoReply';
import Sentiment from './pages/settings/Sentiment';
import CreateAction from './pages/automation/create-action/CreateAction';
import ActionDetail from './pages/automation/ActionDetail';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "inbox",
        element: <Inbox />,
        children: [
          {
            path: "your-inbox",
            element: <YourInbox />,
          },
          {
            path: "mentions",
            element: <Mentions />,
          },
          {
            path: "all",
            element: <All />,
          },
          {
            path: "unassigned",
            element: <Unassigned />,
          },
          {
            path: "teams",
            element: <Teams />,
          },
          {
            path: "teammates",
            element: <Teammates />,
          },
        ]
      },
      {
        path: "contacts",
        element: <Contacts />,
        children: [
          {
            path: "all",
            element: <AllContacts />,
          },
          {
            path: "visitors",
            element: <Visitors />,
          },
          {
            path: "customers",
            element: <Customers />,
          },
          {
            path: "companies",
            element: <Companies />,
          },
        ]
      },
      {
        path: "automation",
        element: <Automation />,
        children: [
          {
            path: "ai/content-center",
            element: <ContentCenter />,
          },
          {
            path: "ai/chatbot-profiles",
            element: <ChatbotProfiles />,
          },
          {
            path: "ai/action-center",
            element: <ActionCenter />,
          },
          {
            path: "workflows",
            element: <Workflows />,
          },
          {
            path: "workflow-templates",
            element: <WorkflowTemplates />,
          },
          {
            path: "create-action",
            element: <CreateAction />,
          },
        ]
      },
      {
        path: "reporting",
        element: <Reporting />,
      },
      {
        path: "settings",
        element: <Settings />,
        children: [
          {
            path: "email/domains",
            element: <Domains />,
          },
          {
            path: "email/channels",
            element: <ManageChannels />,
          },
          {
            path: "custom-objects",
            element: <CustomObjects />,
          },
          {
            path: "custom-data",
            element: <CustomData />,
          },
          {
            path: "tags",
            element: <Tags />,
          },
          {
            path: "topics",
            element: <Topics />,
          },
          {
            path: "canned-responses",
            element: <CannedResponses />,
          },
          {
            path: "autoqa",
            element: <AutoQA />,
          },
          {
            path: "auto-reply",
            element: <AutoReply />,
          },
          {
            path: "sentiment",
            element: <Sentiment />,
          },
        ]
      },
    ],
  },
  {
    path: "/home/automation/ai/action-center/:id",
    element: <ActionDetail />,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;

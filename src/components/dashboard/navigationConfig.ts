
import { 
  Home, 
  MessageSquare, 
  Settings, 
  Users, 
  Building, 
  Bot, 
  FileText,
  Tag,
  GitBranch,
  Mail,
  MessageCircle,
  BellRing,
  Hash,
  Workflow,
  PenTool,
  Archive,
  Database,
  Bot as BotIcon
} from 'lucide-react';

export const mainNavItems = [
  {
    title: 'Home',
    icon: Home,
    path: '/home',
    key: 'home'
  },
  {
    title: 'Inbox',
    icon: MessageSquare,
    path: '/home/inbox/all',
    key: 'inbox'
  },
  {
    title: 'Contacts',
    icon: Users,
    path: '/home/contacts',
    key: 'contacts'
  },
  {
    title: 'Companies',
    icon: Building,
    path: '/home/companies',
    key: 'companies'
  },
  {
    title: 'Automation',
    icon: Bot,
    path: '/home/automation',
    key: 'automation'
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/home/settings',
    key: 'settings'
  }
];

export const subNavItems = {
  inbox: [
    {
      title: 'Channels',
      subItems: [
        {
          title: 'All Tickets',
          path: '/home/inbox/all',
          key: 'all'
        },
        {
          title: 'Your Inbox',
          path: '/home/inbox/your-inbox',
          key: 'your-inbox'
        },
        {
          title: 'Unassigned',
          path: '/home/inbox/unassigned',
          key: 'unassigned'
        },
        {
          title: 'Mentions',
          path: '/home/inbox/mentions',
          key: 'mentions'
        }
      ]
    },
    {
      title: 'Channels',
      subItems: [
        {
          title: 'Email',
          path: '/home/inbox/channel/email',
          key: 'email'
        },
        {
          title: 'Chat',
          path: '/home/inbox/channel/chat',
          key: 'chat'
        }
      ]
    }
  ],
  settings: [
    {
      title: 'Team',
      subItems: [
        {
          title: 'Teammates',
          path: '/home/settings/teammates',
          key: 'teammates'
        },
        {
          title: 'Teams',
          path: '/home/settings/teams',
          key: 'teams'
        }
      ]
    },
    {
      title: 'Workspace',
      subItems: [
        {
          title: 'Tags',
          path: '/home/settings/tags',
          key: 'tags'
        },
        {
          title: 'Custom Data',
          path: '/home/settings/custom-data',
          key: 'custom-data'
        },
        {
          title: 'Canned Responses',
          path: '/home/settings/canned-responses',
          key: 'canned-responses'
        }
      ]
    }
  ],
  automation: [
    {
      title: 'AI',
      subItems: [
        {
          title: 'Content',
          path: '/home/automation/ai/content',
          key: 'content'
        },
        {
          title: 'Chatbot Profiles',
          path: '/home/automation/ai/chatbot-profiles',
          key: 'chatbot-profiles'
        },
        {
          title: 'Actions',
          path: '/home/automation/ai/actions',
          key: 'actions'
        }
      ]
    },
    {
      title: 'Workflow',
      subItems: [
        {
          title: 'Rules',
          path: '/home/automation/workflow/rules',
          key: 'rules'
        },
        {
          title: 'Triggers',
          path: '/home/automation/workflow/triggers',
          key: 'triggers'
        }
      ]
    }
  ]
};

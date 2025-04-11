import {
  Home,
  Inbox,
  Users,
  Bot,
  BarChart,
  Settings,
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
  Activity,
  MessageSquare,
  Globe,
  MessageCircleCode
} from 'lucide-react';

export const mainNavItems = [
  { id: 'home', title: 'Home', icon: Home, path: '/home' },
  { id: 'inbox', title: 'Inbox', icon: Inbox, path: '/home/inbox' },
  { id: 'contacts', title: 'Contacts', icon: Users, path: '/home/contacts' },
  { id: 'automation', title: 'AI & Automation', icon: Bot, path: '/home/automation' },
  { id: 'reporting', title: 'Reporting', icon: BarChart, path: '/home/reporting' },
  { id: 'settings', title: 'Settings', icon: Settings, path: '/home/settings' },
  { id: 'ably-test', title: 'Chat Test', icon: MessageCircleCode, path: '/ably-test' }
];

export const subNavItems = {
  inbox: [
    { title: 'Your Inbox', icon: InboxIcon, path: '/home/inbox/your-inbox' },
    { title: 'Mentions', icon: AtSign, path: '/home/inbox/mentions' },
    { title: 'All', icon: ListFilter, path: '/home/inbox/all' },
    { title: 'Unassigned', icon: MessageSquare, path: '/home/inbox/unassigned' },
    {
      title: 'Teams',
      icon: UsersRound,
      children: [
        // { title: 'All Teams', path: '/home/inbox/teams' },
      ],
      loadDynamicChildren: true,
    },
    {
      title: 'Teammates',
      icon: User,
      children: [],
      loadDynamicChildren: true,
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
        { title: 'Content Center', path: '/home/automation/ai/content-center' },
        { title: 'Chatbot Profiles', path: '/home/automation/ai/chatbot-profiles' },
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
        { title: 'Manage Channels', path: '/home/settings/email/channels' }
      ]
    },
    { title: 'Custom Objects', icon: Database, path: '/home/settings/custom-objects' },
    { title: 'Custom Data', icon: Database, path: '/home/settings/custom-data' },
    { title: 'Tags', icon: Tags, path: '/home/settings/tags' },
    { title: 'Topics', icon: MessageCircle, path: '/home/settings/topics' },
    { title: 'Canned Responses', icon: Reply, path: '/home/settings/canned-responses' },
    { title: 'Sentiment', icon: Activity, path: '/home/settings/sentiment' },
    { title: 'AutoQA', icon: Brain, path: '/home/settings/autoqa' },
    { title: 'Auto Reply', icon: Reply, path: '/home/settings/auto-reply' }
  ]
};

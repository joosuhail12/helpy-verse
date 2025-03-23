
import React from 'react';
import { Inbox, User, Building2, Cog } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmptyDashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { title: 'Inbox', description: 'Manage all your customer conversations', icon: <Inbox className="h-5 w-5" />, path: '/home/inbox/all' },
    { title: 'Contacts', description: 'View and manage your customer contacts', icon: <User className="h-5 w-5" />, path: '/home/contacts' },
    { title: 'Companies', description: 'Organize contacts by companies', icon: <Building2 className="h-5 w-5" />, path: '/home/companies' },
    { title: 'Settings', description: 'Configure your workspace settings', icon: <Cog className="h-5 w-5" />, path: '/home/settings/profile' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((link, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                {link.icon}
              </div>
              <CardTitle className="text-lg">{link.title}</CardTitle>
              <CardDescription>{link.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate(link.path)}
              >
                Open {link.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmptyDashboard;


import React from 'react';
import { useContactInfo } from '@/hooks/useContactInfo';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Building, Calendar, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContactContextPanelProps {
  contactId: string | null;
}

const ContactContextPanel: React.FC<ContactContextPanelProps> = ({ contactId }) => {
  const { contact, conversationHistory, isLoading, error } = useContactInfo(contactId);

  if (!contactId) {
    return (
      <div className="p-4 text-center text-gray-500">
        <User className="h-8 w-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No contact information available</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="info">Contact Info</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 mt-4">
          {contact && (
            <>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{contact.firstname} {contact.lastname}</h3>
                  <p className="text-xs text-gray-500">{contact.email}</p>
                </div>
              </div>
              
              <Card className="p-3 space-y-3">
                {contact.company && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>{contact.company}</span>
                  </div>
                )}
                
                {contact.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                
                {contact.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{contact.email}</span>
                  </div>
                )}
                
                {contact.lastContacted && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Last contact: {formatDistanceToNow(new Date(contact.lastContacted), { addSuffix: true })}</span>
                  </div>
                )}
              </Card>
              
              {contact.notes && (
                <Card className="p-3">
                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                  <p className="text-xs text-gray-600">{contact.notes}</p>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="pt-4">
          <h3 className="text-sm font-medium mb-3">Previous Conversations</h3>
          {conversationHistory.length > 0 ? (
            <div className="space-y-3">
              {conversationHistory.map(conversation => (
                <Card key={conversation.id} className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">{conversation.title}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {conversation.status}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>{conversation.messageCount} messages</span>
                    <span className="mx-2">•</span>
                    <span>{formatDistanceToNow(new Date(conversation.lastMessageDate), { addSuffix: true })}</span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No previous conversations found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactContextPanel;

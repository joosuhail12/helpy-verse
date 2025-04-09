
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Info, 
  Globe, 
  MessageSquare, 
  Mail, 
  Clock, 
  User, 
  FileText, 
  AlertCircle, 
  Users, 
  Database, 
  Ticket, 
  Repeat 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Define interfaces with correct syntax
interface Trigger {
  id: string;
  name: string;
  description: string;
}

interface TriggerCategory {
  category: string;
  triggers: Trigger[];
}

interface CreateWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const triggerCategories: TriggerCategory[] = [
  {
    category: "Customer Events",
    triggers: [
      { id: 'page_visit', name: 'Contact Visits Page', description: 'Triggered when a contact visits a page.' },
      { id: 'new_convo', name: 'New Conversation Started', description: 'When a contact opens a new conversation.' },
      { id: 'customer_message', name: 'Customer Sends Message', description: 'Triggered when the contact sends any message.' },
      { id: 'customer_unresponsive', name: 'Contact Becomes Unresponsive', description: 'When a contact hasn't replied in a while.' }
    ]
  },
  {
    category: "Teammate Actions",
    triggers: [
      { id: 'teammate_message', name: 'Teammate Sends Message', description: 'When a teammate sends any message.' },
      { id: 'note_added', name: 'Note Added to Conversation', description: 'When a teammate adds a note.' },
      { id: 'assignment_change', name: 'Conversation Reassigned', description: 'When a teammate changes assignment.' },
      { id: 'agent_unresponsive', name: 'Teammate Becomes Unresponsive', description: 'When a teammate hasn't replied in a while.' },
      { id: 'data_change', name: 'Contact or Ticket Data Changed', description: 'When any field is updated.' }
    ]
  },
  {
    category: "System Events",
    triggers: [
      { id: 'ticket_created', name: 'Ticket Created', description: 'When a new ticket is created in the system.' },
      { id: 'reusable_workflow', name: 'Reusable Workflow Triggered', description: 'Triggered by another workflow.' }
    ]
  }
];

const getTriggerIcon = (triggerId: string) => {
  switch (triggerId) {
    case 'page_visit': return <Globe className="h-5 w-5 text-primary/70" />;
    case 'new_convo': return <MessageSquare className="h-5 w-5 text-primary/70" />;
    case 'customer_message': return <Mail className="h-5 w-5 text-primary/70" />;
    case 'customer_unresponsive': return <Clock className="h-5 w-5 text-primary/70" />;
    case 'teammate_message': return <User className="h-5 w-5 text-primary/70" />;
    case 'note_added': return <FileText className="h-5 w-5 text-primary/70" />;
    case 'assignment_change': return <Users className="h-5 w-5 text-primary/70" />;
    case 'agent_unresponsive': return <AlertCircle className="h-5 w-5 text-primary/70" />;
    case 'data_change': return <Database className="h-5 w-5 text-primary/70" />;
    case 'ticket_created': return <Ticket className="h-5 w-5 text-primary/70" />;
    case 'reusable_workflow': return <Repeat className="h-5 w-5 text-primary/70" />;
    default: return <Info className="h-5 w-5 text-primary/70" />;
  }
};

const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleTriggerSelect = (triggerId: string) => {
    navigate(`/workflows/new?trigger=${triggerId}`);
  };

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return triggerCategories;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return triggerCategories
      .map(category => ({
        ...category,
        triggers: category.triggers.filter(trigger => 
          trigger.name.toLowerCase().includes(lowerSearchTerm) || 
          trigger.description.toLowerCase().includes(lowerSearchTerm)
        )
      }))
      .filter(category => category.triggers.length > 0);
  }, [searchTerm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-xl">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold leading-none">
            Start a new workflow
          </DialogTitle>
          <DialogDescription className="text-base mt-1.5">
            Choose a trigger to begin automation
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 h-10"
              placeholder="Search triggers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-1 pb-2">
            {filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-lg font-medium text-muted-foreground">No triggers found</p>
                <p className="text-sm text-muted-foreground">Try another search term</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.category} className="space-y-3">
                  <h3 className="font-medium text-lg text-foreground">{category.category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {category.triggers.map((trigger) => (
                      <TooltipProvider key={trigger.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="group rounded-xl border p-4 cursor-pointer hover:bg-muted/10 transition-colors flex flex-col"
                              onClick={() => handleTriggerSelect(trigger.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  {getTriggerIcon(trigger.id)}
                                  <div>
                                    <h4 className="font-medium text-base">{trigger.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{trigger.description}</p>
                                  </div>
                                </div>
                                <div className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Info className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p>{trigger.description}</p>
                            <p className="text-xs mt-1 text-muted-foreground">Click to select this trigger</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkflowModal;

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Repeat,
  Zap,
  ChevronRight,
  Star
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
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
  onClose?: () => void;
  onWorkflowCreated?: (workflow: any) => void;
}

const triggerCategories: TriggerCategory[] = [
  {
    category: "Customer Events",
    triggers: [
      { id: 'page_visit', name: 'Contact Visits Page', description: 'Triggered when a contact visits a page.' },
      { id: 'new_convo', name: 'New Conversation Started', description: 'When a contact opens a new conversation.' },
      { id: 'customer_message', name: 'Customer Sends Message', description: 'Triggered when the contact sends any message.' },
      { id: 'customer_unresponsive', name: 'Contact Becomes Unresponsive', description: 'When a contact hasn\'t replied in a while.' }
    ]
  },
  {
    category: "Teammate Actions",
    triggers: [
      { id: 'teammate_message', name: 'Teammate Sends Message', description: 'When a teammate sends any message.' },
      { id: 'note_added', name: 'Note Added to Conversation', description: 'When a teammate adds a note.' },
      { id: 'assignment_change', name: 'Conversation Reassigned', description: 'When a teammate changes assignment.' },
      { id: 'agent_unresponsive', name: 'Teammate Becomes Unresponsive', description: 'When a teammate hasn\'t replied in a while.' },
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
    case 'page_visit': return <Globe className="h-5 w-5 text-blue-500" />;
    case 'new_convo': return <MessageSquare className="h-5 w-5 text-green-500" />;
    case 'customer_message': return <Mail className="h-5 w-5 text-violet-500" />;
    case 'customer_unresponsive': return <Clock className="h-5 w-5 text-amber-500" />;
    case 'teammate_message': return <User className="h-5 w-5 text-teal-500" />;
    case 'note_added': return <FileText className="h-5 w-5 text-indigo-500" />;
    case 'assignment_change': return <Users className="h-5 w-5 text-pink-500" />;
    case 'agent_unresponsive': return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'data_change': return <Database className="h-5 w-5 text-cyan-500" />;
    case 'ticket_created': return <Ticket className="h-5 w-5 text-orange-500" />;
    case 'reusable_workflow': return <Repeat className="h-5 w-5 text-purple-500" />;
    default: return <Info className="h-5 w-5 text-primary/70" />;
  }
};

const getTriggerGradient = (triggerId: string) => {
  switch (triggerId) {
    case 'page_visit': return 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10';
    case 'new_convo': return 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10';
    case 'customer_message': return 'from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-900/10';
    case 'customer_unresponsive': return 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10';
    case 'teammate_message': return 'from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10';
    case 'note_added': return 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10';
    case 'assignment_change': return 'from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-900/10';
    case 'agent_unresponsive': return 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10';
    case 'data_change': return 'from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-900/10';
    case 'ticket_created': return 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10';
    case 'reusable_workflow': return 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10';
    default: return 'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-900/10';
  }
};

const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({ 
  open, 
  onOpenChange, 
  onClose, 
  onWorkflowCreated 
}) => {
  console.log('CreateWorkflowModal rendered with open:', open);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [recentTriggers, setRecentTriggers] = useLocalStorage<string[]>('recent-workflow-triggers', []);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [focusedTriggerIndex, setFocusedTriggerIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const allTriggers = useMemo(() => {
    const recent = recentTriggers
      .map(id => {
        for (const category of triggerCategories) {
          const trigger = category.triggers.find(t => t.id === id);
          if (trigger) {
            return { ...trigger, category: category.category };
          }
        }
        return null;
      })
      .filter(Boolean) as (Trigger & { category: string })[];
    
    const regular = triggerCategories.flatMap(category => 
      category.triggers.map(trigger => ({ ...trigger, category: category.category }))
    );
    
    return [
      ...recent,
      ...regular.filter(t => !recent.some(r => r?.id === t.id))
    ];
  }, [recentTriggers]);

  const filteredCategories = useMemo(() => {
    let categories = [...triggerCategories];
    
    if (recentTriggers.length > 0) {
      const recentTriggerObjects = recentTriggers
        .map(id => {
          for (const category of triggerCategories) {
            const trigger = category.triggers.find(t => t.id === id);
            if (trigger) return trigger;
          }
          return null;
        })
        .filter(Boolean) as Trigger[];
      
      if (recentTriggerObjects.length > 0) {
        categories = [
          { category: "Recently Used", triggers: recentTriggerObjects },
          ...categories
        ];
      }
    }

    if (!searchTerm.trim()) {
      return categories;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return categories
      .map(category => ({
        ...category,
        triggers: category.triggers.filter(trigger => 
          trigger.name.toLowerCase().includes(lowerSearchTerm) || 
          trigger.description.toLowerCase().includes(lowerSearchTerm)
        )
      }))
      .filter(category => category.triggers.length > 0);
  }, [searchTerm, recentTriggers]);

  const handleTriggerSelect = (triggerId: string) => {
    console.log('Trigger selected:', triggerId);
    
    setSelectedTrigger(triggerId);
    
    const updatedRecent = [
      triggerId,
      ...recentTriggers.filter(id => id !== triggerId)
    ].slice(0, 3);
    setRecentTriggers(updatedRecent);

    toast.success("Workflow trigger selected", {
      description: "Creating new workflow...",
      duration: 2000,
    });
    
    setTimeout(() => {
      navigate(`/workflows/new?trigger=${triggerId}`);
      if (onClose) onClose();
    }, 300);
  };

  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const visibleTriggers = allTriggers.filter(trigger => {
        if (!searchTerm) return true;
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          trigger.name.toLowerCase().includes(lowerSearchTerm) ||
          trigger.description.toLowerCase().includes(lowerSearchTerm)
        );
      });
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedTriggerIndex(prev => {
            const nextIndex = prev < visibleTriggers.length - 1 ? prev + 1 : 0;
            const triggerId = visibleTriggers[nextIndex]?.id;
            if (triggerId && triggerRefs.current.has(triggerId)) {
              triggerRefs.current.get(triggerId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            return nextIndex;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedTriggerIndex(prev => {
            const nextIndex = prev > 0 ? prev - 1 : visibleTriggers.length - 1;
            const triggerId = visibleTriggers[nextIndex]?.id;
            if (triggerId && triggerRefs.current.has(triggerId)) {
              triggerRefs.current.get(triggerId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            return nextIndex;
          });
          break;
        case 'Enter':
          if (focusedTriggerIndex >= 0 && focusedTriggerIndex < visibleTriggers.length) {
            handleTriggerSelect(visibleTriggers[focusedTriggerIndex].id);
          }
          break;
        case 'Escape':
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, focusedTriggerIndex, searchTerm, allTriggers]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-xl">
        <DialogHeader className="p-8 pb-6 border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <DialogTitle className="text-2xl font-semibold leading-none">
              Start a new workflow
            </DialogTitle>
          </div>
          <DialogDescription className="text-base mt-2 max-w-md">
            Choose a trigger to begin your automation journey. Triggers are events that start your workflow.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6">
          <div className="relative mb-6 transition-all duration-300 group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              ref={searchInputRef}
              className="pl-10 h-10 pr-4 focus-visible:ring-primary/20 focus-visible:ring-offset-0 transition-all duration-300 border-primary/20 group-focus-within:border-primary/30 shadow-sm group-focus-within:shadow-md"
              placeholder="Search triggers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setFocusedTriggerIndex(-1);
              }}
            />
          </div>

          <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-1 pb-2 scroll-smooth">
            {filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 rounded-full bg-muted mb-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-muted-foreground">No triggers found</p>
                <p className="text-sm text-muted-foreground mt-1">Try another search term</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.category} className="space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg text-foreground">{category.category}</h3>
                    {category.category === "Recently Used" && (
                      <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.triggers.map((trigger) => {
                      const triggerIndex = allTriggers.findIndex(t => t.id === trigger.id);
                      
                      return (
                        <TooltipProvider key={trigger.id}>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                              <div
                                ref={(el) => {
                                  if (el) triggerRefs.current.set(trigger.id, el);
                                }}
                                className={cn(
                                  "group rounded-xl border p-4 cursor-pointer transition-all duration-300",
                                  "hover:border-primary/40 hover:shadow-md",
                                  "bg-gradient-to-br bg-opacity-50",
                                  getTriggerGradient(trigger.id),
                                  focusedTriggerIndex === triggerIndex && "ring-2 ring-primary/40 ring-offset-1",
                                  selectedTrigger === trigger.id && "border-primary scale-[0.98] bg-primary/5"
                                )}
                                onClick={() => handleTriggerSelect(trigger.id)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleTriggerSelect(trigger.id);
                                  }
                                }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex gap-3">
                                    <div className={cn(
                                      "p-2 rounded-full shrink-0",
                                      "bg-white/80 dark:bg-gray-800/50",
                                      "shadow-sm group-hover:shadow transition-all duration-300"
                                    )}>
                                      {getTriggerIcon(trigger.id)}
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-base">{trigger.name}</h4>
                                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{trigger.description}</p>
                                    </div>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5 transition-transform duration-300" />
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p className="font-medium">{trigger.name}</p>
                              <p className="text-sm mt-1">{trigger.description}</p>
                              <p className="text-xs mt-2 text-muted-foreground">Press Enter to select</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="px-6 py-4 border-t bg-muted/30 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded text-xs font-mono bg-background border">↑</kbd>
            <kbd className="px-2 py-1 rounded text-xs font-mono bg-background border">↓</kbd>
            <span className="mr-3">to navigate</span>
            
            <kbd className="px-2 py-1 rounded text-xs font-mono bg-background border">Enter</kbd>
            <span>to select</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkflowModal;

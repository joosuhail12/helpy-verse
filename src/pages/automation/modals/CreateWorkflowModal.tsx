import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
  ChevronDown,
  ChevronUp,
  Star,
  HelpCircle
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDebounce } from '@/hooks/useDebounce';

interface Trigger {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  examples?: string[];
}

interface TriggerCategory {
  category: string;
  description: string;
  triggers: Trigger[];
  icon?: React.ReactNode;
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
    description: "Triggers based on customer actions and behaviors",
    icon: <Users className="h-4 w-4 text-blue-400" />,
    triggers: [
      { 
        id: 'page_visit', 
        name: 'Contact Visits Page', 
        description: 'Triggered when a contact visits a page.',
        longDescription: 'Start a workflow when a customer visits specific pages of your website. Useful for tracking customer journey and engagement.',
        examples: ['Send a follow-up email after a customer visits the pricing page', 'Create a ticket when a customer visits the help documentation multiple times']
      },
      { 
        id: 'new_convo', 
        name: 'New Conversation Started', 
        description: 'When a contact opens a new conversation.',
        longDescription: 'Automatically run actions when a customer starts a new conversation with your company across any channel.',
        examples: ['Assign conversations to specific teams based on customer attributes', 'Send an automatic greeting message when a conversation starts']
      },
      { 
        id: 'customer_message', 
        name: 'Customer Sends Message', 
        description: 'Triggered when the contact sends any message.',
        longDescription: 'React to customer messages with automated workflows. Useful for message routing, categorization, and automated responses.',
        examples: ['Detect message sentiment and tag conversations accordingly', 'Route messages to specific departments based on content analysis']
      },
      { 
        id: 'customer_unresponsive', 
        name: 'Contact Becomes Unresponsive', 
        description: 'When a contact hasn\'t replied in a while.',
        longDescription: 'Detect when customers go silent and take proactive actions to re-engage them before it\'s too late.',
        examples: ['Send a follow-up after 48 hours of no response', 'Create a task for account managers when high-value customers go quiet']
      }
    ]
  },
  {
    category: "Teammate Actions",
    description: "Triggers based on your team members' activities",
    icon: <User className="h-4 w-4 text-green-400" />,
    triggers: [
      { 
        id: 'teammate_message', 
        name: 'Teammate Sends Message', 
        description: 'When a teammate sends any message.',
        longDescription: 'Trigger workflows when your team communicates with customers to ensure consistent follow-up and quality control.',
        examples: ['Create follow-up tasks when a sales rep sends a quote', 'Log customer interactions to your CRM']
      },
      { 
        id: 'note_added', 
        name: 'Note Added to Conversation', 
        description: 'When a teammate adds a note.',
        longDescription: 'Start workflows when internal notes are added to conversations, perfect for team collaboration and process automation.',
        examples: ['Alert managers when urgent notes are added', 'Create tasks from notes containing specific keywords']
      },
      { 
        id: 'assignment_change', 
        name: 'Conversation Reassigned', 
        description: 'When a teammate changes assignment.',
        longDescription: 'Automate handoffs between team members and departments when conversations are reassigned.',
        examples: ['Send a notification when a conversation is reassigned to a new team', 'Update CRM records when case ownership changes']
      },
      { 
        id: 'agent_unresponsive', 
        name: 'Teammate Becomes Unresponsive', 
        description: 'When a teammate hasn\'t replied in a while.',
        longDescription: 'Ensure timely responses by creating escalation workflows when team members don\'t respond quickly enough.',
        examples: ['Escalate to a manager if a customer query isn\'t answered within 4 hours', 'Reassign conversations when agents are unavailable']
      },
      { 
        id: 'data_change', 
        name: 'Contact or Ticket Data Changed', 
        description: 'When any field is updated.',
        longDescription: 'Respond to changes in customer data or ticket information with automated workflows.',
        examples: ['Send onboarding emails when customer status changes to "active"', 'Alert account managers when customer risk level increases']
      }
    ]
  },
  {
    category: "System Events",
    description: "Triggers based on system activities and changes",
    icon: <Database className="h-4 w-4 text-purple-400" />,
    triggers: [
      { 
        id: 'ticket_created', 
        name: 'Ticket Created', 
        description: 'When a new ticket is created in the system.',
        longDescription: 'Automate your response to new support tickets, ensuring consistent handling and prioritization.',
        examples: ['Categorize and tag new tickets based on content', 'Assign priority levels based on customer tier']
      },
      { 
        id: 'reusable_workflow', 
        name: 'Reusable Workflow Triggered', 
        description: 'Triggered by another workflow.',
        longDescription: 'Create modular workflows that can be called by other workflows, allowing for reusable automation components.',
        examples: ['Create a reusable "escalation" workflow that can be triggered by multiple other workflows', 'Build a central "data sync" workflow that can be triggered by various customer events']
      }
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
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const navigate = useNavigate();
  const [recentTriggers, setRecentTriggers] = useLocalStorage<string[]>('recent-workflow-triggers', []);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [focusedTriggerIndex, setFocusedTriggerIndex] = useState<number>(-1);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Recently Used"]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationError, setNavigationError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const triggersPerPage = 8;
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const allTriggers = useMemo(() => {
    const triggers: (Trigger & { category: string })[] = [];
    
    triggerCategories.forEach(category => {
      category.triggers.forEach(trigger => {
        triggers.push({
          ...trigger,
          category: category.category
        });
      });
    });
    
    return triggers;
  }, []);

  const recentTriggersSection = useMemo(() => {
    if (recentTriggers.length === 0) return null;
    
    const recentTriggerObjects = recentTriggers
      .map(id => {
        const trigger = allTriggers.find(t => t.id === id);
        return trigger ? { ...trigger } : null;
      })
      .filter(Boolean) as (Trigger & { category: string })[];
    
    if (recentTriggerObjects.length === 0) return null;
    
    return {
      category: "Recently Used",
      description: "Your previously selected workflow triggers",
      icon: <Star className="h-4 w-4 text-amber-400" />,
      triggers: recentTriggerObjects
    };
  }, [recentTriggers, allTriggers]);

  const filteredTriggers = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return allTriggers;
    }

    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    
    return allTriggers.filter(trigger => 
      trigger.name.toLowerCase().includes(lowerSearchTerm) || 
      trigger.description.toLowerCase().includes(lowerSearchTerm) ||
      (trigger.longDescription && trigger.longDescription.toLowerCase().includes(lowerSearchTerm))
    );
  }, [allTriggers, debouncedSearchTerm]);

  const filteredCategories = useMemo(() => {
    let categories = [...triggerCategories];
    
    if (debouncedSearchTerm.trim()) {
      return categories.map(category => ({
        ...category,
        triggers: category.triggers.filter(trigger => 
          filteredTriggers.some(ft => ft.id === trigger.id)
        )
      })).filter(category => category.triggers.length > 0);
    }
    
    if (recentTriggersSection) {
      categories = [recentTriggersSection, ...categories];
    }
    
    return categories;
  }, [triggerCategories, filteredTriggers, debouncedSearchTerm, recentTriggersSection]);

  const paginatedCategories = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return filteredCategories;
    }
    
    const startIdx = (currentPage - 1) * triggersPerPage;
    const endIdx = startIdx + triggersPerPage;
    
    const allFilteredTriggers = filteredCategories.flatMap(category => 
      category.triggers.map(trigger => ({ ...trigger, category: category.category }))
    );
    
    const paginatedTriggers = allFilteredTriggers.slice(startIdx, endIdx);
    
    const groupedTriggers: Record<string, Trigger[]> = {};
    
    paginatedTriggers.forEach(trigger => {
      if (!groupedTriggers[trigger.category]) {
        groupedTriggers[trigger.category] = [];
      }
      groupedTriggers[trigger.category].push(trigger);
    });
    
    return filteredCategories
      .map(category => ({
        ...category,
        triggers: groupedTriggers[category.category] || []
      }))
      .filter(category => category.triggers.length > 0);
  }, [filteredCategories, debouncedSearchTerm, currentPage, triggersPerPage]);

  const totalPages = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return 1;
    
    const totalTriggers = filteredTriggers.length;
    return Math.ceil(totalTriggers / triggersPerPage);
  }, [filteredTriggers, debouncedSearchTerm, triggersPerPage]);

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  }, []);

  const handleTriggerSelect = useCallback((triggerId: string) => {
    setNavigationError(null);
    setSelectedTrigger(triggerId);
    setIsNavigating(true);
    
    const updatedRecent = [
      triggerId,
      ...recentTriggers.filter(id => id !== triggerId)
    ].slice(0, 3);
    
    setRecentTriggers(updatedRecent);

    toast.success("Workflow trigger selected", {
      description: "Creating new workflow...",
      duration: 2000,
    });
    
    try {
      setTimeout(() => {
        navigate(`/automation/workflows/new/trigger/${triggerId}`);
        setIsNavigating(false);
        if (onClose) onClose();
      }, 300);
    } catch (error) {
      setIsNavigating(false);
      setNavigationError("Failed to navigate to workflow creation. Please try again.");
      console.error("Navigation error:", error);
    }
  }, [navigate, onClose, recentTriggers, setRecentTriggers]);

  useEffect(() => {
    if (open) {
      console.log('CreateWorkflowModal rendered with open:', open);
    }
    
    // Reset state when modal closes
    if (!open) {
      setSearchTerm('');
      setSelectedTrigger(null);
      setFocusedTriggerIndex(-1);
      setNavigationError(null);
      setCurrentPage(1);
      setIsNavigating(false);
    }
  }, [open]);

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
      const visibleTriggers = filteredTriggers;
      
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, focusedTriggerIndex, filteredTriggers, handleTriggerSelect]);

  useEffect(() => {
    setFocusedTriggerIndex(-1);
  }, [debouncedSearchTerm]);

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
                setCurrentPage(1);
              }}
            />
          </div>

          {navigationError && (
            <Alert variant="destructive" className="mb-4 animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{navigationError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-1 pb-2 scroll-smooth">
            {paginatedCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 rounded-full bg-muted mb-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-muted-foreground">No triggers found</p>
                <p className="text-sm text-muted-foreground mt-1">Try another search term</p>
              </div>
            ) : (
              debouncedSearchTerm ? (
                paginatedCategories.map((category) => (
                  <div key={category.category} className="space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                      {category.icon}
                      <h3 className="font-medium text-lg text-foreground">{category.category}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.triggers.map((trigger) => {
                        const triggerIndex = filteredTriggers.findIndex(t => t.id === trigger.id);
                        return renderTriggerCard(trigger, triggerIndex);
                      })}
                    </div>
                  </div>
                ))
              ) : (
                paginatedCategories.map((category) => (
                  <Accordion
                    key={category.category}
                    type="multiple"
                    value={expandedCategories}
                    onValueChange={(values) => setExpandedCategories(values)}
                    className="border rounded-lg overflow-hidden"
                  >
                    <AccordionItem value={category.category} className="border-0">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 group">
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <h3 className="font-medium text-lg text-foreground">{category.category}</h3>
                          {category.category === "Recently Used" && (
                            <div className="flex items-center">
                              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {category.description}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 pt-2 bg-background/80">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {category.triggers.map((trigger) => {
                            const triggerIndex = allTriggers.findIndex(t => t.id === trigger.id);
                            return renderTriggerCard(trigger, triggerIndex);
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))
              )
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter className="px-6 py-4 border-t bg-muted/30 text-sm text-muted-foreground">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded text-xs font-mono bg-background border">↑</kbd>
              <kbd className="px-2 py-1 rounded text-xs font-mono bg-background border">↓</kbd>
              <span className="mr-3">to navigate</span>
              
              <kbd className="px-2 py-1 rounded text-xs font-mono bg-background border">Enter</kbd>
              <span>to select</span>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <h4 className="font-medium mb-2">About Workflow Triggers</h4>
                <p className="text-sm mb-4">
                  Triggers are events that start your workflow automation. Choose the most relevant 
                  trigger for your use case and then configure actions that will run when the trigger fires.
                </p>
                <h5 className="font-medium text-sm mb-1">Tips:</h5>
                <ul className="text-xs space-y-1 list-disc pl-4">
                  <li>Search for specific actions using keywords</li>
                  <li>Recently used triggers appear at the top</li>
                  <li>Expand categories to see all available triggers</li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  function renderTriggerCard(trigger: Trigger, index: number) {
    return (
      <TooltipProvider key={trigger.id}>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div
              ref={(el) => {
                if (el) triggerRefs.current.set(trigger.id, el);
              }}
              className={cn(
                "group rounded-lg border p-4 cursor-pointer transition-all duration-300",
                "hover:border-primary/40 hover:shadow-md",
                "bg-gradient-to-br bg-opacity-50",
                getTriggerGradient(trigger.id),
                focusedTriggerIndex === index && "ring-2 ring-primary/40 ring-offset-1",
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
              aria-disabled={isNavigating}
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
                    
                    {trigger.examples && trigger.examples.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-muted">
                        <span className="text-xs text-muted-foreground font-medium">Example:</span>
                        <p className="text-xs text-muted-foreground mt-1">{trigger.examples[0]}</p>
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5 transition-transform duration-300" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs p-4">
            <p className="font-medium mb-1">{trigger.name}</p>
            <p className="text-sm mb-2">{trigger.longDescription || trigger.description}</p>
            {trigger.examples && trigger.examples.length > 0 && (
              <>
                <p className="text-xs font-medium mt-2 mb-1">Examples:</p>
                <ul className="text-xs space-y-1 list-disc pl-4">
                  {trigger.examples.map((example, idx) => (
                    <li key={idx}>{example}</li>
                  ))}
                </ul>
              </>
            )}
            <p className="text-xs mt-2 text-muted-foreground">Press Enter to select</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};

export default CreateWorkflowModal;


import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, ChevronRight, ArrowRight, Loader2, Wand2, MessageSquare, Calendar, PlayCircle, Bot, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '@/lib/utils';
import type { Workflow, WorkflowType } from '@/types/workflow';

const workflowTypes: {
  id: WorkflowType;
  name: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'message',
    name: 'Message',
    description: 'Create flows that send messages to customers based on events',
    icon: <MessageSquare className="h-5 w-5" />
  },
  {
    id: 'automation',
    name: 'Automation',
    description: 'Automate tasks based on triggers and conditions',
    icon: <Wand2 className="h-5 w-5" />
  },
  {
    id: 'schedule',
    name: 'Schedule',
    description: 'Run tasks on a fixed schedule or interval',
    icon: <Calendar className="h-5 w-5" />
  },
  {
    id: 'bot',
    name: 'Bot',
    description: 'Create AI-powered bots for automated conversations',
    icon: <Bot className="h-5 w-5" />
  }
];

const triggerOptions = [
  {
    id: 'ticket_created',
    name: 'Ticket Created',
    description: 'Triggers when a new ticket is created',
    category: 'Tickets'
  },
  {
    id: 'ticket_status_changed',
    name: 'Ticket Status Changed',
    description: 'Triggers when a ticket status changes',
    category: 'Tickets'
  },
  {
    id: 'ticket_assigned',
    name: 'Ticket Assigned',
    description: 'Triggers when a ticket is assigned',
    category: 'Tickets'
  },
  {
    id: 'ticket_replied',
    name: 'Ticket Replied',
    description: 'Triggers when a reply is added to a ticket',
    category: 'Tickets'
  },
  {
    id: 'contact_created',
    name: 'Contact Created',
    description: 'Triggers when a new contact is created',
    category: 'Contacts'
  },
  {
    id: 'company_created',
    name: 'Company Created',
    description: 'Triggers when a new company is created',
    category: 'Companies'
  },
  {
    id: 'chat_started',
    name: 'Chat Started',
    description: 'Triggers when a new chat conversation begins',
    category: 'Chat'
  },
  {
    id: 'chat_ended',
    name: 'Chat Ended',
    description: 'Triggers when a chat conversation ends',
    category: 'Chat'
  },
  {
    id: 'webhook_received',
    name: 'Webhook Received',
    description: 'Triggers when a webhook is received',
    category: 'Webhooks'
  },
  {
    id: 'form_submitted',
    name: 'Form Submitted',
    description: 'Triggers when a form is submitted',
    category: 'Forms'
  },
  {
    id: 'scheduled',
    name: 'Scheduled',
    description: 'Triggers at scheduled intervals or specific times',
    category: 'Schedule'
  }
];

interface CreateWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onWorkflowCreated: (workflow: Workflow) => void;
}

const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({ 
  open, 
  onOpenChange,
  onClose,
  onWorkflowCreated
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workflowType, setWorkflowType] = useState<WorkflowType>('automation');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedTriggerIndex, setFocusedTriggerIndex] = useState(-1);
  const [navigationError, setNavigationError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  const filteredTriggers = triggerOptions.filter(trigger => 
    trigger.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    trigger.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trigger.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    if (step === 2 && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else if (step === 1 && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [step]);
  
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
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && filteredTriggers.length > 0) {
      e.preventDefault();
      setFocusedTriggerIndex(prev => (prev + 1) % filteredTriggers.length);
    } else if (e.key === 'ArrowUp' && filteredTriggers.length > 0) {
      e.preventDefault();
      setFocusedTriggerIndex(prev => (prev - 1 + filteredTriggers.length) % filteredTriggers.length);
    } else if (e.key === 'Enter' && focusedTriggerIndex >= 0) {
      e.preventDefault();
      setSelectedTrigger(filteredTriggers[focusedTriggerIndex].id);
    }
  };
  
  const handleNextStep = () => {
    setNavigationError(null);
    
    if (step === 1) {
      if (!name.trim()) {
        setNavigationError('Please enter a name for your workflow');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedTrigger) {
        setNavigationError('Please select a trigger for your workflow');
        return;
      }
      
      setIsNavigating(true);
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const newWorkflow: Workflow = {
          id: `workflow-${Date.now()}`,
          name,
          description,
          status: 'Draft',
          type: workflowType,
          updatedAt: new Date(),
          createdAt: new Date(),
          trigger: {
            id: selectedTrigger,
            name: triggerOptions.find(t => t.id === selectedTrigger)?.name || '',
          }
        };
        
        onWorkflowCreated(newWorkflow);
        setIsLoading(false);
        onClose();
      }, 1000);
    }
  };
  
  const handlePrevStep = () => {
    setNavigationError(null);
    setStep(prev => Math.max(1, prev - 1));
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 py-2"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Workflow Name</Label>
              <Input 
                id="name" 
                placeholder="Enter workflow name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                ref={nameInputRef}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Describe what this workflow does"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="resize-none min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-3 pt-2">
              <Label>Workflow Type</Label>
              <RadioGroup value={workflowType} onValueChange={(value) => setWorkflowType(value as WorkflowType)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {workflowTypes.map((type) => (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={type.id}
                    >
                      <Label
                        htmlFor={`type-${type.id}`}
                        className={cn(
                          "flex items-center space-x-3 border border-input rounded-md p-4 cursor-pointer",
                          workflowType === type.id && "border-primary bg-primary/5"
                        )}
                      >
                        <RadioGroupItem value={type.id} id={`type-${type.id}`} className="sr-only" />
                        <div className="flex-shrink-0">
                          <div className={cn(
                            "p-2 rounded-md",
                            workflowType === type.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            {type.icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{type.name}</p>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </Label>
                    </motion.div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 py-2"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search for triggers..."
                className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={searchInputRef}
              />
            </div>
            
            <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1 -mr-1">
              {filteredTriggers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No triggers found</p>
              ) : (
                <AnimatePresence>
                  {filteredTriggers.map((trigger, index) => (
                    <motion.div
                      key={trigger.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <div
                        className={cn(
                          "flex items-start space-x-3 p-3 cursor-pointer rounded-md transition-colors",
                          selectedTrigger === trigger.id && "bg-primary/10 border-primary",
                          focusedTriggerIndex === index && "bg-muted/80",
                          "hover:bg-muted"
                        )}
                        onClick={() => setSelectedTrigger(trigger.id)}
                      >
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className="font-medium">{trigger.name}</span>
                            <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                              {trigger.category}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{trigger.description}</p>
                        </div>
                        {selectedTrigger === trigger.id && (
                          <div className="flex-shrink-0">
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-card">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Create New Workflow</DialogTitle>
            <DialogDescription>
              {step === 1 
                ? "Let's get started by setting up your workflow details." 
                : "Choose a trigger that will start your workflow."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 pb-6">
            <div className="flex items-center w-full mb-5">
              <motion.div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                  "border border-input bg-primary text-primary-foreground"
                )}
                animate={step >= 1 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                1
              </motion.div>
              <motion.div
                className={cn(
                  "flex-1 h-1 mx-2 transition-all duration-300",
                  step >= 2 ? "bg-primary" : "bg-muted"
                )}
                initial={{ scaleX: 0 }}
                animate={step >= 2 ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border",
                  step >= 2
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-input"
                )}
                animate={step >= 2 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                2
              </motion.div>
            </div>
            
            {renderStep()}
            
            {navigationError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive text-sm mt-2"
              >
                {navigationError}
              </motion.div>
            )}
            
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button variant="outline" onClick={handlePrevStep} disabled={isLoading}>
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              <Button
                onClick={handleNextStep}
                disabled={isLoading}
                className="transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : step < 2 ? (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Create Workflow
                    <Zap className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkflowModal;

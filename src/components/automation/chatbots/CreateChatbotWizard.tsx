
import { useState } from 'react';
import { Steps } from '@/components/ui/steps';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { createChatbot } from '@/store/slices/chatbots/chatbotsSlice';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { BasicInformation } from './form/BasicInformation';
import { ToneSelection } from './form/ToneSelection';
import { MessageConfiguration } from './form/MessageConfiguration';
import { BehaviorSettings } from './form/BehaviorSettings';
import type { Chatbot } from '@/types/chatbot';

const chatbotFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  avatarUrl: z.string().optional(),
  tone: z.string().min(1, 'Tone is required'),
  customInstructions: z.string().optional(),
  welcomeMessage: z.string().min(1, 'Welcome message is required'),
  humanHandoffMessage: z.string().min(1, 'Human handoff message is required'),
  status: z.literal('active'),
  dataCollection: z.object({
    enabled: z.boolean(),
    fields: z.array(z.object({
      id: z.string(),
      label: z.string(),
      type: z.string(),
      required: z.boolean(),
      options: z.array(z.string()).optional(),
    })),
  }),
  behavior: z.object({
    queryHandling: z.enum(['single', 'continuous']),
    postAnswerAction: z.enum(['continue', 'close', 'handoff']),
    inactivityTimeout: z.number(),
    inactivityAction: z.enum(['close', 'handoff', 'prompt']),
    enableHumanHandoff: z.boolean(),
  }),
});

type ChatbotFormData = z.infer<typeof chatbotFormSchema>;

type Step = {
  title: string;
  description: string;
  status: 'pending' | 'current' | 'complete';
};

const steps: Step[] = [
  {
    title: 'Basic Information',
    description: 'Configure the chatbot profile',
    status: 'current',
  },
  {
    title: 'Personality',
    description: 'Set the tone and behavior',
    status: 'pending',
  },
  {
    title: 'Configuration',
    description: 'Define messages and settings',
    status: 'pending',
  },
];

export const CreateChatbotWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ChatbotFormData>({
    resolver: zodResolver(chatbotFormSchema),
    defaultValues: {
      name: '',
      description: '',
      avatarUrl: '',
      tone: 'friendly',
      customInstructions: '',
      welcomeMessage: 'Hi! How can I help you today?',
      humanHandoffMessage: "I'll connect you with a human agent who can better assist you.",
      status: 'active',
      dataCollection: {
        enabled: false,
        fields: [],
      },
      behavior: {
        queryHandling: 'continuous',
        postAnswerAction: 'continue',
        inactivityTimeout: 300,
        inactivityAction: 'prompt',
        enableHumanHandoff: true,
      },
    },
  });

  const onSubmit = async (values: ChatbotFormData) => {
    try {
      const chatbotData: Omit<Chatbot, 'id' | 'createdAt'> = {
        ...values,
        name: values.name,
        description: values.description,
        status: 'active',
        tone: values.tone,
        welcomeMessage: values.welcomeMessage,
        humanHandoffMessage: values.humanHandoffMessage,
        dataCollection: values.dataCollection,
        behavior: values.behavior,
      };
      
      await dispatch(createChatbot(chatbotData)).unwrap();
      toast({
        title: "Success",
        description: "Chatbot created successfully",
      });
      navigate('/home/automation/ai/chatbot-profiles');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create chatbot",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const updateStepStatus = () => {
    return steps.map((step, index) => ({
      ...step,
      status: index === currentStep ? 'current'
        : index < currentStep ? 'complete'
        : 'pending'
    })) as Step[];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInformation />;
      case 1:
        return <ToneSelection />;
      case 2:
        return (
          <div className="space-y-6">
            <MessageConfiguration />
            <BehaviorSettings />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Steps steps={updateStepStatus()} />
      
      <Card className="mt-8 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {renderStepContent()}

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              {currentStep === steps.length - 1 ? (
                <Button type="submit">
                  Create Chatbot
                </Button>
              ) : (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

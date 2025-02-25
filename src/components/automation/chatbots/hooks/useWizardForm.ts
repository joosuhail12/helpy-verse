
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useToast } from '@/hooks/use-toast';
import { createChatbot } from '@/store/slices/chatbots/chatbotsSlice';
import { chatbotFormSchema } from '../schema/formSchema';
import type { ChatbotFormData, ChatbotFormValues } from '../types/wizard';
import type { DataCollectionField, DataCollection, ChatbotBehavior } from '@/types/chatbot';

export const useWizardForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Define initial field with all required properties
  const defaultField = {
    id: 'default',
    label: 'Default Field',
    type: 'text',
    required: false,
  } as const satisfies DataCollectionField;

  // Initialize data collection with explicit type and all required properties
  const defaultDataCollection = {
    enabled: false,
    fields: [defaultField],
  } as const satisfies Required<DataCollection>;

  // Initialize behavior with explicit type and all required properties
  const defaultBehavior = {
    queryHandling: 'continuous' as const,
    postAnswerAction: 'continue' as const,
    inactivityTimeout: 300,
    inactivityAction: 'prompt' as const,
    enableHumanHandoff: true,
  } as const satisfies Required<ChatbotBehavior>;

  // Initialize form with explicitly typed default values
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
      status: 'active' as const,
      dataCollection: {
        enabled: defaultDataCollection.enabled,
        fields: [...defaultDataCollection.fields],
      },
      behavior: {
        queryHandling: defaultBehavior.queryHandling,
        postAnswerAction: defaultBehavior.postAnswerAction,
        inactivityTimeout: defaultBehavior.inactivityTimeout,
        inactivityAction: defaultBehavior.inactivityAction,
        enableHumanHandoff: defaultBehavior.enableHumanHandoff,
      },
    } satisfies ChatbotFormData,
  });

  const onSubmit = async (values: ChatbotFormData) => {
    try {
      const chatbotData: ChatbotFormValues = {
        name: values.name,
        description: values.description,
        status: values.status,
        avatarUrl: values.avatarUrl,
        tone: values.tone,
        customInstructions: values.customInstructions,
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
      console.error('Error creating chatbot:', error);
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return {
    form,
    currentStep,
    onSubmit,
    nextStep,
    prevStep,
  };
};

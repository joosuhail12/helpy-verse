
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useToast } from '@/hooks/use-toast';
import { createChatbot } from '@/store/slices/chatbots/chatbotsSlice';
import { chatbotFormSchema } from '../schema/formSchema';
import type { ChatbotFormData, ChatbotFormValues } from '../types/wizard';

export const useWizardForm = () => {
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
        enabled: false,  // Now required
        fields: [],      // Now required
      },
      behavior: {
        queryHandling: 'continuous',     // Now required
        postAnswerAction: 'continue',    // Now required
        inactivityTimeout: 300,          // Now required
        inactivityAction: 'prompt',      // Now required
        enableHumanHandoff: true,        // Now required
      },
    },
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

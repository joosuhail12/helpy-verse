
import { Steps } from '@/components/ui/steps';
import { CreateChatbotForm } from '@/components/automation/chatbots/CreateChatbotForm';
import { useState } from 'react';

const CreateChatbot = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Basic Setup',
      description: 'Configure your chatbot's basic information and behavior',
      status: currentStep === 0 ? 'current' : currentStep > 0 ? 'complete' : 'pending',
    },
    {
      title: 'Audience Rules',
      description: 'Define who can interact with your chatbot',
      status: currentStep === 1 ? 'current' : currentStep > 1 ? 'complete' : 'pending',
    },
    {
      title: 'Knowledge Base',
      description: 'Add content and actions for your chatbot',
      status: currentStep === 2 ? 'current' : currentStep > 2 ? 'complete' : 'pending',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Create Chatbot</h1>
        <p className="text-muted-foreground">
          Complete the following steps to set up your new chatbot
        </p>
      </div>

      <Steps steps={steps} />

      <div className="mt-8">
        {currentStep === 0 && (
          <CreateChatbotForm />
        )}
        {currentStep === 1 && (
          <div className="p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Audience Rules</h2>
            <p className="text-muted-foreground">Configure who can interact with your chatbot</p>
            {/* Audience rules form will be implemented here */}
          </div>
        )}
        {currentStep === 2 && (
          <div className="p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Knowledge Base</h2>
            <p className="text-muted-foreground">Add content and actions for your chatbot to use</p>
            {/* Knowledge base form will be implemented here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateChatbot;

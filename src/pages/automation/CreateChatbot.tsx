
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Steps, Step } from '@/components/ui/steps';
import { ChatbotBasicInfo } from '@/components/automation/chatbots/form/basic-info/ChatbotBasicInfo';
import { AudienceRules } from '@/components/automation/chatbots/form/audience-rules/AudienceRules';
import { ContentConnector } from '@/components/automation/chatbots/form/content-connector/ContentConnector';
import { Deployment } from '@/components/automation/chatbots/form/deployment/Deployment';
import { useToast } from '@/hooks/use-toast';

// Define a prop interface for AudienceRules to include onNextStep
interface AudienceRulesWithNextProps {
  onNextStep: () => void;
}

// Create a wrapped component that provides the onNextStep prop
const AudienceRulesWithNext: React.FC<AudienceRulesWithNextProps> = ({ onNextStep }) => {
  return (
    <div>
      <AudienceRules />
      <div className="mt-6 flex justify-end">
        <Button onClick={onNextStep}>Continue</Button>
      </div>
    </div>
  );
};

const CreateChatbot = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ChatbotBasicInfo onNextStep={handleNextStep} />;
      case 1:
        return <AudienceRulesWithNext onNextStep={handleNextStep} />;
      case 2:
        return <ContentConnector onNextStep={handleNextStep} />;
      case 3:
        return <Deployment onComplete={() => {
          toast({
            title: "Chatbot created",
            description: "Your chatbot has been created and is ready to use.",
          });
        }} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <h1 className="text-3xl font-bold">Create New Chatbot</h1>
      
      <Steps
        currentStep={currentStep}
        onStepClick={handleStepClick}
      >
        <Step title="Basic Information" />
        <Step title="Audience Rules" />
        <Step title="Connect Content" />
        <Step title="Deploy" />
      </Steps>
      
      <Card>
        <CardContent className="pt-6">
          {renderStep()}
        </CardContent>
      </Card>
      
      {currentStep > 0 && currentStep < 3 && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevStep}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreateChatbot;

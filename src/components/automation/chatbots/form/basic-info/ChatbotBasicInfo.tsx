
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BasicInformation } from '@/components/automation/chatbots/form/BasicInformation';
import { BehaviorSettings } from '@/components/automation/chatbots/form/BehaviorSettings';
import { MessageConfiguration } from '@/components/automation/chatbots/form/MessageConfiguration';
import { ToneSelection } from '@/components/automation/chatbots/form/ToneSelection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChatbotBasicInfoProps {
  onNextStep: () => void;
}

export const ChatbotBasicInfo = ({ onNextStep }: ChatbotBasicInfoProps) => {
  const [isValid, setIsValid] = useState(false);

  // Simulate form validation
  const handleFormChange = (e: React.FormEvent) => {
    // In a real app, you would validate the form fields here
    // For this example, we'll just set isValid to true after a delay
    setTimeout(() => {
      setIsValid(true);
    }, 1000);
  };

  return (
    <div className="space-y-6" onChange={handleFormChange}>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <BasicInformation />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Behavior Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <BehaviorSettings />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <MessageConfiguration />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tone Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <ToneSelection />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNextStep} disabled={!isValid}>
          Continue
        </Button>
      </div>
    </div>
  );
};


import { Steps } from '@/components/ui/steps';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { BasicInformation } from './form/BasicInformation';
import { ToneSelection } from './form/ToneSelection';
import { MessageConfiguration } from './form/MessageConfiguration';
import { BehaviorSettings } from './form/BehaviorSettings';
import { useWizardForm } from './hooks/useWizardForm';
import { updateStepStatus } from './utils/stepUtils';

export const CreateChatbotWizard = () => {
  const { form, currentStep, onSubmit, nextStep, prevStep } = useWizardForm();

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
      <Steps steps={updateStepStatus(currentStep)} />
      
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
              
              {currentStep === 2 ? (
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

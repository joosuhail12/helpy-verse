
import type { WizardStep } from '../types/wizard';

export const WIZARD_STEPS: WizardStep[] = [
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

export const updateStepStatus = (currentStep: number): WizardStep[] => {
  return WIZARD_STEPS.map((step, index) => ({
    ...step,
    status: index === currentStep ? 'current'
      : index < currentStep ? 'complete'
      : 'pending'
  }));
};


import { DomainDetails } from '@/api/services/emailService';
import { Steps } from '@/components/ui/steps';

interface DomainVerificationStepsProps {
  domain: DomainDetails;
}

type Step = {
  title: string;
  description: string;
  status: 'pending' | 'current' | 'complete';
};

export const DomainVerificationSteps = ({ domain }: DomainVerificationStepsProps) => {
  const steps: Step[] = [
    {
      title: 'Configure DNS',
      description: 'Add required DNS records',
      status: domain.isVerified ? 'verified' : 'pending',
    },
    {
      title: 'Verify',
      description: 'Verify domain ownership',
      status: domain.status === 'verified' ? 'complete' : 'pending',
    },
  ];

  return <Steps steps={steps} />;
};

export default DomainVerificationSteps;


import { Steps } from '@/components/ui/steps';
import type { Domain } from '@/mock/domains';

interface DomainVerificationStepsProps {
  domain: Domain;
}

type Step = {
  title: string;
  description: string;
  status: 'pending' | 'current' | 'complete';
};

export const DomainVerificationSteps = ({ domain }: DomainVerificationStepsProps) => {
  const steps: Step[] = [
    {
      title: 'Add Domain',
      description: 'Add your domain to the platform',
      status: domain.ownerConfirmed ? 'complete' : 'current',
    },
    {
      title: 'Configure DNS',
      description: 'Add required DNS records',
      status: domain.ownerConfirmed && domain.status === 'pending' ? 'current' : 'pending',
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

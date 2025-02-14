
import { Steps } from '@/components/ui/steps';
import type { Domain } from '@/mock/domains';

interface DomainVerificationStepsProps {
  domain: Domain;
}

export const DomainVerificationSteps = ({ domain }: DomainVerificationStepsProps) => {
  const verificationSteps = [
    {
      title: 'Add DNS Records',
      description: 'Add the required DNS records to your domain',
      status: domain.status === 'pending' ? 'current' : 'complete',
    },
    {
      title: 'Verify Domain',
      description: 'Confirm DNS records are properly configured',
      status: domain.status === 'verified' ? 'complete' : 'pending',
    },
    {
      title: 'Domain Ready',
      description: 'Your domain is ready to use',
      status: domain.status === 'verified' ? 'complete' : 'pending',
    },
  ] as const;

  return <Steps steps={verificationSteps} />;
};

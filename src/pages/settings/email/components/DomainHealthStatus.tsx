
import { Mail, ShieldCheck, ShieldAlert, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Domain } from '@/mock/domains';

interface DomainHealthStatusProps {
  domain: Domain;
}

export const DomainHealthStatus = ({ domain }: DomainHealthStatusProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          {domain.status === 'verified' ? (
            <ShieldCheck className="h-5 w-5 text-green-500" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-yellow-500" />
          )}
          <h3 className="font-medium">SSL Certificate</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {domain.status === 'verified' ? 'Valid and secure' : 'Pending verification'}
        </p>
      </div>

      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium">Domain Expiry</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {format(new Date(domain.dateAdded), 'MMM d, yyyy')}
        </p>
      </div>

      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-purple-500" />
          <h3 className="font-medium">Last Verified</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {domain.status === 'verified' 
            ? format(new Date(domain.dateAdded), 'MMM d, yyyy')
            : 'Not verified yet'}
        </p>
      </div>

      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Mail className={`h-5 w-5 ${domain.status === 'verified' ? 'text-green-500' : 'text-red-500'}`} />
          <h3 className="font-medium">Email Sending</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {domain.status === 'verified' ? 'Enabled' : 'Disabled'}
        </p>
      </div>
    </div>
  );
};

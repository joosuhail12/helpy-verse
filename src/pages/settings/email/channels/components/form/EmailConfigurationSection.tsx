
import { Input } from '@/components/ui/input';
import { Mail, User } from 'lucide-react';
import { FieldLabel } from './FieldLabel';

interface EmailConfigurationSectionProps {
  senderName: string;
  setSenderName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  autoBccEmail: string;
  setAutoBccEmail: (value: string) => void;
  noReplyEmail: string;
  setNoReplyEmail: (value: string) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setFieldTouched: (field: string) => void;
}

export const EmailConfigurationSection = ({
  senderName,
  setSenderName,
  email,
  setEmail,
  autoBccEmail,
  setAutoBccEmail,
  noReplyEmail,
  setNoReplyEmail,
  errors,
  touched,
  setFieldTouched,
}: EmailConfigurationSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Email Configuration</h3>
      <div className="grid gap-6">
        <div className="space-y-2">
          <FieldLabel
            label="Sender Name"
            fieldName="senderName"
            tooltip="The name that will appear in the From field"
            required
            icon={<User className="h-4 w-4" />}
            description="This name will be displayed to recipients in their email client"
          />
          <Input
            id="senderName"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            onBlur={() => setFieldTouched('senderName')}
            placeholder="Support Team"
            maxLength={50}
            className={errors.senderName && touched.senderName ? 'border-destructive' : ''}
          />
          <div className="text-xs text-muted-foreground text-right">
            {senderName.length}/50 characters
          </div>
          {errors.senderName && touched.senderName && (
            <p className="text-sm text-destructive mt-1">{errors.senderName}</p>
          )}
        </div>

        <div className="space-y-2">
          <FieldLabel
            label="Email Address"
            fieldName="email"
            tooltip="The email address that will be used to send emails"
            required
            icon={<Mail className="h-4 w-4" />}
            description="Main email address for sending and receiving messages"
          />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setFieldTouched('email')}
            placeholder="support@company.com"
            className={errors.email && touched.email ? 'border-destructive' : ''}
          />
          {errors.email && touched.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        <div className="grid gap-6 rounded-lg border p-4 bg-muted/10">
          <div className="space-y-2">
            <FieldLabel
              label="Auto BCC Email"
              fieldName="autoBccEmail"
              tooltip="Optional email address that will be BCC'd on all outgoing emails"
              icon={<Mail className="h-4 w-4" />}
              description="Automatically BCC this address on all outgoing emails for record-keeping"
            />
            <Input
              id="autoBccEmail"
              type="email"
              value={autoBccEmail}
              onChange={(e) => setAutoBccEmail(e.target.value)}
              onBlur={() => setFieldTouched('autoBccEmail')}
              placeholder="archive@company.com"
              className={errors.autoBccEmail && touched.autoBccEmail ? 'border-destructive' : ''}
            />
            {errors.autoBccEmail && touched.autoBccEmail && (
              <p className="text-sm text-destructive mt-1">{errors.autoBccEmail}</p>
            )}
          </div>

          <div className="space-y-2">
            <FieldLabel
              label="No Reply Email"
              fieldName="noReplyEmail"
              tooltip="Optional email address for automated responses"
              icon={<Mail className="h-4 w-4" />}
              description="Used for automated messages where replies are not monitored"
            />
            <Input
              id="noReplyEmail"
              type="email"
              value={noReplyEmail}
              onChange={(e) => setNoReplyEmail(e.target.value)}
              onBlur={() => setFieldTouched('noReplyEmail')}
              placeholder="no-reply@company.com"
              className={errors.noReplyEmail && touched.noReplyEmail ? 'border-destructive' : ''}
            />
            {errors.noReplyEmail && touched.noReplyEmail && (
              <p className="text-sm text-destructive mt-1">{errors.noReplyEmail}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

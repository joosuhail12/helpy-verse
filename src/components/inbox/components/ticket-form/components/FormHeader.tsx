
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { ToField } from '../../to-field';
import type { Recipient } from '../types';

interface FormHeaderProps {
  subject: string;
  recipients: Recipient[];
  onSubjectChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRecipientsChange: (recipients: Recipient[]) => void;
}

const FormHeader = ({ 
  subject, 
  recipients, 
  onSubjectChange, 
  onRecipientsChange 
}: FormHeaderProps) => {
  return (
    <div className="space-y-2.5">
      <div className="space-y-2.5">
        <Label htmlFor="subject" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-primary/80" />
          Subject <span className="text-red-500">*</span>
        </Label>
        <Input
          id="subject"
          value={subject}
          onChange={onSubjectChange}
          placeholder="Enter ticket subject"
          className="transition-colors border-gray-200 focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/40 rounded-lg"
          required
        />
      </div>
      
      <div className="space-y-2.5">
        <Label htmlFor="to" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-primary/80" />
          To <span className="text-red-500">*</span>
        </Label>
        <ToField 
          selectedRecipients={recipients}
          onChange={onRecipientsChange}
        />
      </div>
    </div>
  );
};

export default FormHeader;

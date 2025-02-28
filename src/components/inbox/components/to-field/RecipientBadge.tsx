
import { Mail, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecipientBadgeProps } from './types';

const RecipientBadge = ({ recipient, onRemove }: RecipientBadgeProps) => {
  return (
    <Badge 
      key={recipient.id}
      variant="secondary" 
      className="flex items-center gap-1 py-1 px-2"
    >
      {'firstname' in recipient ? (
        `${recipient.firstname} ${recipient.lastname}`
      ) : (
        <span className="flex items-center">
          <Mail className="h-3 w-3 mr-1" />
          {recipient.email}
        </span>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 ml-1"
        onClick={() => onRemove(recipient.id)}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
};

export default RecipientBadge;

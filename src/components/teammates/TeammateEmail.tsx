
import { Button } from "@/components/ui/button";
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface TeammateEmailProps {
  email: string;
}

const TeammateEmail = ({ email }: TeammateEmailProps) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span>{email}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyEmail}
        className="h-6 w-6 p-0"
        title="Copy email"
      >
        {showCopied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};

export default TeammateEmail;

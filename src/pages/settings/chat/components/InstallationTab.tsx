
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Check, Globe } from 'lucide-react';

interface InstallationTabProps {
  getEmbedCode: () => string;
}

/**
 * Tab component for installation code
 */
const InstallationTab = ({ getEmbedCode }: InstallationTabProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Installation Code</Label>
        <div className="relative">
          <Textarea
            value={getEmbedCode()}
            readOnly
            rows={12}
            className="font-mono text-sm"
          />
          <Button
            onClick={handleCopyCode}
            variant="outline"
            size="sm"
            className="absolute top-2 right-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="ml-2">{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="font-medium text-amber-900 flex items-center gap-2">
          <Globe className="h-4 w-4" /> Installation Instructions
        </h3>
        <p className="text-sm text-amber-800 mt-2">
          Add this code to your website's HTML, just before the closing &lt;/body&gt; tag.
          Once added, the chat widget will appear on all pages of your website.
        </p>
      </div>
    </div>
  );
};

export default InstallationTab;

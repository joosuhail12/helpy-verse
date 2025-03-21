
import React from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * Quick links section for the chat widget
 */
const QuickLinks = () => {
  return (
    <div className="mt-4 mb-6">
      <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Quick Links</h4>
      <div className="flex flex-col gap-2.5">
        <a href="#" className="text-sm text-gray-700 hover:text-primary flex items-center gap-1.5 font-medium">
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Visit our help center</span>
        </a>
        <a href="#" className="text-sm text-gray-700 hover:text-primary flex items-center gap-1.5 font-medium">
          <ExternalLink className="h-3.5 w-3.5" />
          <span>View pricing plans</span>
        </a>
      </div>
    </div>
  );
};

export default QuickLinks;

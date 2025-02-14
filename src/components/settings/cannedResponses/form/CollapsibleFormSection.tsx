
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleFormSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const CollapsibleFormSection = ({
  title,
  defaultOpen = true,
  children,
}: CollapsibleFormSectionProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2 border rounded-lg p-4"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <h3 className="text-lg font-semibold">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

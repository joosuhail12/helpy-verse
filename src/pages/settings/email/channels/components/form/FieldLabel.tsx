
import React from 'react';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import { Info } from 'lucide-react';

interface FieldLabelProps {
  label: string;
  fieldName: string;
  tooltip: string;
  required?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export const FieldLabel = ({
  label,
  fieldName,
  tooltip,
  required,
  icon,
  description,
}: FieldLabelProps) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={fieldName} className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

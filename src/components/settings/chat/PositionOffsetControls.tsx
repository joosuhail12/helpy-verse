
import React from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface PositionOffsetControlsProps {
  offsetX: number;
  offsetY: number;
  onOffsetXChange: (value: number) => void;
  onOffsetYChange: (value: number) => void;
}

export const PositionOffsetControls: React.FC<PositionOffsetControlsProps> = ({
  offsetX,
  offsetY,
  onOffsetXChange,
  onOffsetYChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Horizontal Offset (X)</span>
          <span className="text-sm text-muted-foreground">{offsetX}px</span>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            value={[offsetX]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => onOffsetXChange(values[0])}
            className="flex-grow"
          />
          <Input
            type="number"
            value={offsetX}
            onChange={(e) => onOffsetXChange(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Vertical Offset (Y)</span>
          <span className="text-sm text-muted-foreground">{offsetY}px</span>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            value={[offsetY]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => onOffsetYChange(values[0])}
            className="flex-grow"
          />
          <Input
            type="number"
            value={offsetY}
            onChange={(e) => onOffsetYChange(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>
    </div>
  );
};

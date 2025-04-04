
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface PositionOffsetProps {
  xOffset: number;
  yOffset: number;
  onXChange: (value: number) => void;
  onYChange: (value: number) => void;
}

const PositionOffsetControls: React.FC<PositionOffsetProps> = ({
  xOffset,
  yOffset,
  onXChange,
  onYChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="xOffset">Horizontal Offset (X)</Label>
          <span className="text-sm text-muted-foreground">{xOffset}px</span>
        </div>
        <div className="flex items-center gap-2">
          <Slider
            id="xOffset"
            value={[xOffset]}
            min={-100}
            max={100}
            step={1}
            onValueChange={(value) => onXChange(value[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={xOffset}
            onChange={(e) => onXChange(Number(e.target.value))}
            className="w-16"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="yOffset">Vertical Offset (Y)</Label>
          <span className="text-sm text-muted-foreground">{yOffset}px</span>
        </div>
        <div className="flex items-center gap-2">
          <Slider
            id="yOffset"
            value={[yOffset]}
            min={-100}
            max={100}
            step={1}
            onValueChange={(value) => onYChange(value[0])}
            className="flex-1"
          />
          <Input
            type="number"
            value={yOffset}
            onChange={(e) => onYChange(Number(e.target.value))}
            className="w-16"
          />
        </div>
      </div>
    </div>
  );
};

export default PositionOffsetControls;

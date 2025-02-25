
import { Input } from '@/components/ui/input';

interface RollingPeriodInputProps {
  value: string;
  onChange: (value: string) => void;
  operator: string;
}

export const RollingPeriodInput = ({ value, onChange, operator }: RollingPeriodInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[100px]"
        placeholder="Number"
      />
      <span className="text-muted-foreground">
        {operator.includes('rolling') ? 'Rolling days' : 
         operator === 'last_n_days' ? 'Days ago' : 
         'Days from now'}
      </span>
    </div>
  );
};

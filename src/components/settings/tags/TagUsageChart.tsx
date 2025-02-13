
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Tag } from '@/types/tag';

interface TagUsageChartProps {
  tag: Tag;
}

const TagUsageChart = ({ tag }: TagUsageChartProps) => {
  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={tag.history}>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke={tag.color} 
            fill={tag.color} 
            fillOpacity={0.2} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TagUsageChart;


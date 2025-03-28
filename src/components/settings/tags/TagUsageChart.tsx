
import React from 'react';
import { Tag } from '@/types/tag';

interface TagUsageChartProps {
  tag: Tag;
}

const TagUsageChart: React.FC<TagUsageChartProps> = ({ tag }) => {
  if (!tag.history || tag.history.length === 0) {
    return <div className="text-sm text-gray-400">No usage data available</div>;
  }

  // Find the highest value to normalize the chart heights
  const maxValue = Math.max(...tag.history.map(item => item.total));
  
  return (
    <div className="flex items-end h-8 gap-1">
      {tag.history.map((point, index) => {
        const height = maxValue > 0 ? (point.total / maxValue) * 100 : 0;
        return (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="w-3 bg-blue-400 rounded-sm"
              style={{ height: `${Math.max(15, height)}%` }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TagUsageChart;

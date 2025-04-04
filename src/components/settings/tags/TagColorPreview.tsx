
import React from 'react';

interface TagColorPreviewProps {
  color: string;
}

const TagColorPreview: React.FC<TagColorPreviewProps> = ({ color }) => {
  return (
    <div 
      className="w-4 h-4 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
};

export default TagColorPreview;

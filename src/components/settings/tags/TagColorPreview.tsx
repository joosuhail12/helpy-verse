
interface TagColorPreviewProps {
  color: string;
}

const TagColorPreview = ({ color }: TagColorPreviewProps) => {
  return (
    <div
      className="w-4 h-4 rounded flex-shrink-0 transition-all duration-200 hover:scale-110 cursor-pointer"
      style={{ 
        backgroundColor: color,
        boxShadow: `0 0 0 4px ${color}15`
      }}
      title={`Color: ${color}`}
    />
  );
};

export default TagColorPreview;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X } from 'lucide-react';

interface ImageUploaderProps {
  initialImage: string | null;
  onImageChange: (image: string | null) => void;
  label: string;
  className?: string;
  previewHeight?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImage,
  onImageChange,
  label,
  className = '',
  previewHeight = 60
}) => {
  const [image, setImage] = useState<string | null>(initialImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large. Maximum size is 2MB.');
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      alert('Only JPEG, PNG, and SVG images are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImage(result);
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    onImageChange(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col items-center p-4 border border-dashed rounded-md bg-gray-50">
        {image ? (
          <div className="flex flex-col items-center">
            <img 
              src={image} 
              alt={`${label} preview`} 
              className="object-contain mb-2 rounded border"
              style={{ maxHeight: `${previewHeight}px` }}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRemoveImage}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        ) : (
          <label className="cursor-pointer w-full flex flex-col items-center">
            <div className="p-3 rounded-full bg-primary/10 mb-2">
              <ImagePlus className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium mb-1">{label}</span>
            <span className="text-xs text-muted-foreground mb-2">Upload a JPEG, PNG, or SVG (max 2MB)</span>
            <Button variant="outline" size="sm" type="button" className="pointer-events-none">
              Select File
            </Button>
            <input
              type="file"
              accept="image/jpeg,image/png,image/svg+xml"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

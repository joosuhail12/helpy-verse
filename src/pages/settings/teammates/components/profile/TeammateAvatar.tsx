
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Teammate } from '@/types/teammate';
import { generatePlaceholder } from '@/utils/resourcePreloader';

interface TeammateAvatarProps {
  teammate: Teammate;
  isEditing: boolean;
  isLoading: boolean;
  onUpdateAvatar: (avatarUrl: string) => void;
}

export const TeammateAvatar = ({
  teammate,
  isEditing,
  isLoading,
  onUpdateAvatar,
}: TeammateAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Optimize image before uploading
      const optimizedImage = await compressImage(file, 800); // Max width 800px
      
      // Here you would integrate with your custom backend for image upload
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated upload
      const imageUrl = URL.createObjectURL(optimizedImage); // Temporary preview
      
      onUpdateAvatar(imageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      setImageError(true);
    } finally {
      setIsUploading(false);
    }
  };

  // Simple image compression function
  const compressImage = (file: File, maxWidth: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Canvas to Blob conversion failed'));
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            },
            'image/jpeg',
            0.8
          );
        };
        img.onerror = () => reject(new Error('Image loading error'));
      };
      reader.onerror = () => reject(new Error('File reading error'));
    });
  };

  return (
    <div className="relative">
      <Avatar className="h-16 w-16">
        <AvatarImage 
          src={teammate.avatar}
          loading="lazy"
          onError={() => setImageError(true)}
        />
        <AvatarFallback>
          {imageError || !teammate.avatar 
            ? teammate.name.slice(0, 2).toUpperCase() 
            : teammate.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {isEditing && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isLoading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
        </>
      )}
    </div>
  );
};

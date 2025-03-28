
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Teammate } from '@/types/teammate';

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Here you would integrate with your custom backend for image upload
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated upload
      const imageUrl = URL.createObjectURL(file); // Temporary preview
      
      onUpdateAvatar(imageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-16 w-16">
        <AvatarImage src={teammate.avatar} />
        <AvatarFallback>{teammate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
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

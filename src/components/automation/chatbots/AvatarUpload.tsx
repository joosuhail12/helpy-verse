
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface AvatarUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string>(value || '');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, we'll just create a local preview URL
      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(url);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={preview} />
        <AvatarFallback>BOT</AvatarFallback>
      </Avatar>
      <Button variant="outline" className="relative" size="sm">
        <input
          type="file"
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept="image/*"
        />
        <Upload className="h-4 w-4 mr-2" />
        Upload Avatar
      </Button>
    </div>
  );
}


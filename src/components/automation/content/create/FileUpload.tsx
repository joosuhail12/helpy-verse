
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { mockContentCategories, ContentCategory } from '@/mock/contentCategories';
import { FileUploadForm } from './file-upload/FileUploadForm';

export const FileUpload = ({ onSuccess }: { onSuccess: () => void }) => {
  const [categories, setCategories] = useState<ContentCategory[]>(mockContentCategories);

  const handleCategoryCreated = (newCategory: ContentCategory) => {
    setCategories([...categories, newCategory]);
  };

  return (
    <Card className="p-6">
      <FileUploadForm
        onSuccess={onSuccess}
        categories={categories}
        onCategoryCreated={handleCategoryCreated}
      />
    </Card>
  );
};


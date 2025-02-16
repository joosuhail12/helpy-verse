
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
    <div className="space-y-6 h-full flex flex-col">
      <Card className="p-6 bg-white dark:bg-gray-950 shadow-sm flex-1 overflow-auto">
        <FileUploadForm
          onSuccess={onSuccess}
          categories={categories}
          onCategoryCreated={handleCategoryCreated}
        />
      </Card>
    </div>
  );
};


import { useState } from 'react';
import { mockContentCategories, ContentCategory } from '@/mock/contentCategories';
import { FileUploadForm } from './file-upload/FileUploadForm';

export const FileUpload = ({ onSuccess }: { onSuccess: () => void }) => {
  const [categories, setCategories] = useState<ContentCategory[]>(mockContentCategories);

  const handleCategoryCreated = (newCategory: ContentCategory) => {
    setCategories([...categories, newCategory]);
  };

  return (
    <div className="flex flex-col h-full">
      <FileUploadForm
        onSuccess={onSuccess}
        categories={categories}
        onCategoryCreated={handleCategoryCreated}
      />
    </div>
  );
};

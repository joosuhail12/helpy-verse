
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { mockContentCategories, ContentCategory } from '@/mock/contentCategories';
import { FileUploadForm } from './file-upload/FileUploadForm';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export const FileUpload = ({ onSuccess }: { onSuccess: () => void }) => {
  const [categories, setCategories] = useState<ContentCategory[]>(mockContentCategories);
  const [batchProcess, setBatchProcess] = useState(false);

  const handleCategoryCreated = (newCategory: ContentCategory) => {
    setCategories([...categories, newCategory]);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center space-x-2 flex-shrink-0">
        <Checkbox 
          id="batchProcess" 
          checked={batchProcess} 
          onCheckedChange={(checked) => setBatchProcess(checked as boolean)}
        />
        <Label 
          htmlFor="batchProcess" 
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Process files in batch (recommended for multiple documents)
        </Label>
      </div>

      <Card className="p-6 bg-white dark:bg-gray-950 shadow-sm flex-1 overflow-auto">
        <FileUploadForm
          onSuccess={onSuccess}
          categories={categories}
          onCategoryCreated={handleCategoryCreated}
          batchProcess={batchProcess}
        />
      </Card>
    </div>
  );
};

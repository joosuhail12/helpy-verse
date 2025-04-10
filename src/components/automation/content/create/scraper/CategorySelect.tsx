
import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ContentCategory } from '@/mock/contentCategories';
import { UseFormReturn } from 'react-hook-form';
import { ScraperFormValues } from './types';
import { CreateCategoryDialog } from '../CreateCategoryDialog';

interface CategorySelectProps {
  form: UseFormReturn<ScraperFormValues>;
  categories: ContentCategory[];
  onCategoryCreated: (category: ContentCategory) => void;
}

export const CategorySelect = ({ form, categories, onCategoryCreated }: CategorySelectProps) => {
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <div className="flex gap-2">
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setCreateCategoryOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <FormDescription>
            Choose or create a category for this content
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

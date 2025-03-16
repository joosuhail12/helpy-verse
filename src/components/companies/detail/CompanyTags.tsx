import { useEffect, useState } from 'react';
import { updateCompany } from '@/store/slices/companies/companiesSlice';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Tag, X, Pencil, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Select from 'react-select';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTags } from '@/store/slices/tagsSlice';

interface CompanyTagsProps {
  company: { id: string; tags: { id: string; name: string }[] };
}

export const CompanyTags = ({ company }: CompanyTagsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string }[]>(company.tags || []);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const availableTags = useAppSelector(state => state.tags.items);

  useEffect(() => {
    dispatch(fetchTags({
      page: 1,
      limit: 1000,
      sortField: 'createdAt',
      sortDirection: 'desc',
      filterEntity: 'all',
      searchQuery: '',
    }));
  }, [dispatch]);

  const handleSelectTags = (selectedOptions: { value: string; label: string }[]) => {
    const newSelectedTags = selectedOptions.map(option => ({
      id: option.value,
      name: option.label,
    }));
    setSelectedTags(newSelectedTags);
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
  };

  const handleSaveTags = async () => {
    await dispatch(updateCompany({
      id: company.id,
      company: { tags: selectedTags },
    }));

    toast({
      title: "Tags updated",
      description: "Tags have been updated successfully.",
    });

    setIsEditing(false);
  };

  return (
    <Card className="border-none shadow-none bg-gray-50/50 transition-all duration-300">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-lg">Tags</CardTitle>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 w-8 p-0"
          >
            {isEditing ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveTags}
                className="h-8 w-8 p-0"
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isEditing ? (
          <div className="space-y-4 transition-all duration-300">
            <Select
              isMulti
              value={selectedTags.map(tag => ({ value: tag.id, label: tag.name }))}
              onChange={handleSelectTags}
              options={availableTags
                .filter(tag => !selectedTags.some(selected => selected.id === tag.id))
                .map(tag => ({ value: tag.id, label: tag.name }))
              }
              className="w-60"
              placeholder="Select tags"
            />

            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="flex items-center gap-1 transition-all duration-300">
                  {tag.name}
                  <button
                    onClick={() => handleRemoveTag(tag.id)}
                    className="ml-1 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 transition-all duration-300">
            {company.tags.length > 0 ? (
              company.tags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="transition-all duration-300">
                  {tag.name}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500 italic">No tags added</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 
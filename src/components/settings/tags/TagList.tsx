
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  fetchTags, 
  createTag,
  updateTag,
  deleteTag,
  selectAllTags
} from '@/store/slices/tags/tagsSlice';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Tag } from '@/types/tag';

const TagList = () => {
  const dispatch = useAppDispatch();
  const tags = useAppSelector(selectAllTags);
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#6366F1');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  
  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);
  
  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast({
        title: "Error",
        description: "Tag name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await dispatch(createTag({ name: newTagName, color: newTagColor }));
      setIsAdding(false);
      setNewTagName('');
      setNewTagColor('#6366F1');
      toast({
        title: "Success",
        description: "Tag created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      });
    }
  };
  
  const handleEditTag = async (tagId: string) => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Tag name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await dispatch(updateTag({ id: tagId, name: editName, color: editColor }));
      setEditingTagId(null);
      toast({
        title: "Success",
        description: "Tag updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tag",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTag = async (tagId: string) => {
    try {
      await dispatch(deleteTag(tagId));
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      });
    }
  };
  
  const startEditing = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditName(tag.name);
    setEditColor(tag.color);
  };
  
  const cancelEditing = () => {
    setEditingTagId(null);
  };
  
  const filteredTags = Array.isArray(tags) 
    ? tags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  
  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Tags</CardTitle>
          <Button size="sm" onClick={() => setIsAdding(true)} disabled={isAdding}>
            <Plus className="h-4 w-4 mr-1" /> Add Tag
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tags"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isAdding && (
          <div className="mb-4 p-3 border rounded-lg">
            <h3 className="text-sm font-medium mb-2">New Tag</h3>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1"
              />
              <Input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-14 p-1 h-10"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsAdding(false);
                  setNewTagName('');
                  setNewTagColor('#6366F1');
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreateTag}>
                Create Tag
              </Button>
            </div>
          </div>
        )}
        
        {filteredTags.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {searchTerm ? "No tags match your search" : "No tags created yet"}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTags.map((tag) => (
              <div key={tag.id} className="p-2 rounded-lg border flex justify-between items-center">
                {editingTagId === tag.id ? (
                  <>
                    <div className="flex gap-2 flex-1">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="color"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="w-14 p-1"
                      />
                    </div>
                    <div className="flex ml-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEditTag(tag.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={cancelEditing}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <Badge 
                        className="mr-2" 
                        style={{ backgroundColor: tag.color, color: 'white' }}
                      >
                        {tag.name}
                      </Badge>
                    </div>
                    <div>
                      <Button size="icon" variant="ghost" onClick={() => startEditing(tag)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteTag(tag.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TagList;

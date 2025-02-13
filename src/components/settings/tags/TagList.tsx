
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import EditTagDialog from './EditTagDialog';
import DeleteTagDialog from './DeleteTagDialog';
import TagUsageStats from './TagUsageStats';
import TagColorPreview from './TagColorPreview';
import TagActions from './TagActions';
import BulkActions from './BulkActions';
import type { Tag, SortField, FilterEntity } from '@/types/tag';
import SortingControls from '@/components/inbox/SortingControls';

const mockTags: Tag[] = [
  { 
    id: '1', 
    name: 'Bug', 
    color: '#EF4444', 
    counts: { tickets: 23, contacts: 5, companies: 2 } 
  },
  { 
    id: '2', 
    name: 'Feature Request', 
    color: '#3B82F6', 
    counts: { tickets: 15, contacts: 3, companies: 1 } 
  },
  { 
    id: '3', 
    name: 'Support', 
    color: '#10B981', 
    counts: { tickets: 45, contacts: 12, companies: 8 } 
  },
  { 
    id: '4', 
    name: 'Documentation', 
    color: '#F59E0B', 
    counts: { tickets: 8, contacts: 0, companies: 1 } 
  },
  { 
    id: '5', 
    name: 'Design', 
    color: '#8B5CF6', 
    counts: { tickets: 12, contacts: 4, companies: 2 } 
  }
];

interface TagListProps {
  searchQuery: string;
}

const TagList = ({ searchQuery }: TagListProps) => {
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterEntity, setFilterEntity] = useState<FilterEntity>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedTags.length === filteredTags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(filteredTags.map(tag => tag.id));
    }
  };

  const handleSelectTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleBulkDelete = () => {
    setTagToDelete({ id: selectedTags.join(','), name: `${selectedTags.length} tags`, color: '', counts: { tickets: 0, contacts: 0, companies: 0 } });
  };

  const handleBulkEdit = () => {
    setTagToEdit({ id: selectedTags.join(','), name: '', color: '', counts: { tickets: 0, contacts: 0, companies: 0 } });
  };

  let filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filterEntity !== 'all') {
    filteredTags = filteredTags.filter(tag => tag.counts[filterEntity] > 0);
  }

  filteredTags.sort((a, b) => {
    let valueA = sortField === 'name' ? a.name : a.counts[sortField];
    let valueB = sortField === 'name' ? b.name : b.counts[sortField];
    
    if (sortDirection === 'desc') {
      [valueA, valueB] = [valueB, valueA];
    }
    
    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {filteredTags.length} {filteredTags.length === 1 ? 'tag' : 'tags'} total
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={filterEntity}
            onValueChange={(value: FilterEntity) => setFilterEntity(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              <SelectItem value="tickets">Used in tickets</SelectItem>
              <SelectItem value="contacts">Used in contacts</SelectItem>
              <SelectItem value="companies">Used in companies</SelectItem>
            </SelectContent>
          </Select>
          <SortingControls
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            compact
          />
        </div>
      </div>

      <BulkActions
        selectedCount={selectedTags.length}
        onEditSelected={handleBulkEdit}
        onDeleteSelected={handleBulkDelete}
      />

      {filteredTags.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No tags found matching your search.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={selectedTags.length === filteredTags.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => handleSelectTag(tag.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <TagColorPreview color={tag.color} />
                    <span className="font-medium text-gray-900">{tag.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <TagUsageStats {...tag.counts} />
                </TableCell>
                <TableCell className="text-right">
                  <TagActions
                    tag={tag}
                    onEdit={setTagToEdit}
                    onDelete={setTagToDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {tagToEdit && (
        <EditTagDialog
          tag={tagToEdit}
          open={!!tagToEdit}
          onOpenChange={() => setTagToEdit(null)}
        />
      )}

      {tagToDelete && (
        <DeleteTagDialog
          tag={tagToDelete}
          open={!!tagToDelete}
          onOpenChange={() => setTagToDelete(null)}
        />
      )}
    </div>
  );
};

export default TagList;


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Tag } from '@/types/tag';
import TagColorPreview from './TagColorPreview';
import TagUsageStats from './TagUsageStats';
import TagActions from './TagActions';

interface TagTableProps {
  tags: Tag[];
  selectedTags: string[];
  onSelectAll: () => void;
  onSelectTag: (tagId: string) => void;
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (tag: Tag) => void;
}

const TagTable = ({
  tags,
  selectedTags,
  onSelectAll,
  onSelectTag,
  onEditTag,
  onDeleteTag,
}: TagTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30px]">
            <Checkbox
              checked={selectedTags.length === tags.length && tags.length > 0}
              onCheckedChange={onSelectAll}
            />
          </TableHead>
          <TableHead className="w-[250px]">Name</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags.map((tag) => (
          <TableRow key={tag.id}>
            <TableCell>
              <Checkbox
                checked={selectedTags.includes(tag.id)}
                onCheckedChange={() => onSelectTag(tag.id)}
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
                onEdit={onEditTag}
                onDelete={onDeleteTag}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TagTable;

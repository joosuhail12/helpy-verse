
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";
import type { Tag } from '@/types/tag';
import TagColorPreview from './TagColorPreview';
import TagUsageStats from './TagUsageStats';
import TagActions from './TagActions';
import TagUsageChart from './TagUsageChart';

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTrendIcon = (trend: Tag['trend']) => {
    switch (trend) {
      case 'increasing':
        return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
      case 'decreasing':
        return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <MinusIcon className="w-4 h-4 text-gray-500" />;
    }
  };

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
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead>Usage Stats</TableHead>
          <TableHead className="w-[250px]">Usage Trend</TableHead>
          <TableHead className="w-[150px]">Created</TableHead>
          <TableHead className="w-[150px]">Last Used</TableHead>
          <TableHead className="w-[100px]">Trend</TableHead>
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
            <TableCell>
              <TagUsageChart tag={tag} />
            </TableCell>
            <TableCell>{formatDate(tag.createdAt)}</TableCell>
            <TableCell>{formatDate(tag.lastUsed)}</TableCell>
            <TableCell>
              <div className="flex items-center justify-center">
                {getTrendIcon(tag.trend)}
              </div>
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


import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Search } from 'lucide-react';
import type { CannedResponse } from '@/mock/cannedResponses';
import { Link } from 'react-router-dom';

interface CannedResponseListProps {
  responses: CannedResponse[];
}

export const CannedResponseList = ({ responses }: CannedResponseListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResponses = responses.filter(response => 
    response.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    response.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    response.shortcut.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search responses..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Shortcut</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Shared</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResponses.map((response) => (
              <TableRow key={response.id}>
                <TableCell className="font-medium">{response.title}</TableCell>
                <TableCell>{response.shortcut}</TableCell>
                <TableCell>{response.category}</TableCell>
                <TableCell>{response.isShared ? 'Yes' : 'No'}</TableCell>
                <TableCell>{response.createdBy}</TableCell>
                <TableCell className="text-right">
                  <Link to={`/home/settings/canned-responses/${response.id}`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

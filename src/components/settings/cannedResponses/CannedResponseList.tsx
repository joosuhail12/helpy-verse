
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
import { Pencil, Search, Trash2 } from 'lucide-react';
import type { CannedResponse } from '@/mock/cannedResponses';
import { DeleteResponseDialog } from './DeleteResponseDialog';
import { EditResponseDialog } from './EditResponseDialog';
import { toast } from '@/components/ui/use-toast';

interface CannedResponseListProps {
  responses: CannedResponse[];
  setResponses: React.Dispatch<React.SetStateAction<CannedResponse[]>>;
}

export const CannedResponseList = ({ responses, setResponses }: CannedResponseListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<CannedResponse | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredResponses = responses.filter(response => 
    response.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    response.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    response.shortcut.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setResponses(responses.filter(r => r.id !== id));
    toast({
      title: "Success",
      description: "Canned response deleted successfully",
    });
  };

  const handleEdit = (updatedResponse: CannedResponse) => {
    setResponses(responses.map(r => r.id === updatedResponse.id ? updatedResponse : r));
    toast({
      title: "Success",
      description: "Canned response updated successfully",
    });
  };

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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedResponse(response);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedResponse(response);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteResponseDialog 
        response={selectedResponse}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
      />

      <EditResponseDialog 
        response={selectedResponse}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onEdit={handleEdit}
      />
    </div>
  );
};

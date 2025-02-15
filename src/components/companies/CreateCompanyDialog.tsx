
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addCompany } from '@/store/slices/companies/companiesSlice';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface CreateCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateCompanyDialog = ({ open, onOpenChange }: CreateCompanyDialogProps) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newCompany = {
        id: uuidv4(),
        name,
        website,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addCompany(newCompany));
      
      toast({
        title: "Success",
        description: "Company created successfully",
      });
      
      onOpenChange(false);
      setName('');
      setWebsite('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create company",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Company</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Enter company website"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Company'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCompanyDialog;

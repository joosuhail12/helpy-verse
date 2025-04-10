
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Contact } from '@/types/contact';

interface CreateContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateContactDialog = ({ open, onOpenChange }: CreateContactDialogProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [firstname, setFirstName] = React.useState('');
  const [lastname, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isCustomer, setIsCustomer] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newContact = {
        id: uuidv4(),
        firstname,
        lastname,
        email,
        type: isCustomer ? 'customer' : 'visitor' as const,
        status: 'active' as const,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await dispatch(addContact(newContact as Partial<Contact>)).unwrap();
      
      toast({
        title: "Success",
        description: "Contact created successfully",
      });
      
      onOpenChange(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setIsCustomer(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create contact",
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
          <DialogTitle>Create New Contact</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isCustomer"
              checked={isCustomer}
              onCheckedChange={(checked) => setIsCustomer(checked as boolean)}
            />
            <Label htmlFor="isCustomer">Is a customer?</Label>
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
              {isSubmitting ? 'Creating...' : 'Create Contact'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContactDialog;

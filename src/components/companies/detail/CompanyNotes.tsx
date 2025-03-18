
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Save, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Company } from '@/types/company';

interface CompanyNotesProps {
  company: Company;
}

export const CompanyNotes: React.FC<CompanyNotesProps> = ({ company }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(company.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const handleSaveNote = async () => {
    setIsSaving(true);
    try {
      // In a real application, we would dispatch an update to the Redux store
      // and persist changes to the backend
      // await dispatch(updateCompanyNotes({ id: company.id, notes: note }));
      
      toast({
        title: "Notes saved",
        description: "Company notes have been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error saving notes",
        description: "There was a problem saving your notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-gray-500" />
            <CardTitle className="text-lg">Notes</CardTitle>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {company.description ? 'Edit Notes' : 'Add Notes'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter notes about this company..."
              className="min-h-[200px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setNote(company.description || '');
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveNote} disabled={isSaving}>
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Notes
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : company.description ? (
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{company.description}</p>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <StickyNote className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
            <p>No notes available</p>
            <p className="text-sm mt-1">Click 'Add Notes' to create notes for this company</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyNotes;


import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { StickyNote, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface CompanyNotesProps {
  companyId: string;
  initialNotes?: string;
}

const CompanyNotes: React.FC<CompanyNotesProps> = ({ companyId, initialNotes = '' }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSaveNotes = async () => {
    if (!notes.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Notes saved",
        description: "Company notes have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-gray-500" />
          <CardTitle className="text-lg">Notes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Add notes about this company..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <Button
              size="sm"
              onClick={handleSaveNotes}
              className="absolute bottom-2 right-2"
              disabled={!notes.trim() || notes === initialNotes || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                'Save Notes'
              )}
            </Button>
          </div>
          
          {initialNotes && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <p className="text-sm whitespace-pre-wrap">{initialNotes}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Last updated: {format(new Date(), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyNotes;

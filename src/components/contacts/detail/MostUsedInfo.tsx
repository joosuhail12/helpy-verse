
import { Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Contact } from '@/types/contact';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface MostUsedInfoProps {
  contact: Contact;
}

export const MostUsedInfo = ({ contact }: MostUsedInfoProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copied!",
        description: `${label} has been copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <CardTitle className="text-lg">Most Used Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-2">
          {contact.email && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sm" 
              onClick={() => copyToClipboard(contact.email, 'Email')}
            >
              {contact.email}
            </Button>
          )}
          {contact.phone && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sm"
              onClick={() => copyToClipboard(contact.phone, 'Phone')}
            >
              {contact.phone}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

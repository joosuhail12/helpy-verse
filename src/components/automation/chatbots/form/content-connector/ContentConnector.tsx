
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ContentConnectorProps {
  onNextStep: () => void;
}

export const ContentConnector = ({ onNextStep }: ContentConnectorProps) => {
  const [selectedContents, setSelectedContents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const mockContents = [
    { id: '1', title: 'API Documentation', type: 'document' },
    { id: '2', title: 'Product Pricing Guide', type: 'document' },
    { id: '3', title: 'Customer Support FAQ', type: 'faq' },
    { id: '4', title: 'Marketing Templates', type: 'template' },
    { id: '5', title: 'Security Guidelines', type: 'document' },
  ];

  const handleContentSelect = (contentId: string) => {
    setSelectedContents(prev => {
      if (prev.includes(contentId)) {
        return prev.filter(id => id !== contentId);
      } else {
        return [...prev, contentId];
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connect Content Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="mb-4">
              <p>Select content sources to use for your chatbot</p>
            </div>

            <div className="relative mb-6">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <RadioGroup defaultValue="all">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All Content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selected" id="selected" />
                  <Label htmlFor="selected">Selected Content</Label>
                </div>
              </div>
            </RadioGroup>

            <div className="border rounded-md p-4 mt-4 space-y-2">
              {mockContents.map(content => (
                <div key={content.id} className="flex items-center space-x-2 py-2 border-b last:border-0">
                  <Checkbox
                    id={`content-${content.id}`}
                    checked={selectedContents.includes(content.id)}
                    onCheckedChange={() => handleContentSelect(content.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`content-${content.id}`}>{content.title}</Label>
                    <p className="text-sm text-gray-500">Type: {content.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Processing Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="chunks">Chunk Size</Label>
              <div className="flex items-center space-x-2">
                <Input id="chunks" value="1024" className="w-32" />
                <span className="text-sm text-gray-500">tokens</span>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="overlap">Chunk Overlap</Label>
              <div className="flex items-center space-x-2">
                <Input id="overlap" value="128" className="w-32" />
                <span className="text-sm text-gray-500">tokens</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNextStep}>
          Continue
        </Button>
      </div>
    </div>
  );
};

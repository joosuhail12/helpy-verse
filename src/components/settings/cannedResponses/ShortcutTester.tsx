
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Keyboard } from 'lucide-react';

interface ShortcutTesterProps {
  shortcut: string;
  content: string;  // Adding the content prop to match usage
}

export const ShortcutTester = ({ shortcut, content }: ShortcutTesterProps) => {
  const [testInput, setTestInput] = useState('');
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTriggered(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isTriggered]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTestInput(value);
    
    if (value.endsWith(shortcut + ' ')) {
      setIsTriggered(true);
      setTestInput('');
    }
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Test your shortcut</span>
          </div>
          <Input
            placeholder={`Type ${shortcut} to test the shortcut...`}
            value={testInput}
            onChange={handleInputChange}
            className={isTriggered ? 'border-green-500' : ''}
          />
          {isTriggered && (
            <div className="text-sm text-green-600">
              Shortcut activated successfully!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

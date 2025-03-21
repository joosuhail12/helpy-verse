
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShortcutTester } from '@/components/settings/cannedResponses/ShortcutTester';

interface PreviewTabProps {
  content: string;
  shortcut?: string;
}

export const PreviewTab = ({ content, shortcut }: PreviewTabProps) => {
  return (
    <div className="space-y-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Response Content</CardTitle>
          <CardDescription>
            Preview how this canned response will appear
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CardContent>
      </Card>
      
      {shortcut && (
        <Card>
          <CardHeader>
            <CardTitle>Test Shortcut</CardTitle>
            <CardDescription>
              Type "{shortcut}" followed by space to test the shortcut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShortcutTester 
              shortcut={shortcut} 
              content={content}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

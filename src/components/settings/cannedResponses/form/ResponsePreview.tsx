
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface ResponsePreviewProps {
  title: string;
  content: string;
}

export const ResponsePreview = ({ title, content }: ResponsePreviewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Eye className="h-4 w-4" />
        <CardTitle className="text-lg">Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="font-medium">{title}</div>
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </CardContent>
    </Card>
  );
};

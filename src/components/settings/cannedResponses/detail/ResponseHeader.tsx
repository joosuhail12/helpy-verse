
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash } from 'lucide-react';

interface ResponseHeaderProps {
  title: string;
  category?: string;
  shortcut?: string;
  id: string;
  onDeleteClick: () => void;
}

export const ResponseHeader = ({ 
  title, 
  category, 
  shortcut, 
  id, 
  onDeleteClick 
}: ResponseHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/home/settings/canned-responses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">
            {category || 'Uncategorized'} • Shortcut: {shortcut || 'None'}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onDeleteClick}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <Button 
          size="sm"
          onClick={() => {}}
          asChild
        >
          <Link to={`/home/settings/canned-responses/${id}/edit`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </div>
    </div>
  );
};

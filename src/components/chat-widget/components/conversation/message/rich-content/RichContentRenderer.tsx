
import React from 'react';
import { FileIcon, Image, Link } from 'lucide-react';

interface RichContentProps {
  content: {
    type: 'form' | 'url' | 'product';
    data: any;
  };
}

/**
 * Renders rich content in messages like forms, products, and links
 */
const RichContentRenderer: React.FC<RichContentProps> = ({ content }) => {
  switch (content.type) {
    case 'url':
      return (
        <a 
          href={content.data.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <Link className="h-4 w-4 mr-2 text-primary" />
          <span className="text-sm text-blue-600 underline">{content.data.title || content.data.url}</span>
        </a>
      );
      
    case 'product':
      return (
        <div className="flex flex-col p-2 bg-gray-50 rounded border border-gray-200">
          {content.data.imageUrl && (
            <img 
              src={content.data.imageUrl} 
              alt={content.data.name} 
              className="w-full h-32 object-cover mb-2 rounded"
            />
          )}
          <span className="font-medium">{content.data.name}</span>
          <span className="text-sm text-gray-600">{content.data.price}</span>
          {content.data.description && (
            <p className="text-sm mt-1">{content.data.description}</p>
          )}
        </div>
      );
      
    case 'form':
      return (
        <div className="p-2 bg-gray-50 rounded border border-gray-200">
          <h4 className="font-medium mb-2">{content.data.title}</h4>
          {content.data.fields?.map((field: any, index: number) => (
            <div key={index} className="mb-2">
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              <input 
                type={field.type || 'text'} 
                placeholder={field.placeholder} 
                className="w-full p-2 border rounded"
                disabled={true}
              />
            </div>
          ))}
        </div>
      );
      
    default:
      return null;
  }
};

export default RichContentRenderer;

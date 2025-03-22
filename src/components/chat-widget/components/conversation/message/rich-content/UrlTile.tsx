
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface UrlTileProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

const UrlTile: React.FC<UrlTileProps> = ({ url, title, description, image }) => {
  // Extract domain for display
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  // If no title is provided, use the URL
  const displayTitle = title || url;
  const domain = getDomain(url);

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      aria-label={`Visit ${displayTitle} at ${domain}`}
    >
      {image && (
        <div className="h-32 overflow-hidden bg-gray-100">
          <img 
            src={image} 
            alt={title || 'Link preview'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-sm line-clamp-2">{displayTitle}</h3>
            {description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>
            )}
            <div className="flex items-center text-xs text-gray-400 mt-2">
              <ExternalLink className="h-3 w-3 mr-1" />
              <span>{domain}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default UrlTile;

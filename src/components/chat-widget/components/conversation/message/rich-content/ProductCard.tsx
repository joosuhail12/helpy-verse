
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  productId: string;
  name: string;
  price: string;
  image?: string;
  description?: string;
  url?: string;
  onAction: (action: 'view' | 'buy', productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  name,
  price,
  image,
  description,
  url,
  onAction
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {image && (
        <div className="h-40 overflow-hidden bg-gray-100">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-3">
        <h3 className="font-medium text-sm">{name}</h3>
        <p className="text-sm font-bold text-primary mt-1">{price}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>
        )}
        <div className="flex space-x-2 mt-3">
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            onClick={() => onAction('view', productId)}
          >
            View Details
          </Button>
          <Button 
            size="sm"
            className="flex-1"
            onClick={() => onAction('buy', productId)}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

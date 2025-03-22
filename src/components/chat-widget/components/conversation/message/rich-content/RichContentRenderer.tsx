
import React from 'react';
import UrlTile from './UrlTile';
import FormMessage from './FormMessage';
import ProductCard from './ProductCard';

interface RichContentRendererProps {
  content: {
    type: 'form' | 'url' | 'product';
    data: any;
  };
}

const RichContentRenderer: React.FC<RichContentRendererProps> = ({ content }) => {
  if (!content || !content.type) return null;

  switch (content.type) {
    case 'url':
      return (
        <UrlTile
          url={content.data.url}
          title={content.data.title}
          description={content.data.description}
          image={content.data.image}
        />
      );
    case 'form':
      return (
        <FormMessage
          title={content.data.title}
          description={content.data.description}
          fields={content.data.fields}
          submitLabel={content.data.submitLabel}
          onSubmit={content.data.onSubmit || (() => {})}
          isSubmitted={content.data.isSubmitted}
        />
      );
    case 'product':
      return (
        <ProductCard
          productId={content.data.id}
          name={content.data.name}
          price={content.data.price}
          image={content.data.image}
          description={content.data.description}
          url={content.data.url}
          onAction={content.data.onAction || (() => {})}
        />
      );
    default:
      return null;
  }
};

export default RichContentRenderer;

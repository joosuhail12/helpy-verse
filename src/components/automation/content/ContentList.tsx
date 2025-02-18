
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { Content } from '@/types/content';

interface ContentListProps {
  searchQuery: string;
}

export const ContentList = ({ searchQuery }: ContentListProps) => {
  const navigate = useNavigate();
  const items = useAppSelector((state) => state.content.items);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContentClick = (id: string) => {
    navigate(`/automation/content/${id}`);
  };

  return (
    <div className="space-y-4">
      {filteredItems.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">No content found</p>
        </Card>
      ) : (
        filteredItems.map((item: Content) => (
          <Card 
            key={item.id}  
            className="p-6 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleContentClick(item.id)}
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

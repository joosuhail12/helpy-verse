
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchContent, updateContent } from '@/store/slices/content/contentSlice';
import { ContentDetailHeader } from '@/components/automation/content/detail/ContentDetailHeader';
import { ContentPreview } from '@/components/automation/content/detail/ContentPreview';
import { ContentForm } from '@/components/automation/content/detail/ContentForm';
import { ContentSharing } from '@/components/automation/content/detail/ContentSharing';
import { ContentTags } from '@/components/automation/content/detail/ContentTags';
import { ContentReindexCard } from '@/components/automation/content/detail/ContentReindexCard';
import { ContentComments } from '@/components/automation/content/detail/ContentComments';
import { ChatbotConnection } from '@/components/automation/content/detail/ChatbotConnection';
import { ContentVersion } from '@/types/content';

const ContentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  const content = useAppSelector(state => state.content.selectedContent);
  const loading = useAppSelector(state => state.content.loading);
  const error = useAppSelector(state => state.content.error);
  
  // Mock categories for the form
  const categories = [
    { id: 'product', name: 'Product' },
    { id: 'support', name: 'Support' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'hr', name: 'HR' },
    { id: 'development', name: 'Development' },
  ];
  
  // Mock current user
  const currentUser = {
    id: 'user1',
    name: 'Admin User',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Admin',
    email: 'admin@example.com'
  };
  
  useEffect(() => {
    if (id) {
      dispatch(fetchContent(id));
    }
  }, [id, dispatch]);
  
  if (loading || !content) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }
  
  const handleUpdate = (updates: Partial<typeof content>) => {
    if (id) {
      dispatch(updateContent({ id, updates }));
    }
  };
  
  const handleRestore = (version: ContentVersion) => {
    handleUpdate({ content: version.content });
  };
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <ContentDetailHeader content={content} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <ContentForm 
            content={content} 
            onUpdate={handleUpdate} 
            categories={categories}
            currentUser={currentUser}
          />
          
          <ContentComments contentId={content.id} />
          
          <ContentPreview 
            content={content} 
            onRestore={handleRestore}
            currentUser={currentUser}
          />
        </div>
        
        <div className="space-y-6">
          <ChatbotConnection content={content} onUpdate={handleUpdate} />
          <ContentTags content={content} onUpdate={handleUpdate} />
          <ContentSharing content={content} onUpdate={handleUpdate} />
          <ContentReindexCard content={content} />
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;


import React from 'react';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';
import { ChatWidget } from '@/widgets/chat';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
      
      {/* Chat widget with fixed positioning and right alignment */}
      <div className="fixed bottom-4 right-4 z-50">
        <ChatWidget 
          workspaceId="workspace-123" 
          theme={{
            position: 'right',
            compact: false
          }}
        />
      </div>
    </div>
  );
};

export default MainLayout;

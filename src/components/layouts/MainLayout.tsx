
import React from 'react';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';
import { ChatWidget } from '@/widgets/chat';
import { WidgetStateProvider } from '@/widgets/chat/context/WidgetStateContext';

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
      
      {/* Chat widget with fixed positioning in bottom right corner */}
      <WidgetStateProvider instanceId="main-layout">
        <ChatWidget 
          workspaceId="workspace-123" 
          theme={{
            position: 'right',
            compact: false
          }}
        />
      </WidgetStateProvider>
    </div>
  );
};

export default MainLayout;

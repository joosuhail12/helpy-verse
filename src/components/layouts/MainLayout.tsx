
import React from 'react';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Import ChatWidget normally rather than lazily to avoid dynamic import issues
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
      
      {/* Chat widget with direct import */}
      <ChatWidget workspaceId="workspace-123" />
    </div>
  );
};

export default MainLayout;

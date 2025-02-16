
import { Bot } from 'lucide-react';

export const ContentHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Content Center</h1>
        <p className="text-sm text-gray-500">
          Manage and organize your AI chatbot content in one place
        </p>
      </div>
      <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
        <Bot className="h-5 w-5 text-purple-600" />
      </div>
    </div>
  );
};

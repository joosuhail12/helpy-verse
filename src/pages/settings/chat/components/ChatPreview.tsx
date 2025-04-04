
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface ChatPreviewProps {
  primaryColor: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  position: string;
}

/**
 * Preview component for chat widget
 */
const ChatPreview = ({ primaryColor, welcomeTitle, welcomeSubtitle, position }: ChatPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget Preview</CardTitle>
        <CardDescription>See how your chat widget will appear</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-6">
        <div className="relative w-64 h-80 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md">
          <div className="h-12 bg-purple-600" style={{ backgroundColor: primaryColor }}>
            <div className="flex items-center h-full px-4">
              <span className="text-white font-medium">Chat with us</span>
            </div>
          </div>
          <div className="p-4 h-full bg-gray-50 flex flex-col">
            <div className="flex-1 overflow-auto">
              <div className="mb-4 p-3 bg-gray-100 rounded-lg max-w-[80%]">
                <p className="text-sm font-bold">{welcomeTitle}</p>
                <p className="text-sm text-gray-600">{welcomeSubtitle}</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex border rounded-full bg-white p-1">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 bg-transparent border-none focus:outline-none text-sm"
                  readOnly
                />
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11h2v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div 
            className={`absolute ${position === 'right' ? 'right-3' : 'left-3'} -bottom-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg`}
            style={{ backgroundColor: primaryColor }}
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatPreview;


import React from 'react';
import { ArrowLeft, User, Mail, FileText } from 'lucide-react';

interface InfoStepProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

/**
 * Information collection step for new chat
 */
const InfoStep: React.FC<InfoStepProps> = ({
  name,
  setName,
  email,
  setEmail,
  topic,
  setTopic,
  onSubmit,
  onBack
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 py-3 border-b flex items-center gap-3 sticky top-0 bg-white z-10 shadow-sm">
        <button 
          onClick={onBack} 
          className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="font-semibold text-gray-800">Start New Conversation</h2>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <p className="text-gray-600 text-sm">
            Please provide your information to help us serve you better
          </p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Your Name
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent bg-white shadow-sm"
                placeholder="John Doe"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent bg-white shadow-sm"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Topic
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <FileText className="h-4 w-4" />
              </div>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent appearance-none bg-white shadow-sm"
              >
                <option value="Support">Support</option>
                <option value="Billing">Billing</option>
                <option value="Technical">Technical</option>
                <option value="Sales">Sales</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            Continue
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default InfoStep;

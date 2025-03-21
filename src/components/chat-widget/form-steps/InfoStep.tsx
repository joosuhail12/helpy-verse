
import React, { useState, FormEvent } from 'react';
import { ArrowLeft, User, Mail } from 'lucide-react';

interface InfoStepProps {
  initialData: {
    name: string;
    email: string;
    topic: string;
  };
  onSubmit: (data: { name: string; email: string; topic: string }) => void;
  onCancel: () => void;
}

/**
 * Information collection step for new chat
 */
const InfoStep: React.FC<InfoStepProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  const [topic, setTopic] = useState(initialData.topic);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, topic });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-3 py-2 border-b flex items-center gap-2 sticky top-0 bg-white z-10 shadow-sm">
        <button 
          onClick={onCancel} 
          className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="font-semibold text-gray-800 text-sm">Start New Conversation</h2>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="text-gray-600 text-xs">
            Please provide your information to help us serve you better
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent bg-white shadow-sm text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent bg-white shadow-sm text-sm"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How can we help you?
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent bg-white shadow-sm text-sm"
              placeholder="Briefly describe your question or issue"
              rows={3}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
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

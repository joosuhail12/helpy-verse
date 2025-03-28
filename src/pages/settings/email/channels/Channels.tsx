import React from 'react';
import { ChannelDetailHeader } from './components/detail/ChannelDetailHeader';

const Channels = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Email Channels</h1>
      <p className="text-gray-600 mb-6">Configure and manage your email channels for communication.</p>
      
      {/* Channel list will be implemented here */}
      <div className="bg-gray-100 p-8 rounded-md text-center">
        <p className="text-gray-500">No channels configured yet.</p>
      </div>
    </div>
  );
};

export default Channels;

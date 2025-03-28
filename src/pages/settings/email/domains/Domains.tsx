import React from 'react';

const Domains = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Email Domains</h1>
      <p className="text-gray-600 mb-6">Manage your email domains for sending and receiving emails.</p>
      
      {/* Domain list will be implemented here */}
      <div className="bg-gray-100 p-8 rounded-md text-center">
        <p className="text-gray-500">No domains configured yet.</p>
      </div>
    </div>
  );
};

export default Domains;

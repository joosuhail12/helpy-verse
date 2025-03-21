
import React from 'react';

/**
 * ProTip component displaying helpful information for users
 */
const ProTip = () => {
  return (
    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
      <h4 className="font-medium text-blue-800 text-sm mb-1">💡 Pro Tip</h4>
      <p className="text-sm text-blue-700">
        Send us a screenshot if you're experiencing an issue - it helps us resolve your problem faster.
      </p>
    </div>
  );
};

export default ProTip;

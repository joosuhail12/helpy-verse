
import { UsersRound } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <div className="bg-gray-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <UsersRound className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No teammates found</h3>
      <p className="text-gray-500 mb-6">There are no teammates matching your current filters.</p>
    </div>
  );
};

export default EmptyState;

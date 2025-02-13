
import { Users } from "lucide-react";

const TeamsEmptyState = () => {
  return (
    <div className="text-center py-12">
      <Users className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No teams yet</h3>
      <p className="mt-2 text-sm text-gray-500">
        Get started by creating your first team
      </p>
    </div>
  );
};

export default TeamsEmptyState;

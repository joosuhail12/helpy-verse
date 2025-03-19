
import { AlertTriangle } from "lucide-react";

const ValidationWarning = () => {
  return (
    <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 flex items-center gap-2 border border-red-100">
      <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
      <span>Please complete all required fields before submitting</span>
    </div>
  );
};

export default ValidationWarning;


import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, RotateCcw, Scale } from "lucide-react";

interface TeamRoutingProps {
  routing: {
    type: 'manual' | 'round-robin' | 'load-balanced';
    limits?: {
      maxTickets?: number;
      maxOpenTickets?: number;
      maxActiveChats?: number;
    };
  };
}

const TeamRouting = ({ routing }: TeamRoutingProps) => {
  const getRoutingIcon = (type: string) => {
    switch (type) {
      case 'manual':
        return <ArrowLeftRight className="h-5 w-5" />;
      case 'round-robin':
        return <RotateCcw className="h-5 w-5" />;
      case 'load-balanced':
        return <Scale className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {getRoutingIcon(routing.type)}
        <Badge className="capitalize">{routing.type.replace('-', ' ')}</Badge>
      </div>

      {routing.type === 'load-balanced' && routing.limits && (
        <div className="space-y-4 mt-4">
          <h3 className="font-medium text-sm text-gray-500">Routing Limits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {routing.limits.maxTickets && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Max Tickets</p>
                <p className="text-2xl font-semibold">{routing.limits.maxTickets}</p>
              </div>
            )}
            {routing.limits.maxOpenTickets && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Max Open Tickets</p>
                <p className="text-2xl font-semibold">{routing.limits.maxOpenTickets}</p>
              </div>
            )}
            {routing.limits.maxActiveChats && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Max Active Chats</p>
                <p className="text-2xl font-semibold">{routing.limits.maxActiveChats}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamRouting;


import { useAppSelector } from '@/hooks/useAppSelector';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { TicketStatusBreakdown } from '@/components/dashboard/TicketStatusBreakdown';
import { TeamPerformance } from '@/components/dashboard/TeamPerformance';

const Dashboard = () => {
  // Use auth state without trying to extract user
  const auth = useAppSelector((state) => state.auth);
  const tickets = useAppSelector((state) => state.tickets);
  const content = useAppSelector((state) => state.content);
  const tags = useAppSelector((state) => state.tags);
  
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <DashboardMetrics />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCharts />
        <RecentActivities />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TicketStatusBreakdown />
        <TeamPerformance />
      </div>
    </div>
  );
};

export default Dashboard;

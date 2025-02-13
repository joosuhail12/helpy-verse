
interface TagUsageStatsProps {
  tickets: number;
  contacts: number;
  companies: number;
}

const TagUsageStats = ({ tickets, contacts, companies }: TagUsageStatsProps) => {
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-indigo-600/70">{tickets} tickets</span>
      <span className="text-gray-300">•</span>
      <span className="text-purple-600/70">{contacts} contacts</span>
      <span className="text-gray-300">•</span>
      <span className="text-blue-600/70">{companies} companies</span>
    </div>
  );
};

export default TagUsageStats;

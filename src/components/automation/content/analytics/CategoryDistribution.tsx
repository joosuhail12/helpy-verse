
import { useAppSelector } from '@/hooks/useAppSelector';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const COLORS = ['#9333EA', '#22C55E', '#3B82F6', '#EAB308', '#EC4899', '#14B8A6', '#F97316', '#6366F1'];

export const CategoryDistribution = () => {
  const items = useAppSelector((state) => state.content.items);
  
  const categoryData = items.reduce((acc: { name: string; value: number }[], item) => {
    const existingCategory = acc.find(c => c.name === item.category);
    if (existingCategory) {
      existingCategory.value += 1;
    } else {
      acc.push({ name: item.category, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div>
      <h3 className="text-sm font-medium mb-4">Content Category Distribution</h3>
      <div className="h-[280px]">
        <ChartContainer
          id="category-distribution"
          config={{
            pie: {
              theme: {
                light: "#9333EA",
                dark: "#9333EA",
              },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={(entry) => entry.name}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent
                        active={active}
                        payload={payload}
                      />
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

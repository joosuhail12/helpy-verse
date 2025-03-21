
import { useAppSelector } from '@/hooks/useAppSelector';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const MessageVolumeTrends = () => {
  const contentState = useAppSelector((state) => state.content);
  const items = contentState?.items || [];

  // Group messages by content category
  const volumeData = items.reduce((acc: any[], item) => {
    const existingCategory = acc.find(c => c.category === item.category);
    
    if (existingCategory) {
      existingCategory.messages += item.messageCount;
    } else {
      acc.push({
        category: item.category || 'Uncategorized',
        messages: item.messageCount || 0,
      });
    }
    
    return acc;
  }, []);

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-4">Message Volume by Category</h3>
      <div className="h-[200px]">
        <ChartContainer
          id="message-volume"
          config={{
            bar: {
              theme: {
                light: "#9333EA",
                dark: "#9333EA",
              },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData} margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
              <XAxis
                dataKey="category"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar
                dataKey="messages"
                fill="var(--color-bar)"
                radius={[4, 4, 0, 0]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent
                        active={active}
                        payload={payload}
                        label={label}
                      />
                    );
                  }
                  return null;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};

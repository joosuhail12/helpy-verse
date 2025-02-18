
import { useAppSelector } from '@/hooks/useAppSelector';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useState } from 'react';

type TimeInterval = 'daily' | 'weekly' | 'monthly';

export const ContentTrendsChart = () => {
  const items = useAppSelector((state) => state.content.items);
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('daily');

  // Group content by date and count creations per interval
  const trendsData = items.reduce((acc: any[], item) => {
    const date = format(new Date(item.lastUpdated), 
      timeInterval === 'daily' ? 'MMM d' :
      timeInterval === 'weekly' ? 'wo week' : 'MMM yyyy'
    );
    
    const existingDate = acc.find(d => d.date === date);
    
    if (existingDate) {
      existingDate.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    
    return acc;
  }, []);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Content Creation Trends</h3>
        <ToggleGroup type="single" value={timeInterval} onValueChange={(value) => value && setTimeInterval(value as TimeInterval)}>
          <ToggleGroupItem value="daily" aria-label="Daily view">
            Daily
          </ToggleGroupItem>
          <ToggleGroupItem value="weekly" aria-label="Weekly view">
            Weekly
          </ToggleGroupItem>
          <ToggleGroupItem value="monthly" aria-label="Monthly view">
            Monthly
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="h-[200px]">
        <ChartContainer
          id="content-trends"
          config={{
            area: {
              theme: {
                light: "rgba(147, 51, 234, 0.3)",
                dark: "rgba(147, 51, 234, 0.2)",
              },
            },
            line: {
              theme: {
                light: "#9333EA",
                dark: "#9333EA",
              },
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendsData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--color-line)"
                fill="var(--color-area)"
                strokeWidth={2}
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
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};


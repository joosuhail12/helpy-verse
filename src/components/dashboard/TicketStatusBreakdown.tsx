
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Open', value: 40, color: '#3b82f6' },
  { name: 'In Progress', value: 30, color: '#f59e0b' },
  { name: 'Resolved', value: 20, color: '#10b981' },
  { name: 'Closed', value: 10, color: '#6b7280' },
];

export const TicketStatusBreakdown = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Ticket Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

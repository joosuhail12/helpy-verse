
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const TicketStatusBreakdown = () => {
  const data = [
    { name: 'Open', value: 42, color: '#3b82f6' },
    { name: 'In Progress', value: 28, color: '#f59e0b' },
    { name: 'Resolved', value: 58, color: '#10b981' },
    { name: 'Closed', value: 35, color: '#6b7280' }
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Ticket Status</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

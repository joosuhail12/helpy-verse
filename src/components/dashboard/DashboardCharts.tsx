
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', tickets: 40 },
  { name: 'Feb', tickets: 30 },
  { name: 'Mar', tickets: 45 },
  { name: 'Apr', tickets: 50 },
  { name: 'May', tickets: 35 },
  { name: 'Jun', tickets: 60 },
  { name: 'Jul', tickets: 65 },
];

export const DashboardCharts = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Ticket Volume Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tickets" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

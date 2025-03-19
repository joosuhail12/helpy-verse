
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export const TeamPerformance = () => {
  const teamMembers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/avatars/01.png',
      role: 'Support Agent',
      performance: 92,
      tickets: 48
    },
    {
      id: '2',
      name: 'Michael Brown',
      avatar: '/avatars/02.png',
      role: 'Support Agent',
      performance: 85,
      tickets: 42
    },
    {
      id: '3',
      name: 'Emily Davis',
      avatar: '/avatars/03.png',
      role: 'Support Agent',
      performance: 78,
      tickets: 36
    },
    {
      id: '4',
      name: 'David Wilson',
      avatar: '/avatars/04.png',
      role: 'Support Agent',
      performance: 95,
      tickets: 51
    }
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map(member => (
            <div key={member.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium">{member.tickets} tickets</p>
                  <p className="text-xs text-muted-foreground">{member.performance}% resolved</p>
                </div>
              </div>
              <Progress value={member.performance} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

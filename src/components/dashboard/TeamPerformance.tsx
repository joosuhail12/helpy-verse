
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const teamMembers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '/avatars/sarah.jpg',
    ticketsResolved: 45,
    totalTickets: 50,
    responseTime: '1.2h',
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: '/avatars/mike.jpg',
    ticketsResolved: 38,
    totalTickets: 45,
    responseTime: '1.8h',
  },
  {
    id: '3',
    name: 'Emma Davis',
    avatar: '/avatars/emma.jpg',
    ticketsResolved: 42,
    totalTickets: 45,
    responseTime: '1.5h',
  },
  {
    id: '4',
    name: 'James Wilson',
    avatar: '/avatars/james.jpg',
    ticketsResolved: 30,
    totalTickets: 35,
    responseTime: '2.1h',
  },
];

export const TeamPerformance = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {member.ticketsResolved}/{member.totalTickets} tickets • {member.responseTime} avg
                </div>
              </div>
              <Progress 
                value={(member.ticketsResolved / member.totalTickets) * 100} 
                className="h-2" 
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

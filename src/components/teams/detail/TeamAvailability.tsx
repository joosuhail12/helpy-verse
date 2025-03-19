
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DayOfWeek, TimeSlot, Holiday } from '@/types/team';

interface TeamAvailabilityProps {
  officeHours: {
    [key in DayOfWeek.Monday | DayOfWeek.Tuesday | DayOfWeek.Wednesday | DayOfWeek.Thursday | DayOfWeek.Friday | DayOfWeek.Saturday | DayOfWeek.Sunday]?: TimeSlot[];
  };
  holidays: Holiday[];
}

const TeamAvailability = ({ officeHours, holidays }: TeamAvailabilityProps) => {
  const daysOfWeek = [
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday,
    DayOfWeek.Saturday,
    DayOfWeek.Sunday
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium mb-3">Office Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {daysOfWeek.map((day) => (
            <Card key={day} className={`${!officeHours[day]?.length ? 'bg-gray-50' : ''}`}>
              <CardContent className="py-3">
                <div className="flex justify-between items-center">
                  <span className="capitalize">{day}</span>
                  {!officeHours[day]?.length ? (
                    <Badge variant="outline" className="text-gray-500">Closed</Badge>
                  ) : (
                    <div className="text-right">
                      {officeHours[day]?.map((timeSlot, idx) => (
                        <div key={idx} className="text-sm">
                          {timeSlot.start} - {timeSlot.end}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-3">Holidays</h3>
        {holidays.length === 0 ? (
          <p className="text-gray-500 text-sm">No holidays set</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {holidays.map((holiday) => (
              <Card key={holiday.date}>
                <CardContent className="py-3">
                  <div className="flex justify-between items-center">
                    <span>{holiday.name}</span>
                    <Badge variant="outline">{holiday.date}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamAvailability;

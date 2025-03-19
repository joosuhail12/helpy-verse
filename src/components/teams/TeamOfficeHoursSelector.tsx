
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Clock } from "lucide-react";
import { DayOfWeek, TimeSlot } from '@/types/team';

interface TeamOfficeHoursSelectorProps {
  officeHours: { [key in DayOfWeek]?: TimeSlot[] };
  onOfficeHoursChange: (hours: { [key in DayOfWeek]?: TimeSlot[] }) => void;
}

const TeamOfficeHoursSelector = ({ 
  officeHours,
  onOfficeHoursChange 
}: TeamOfficeHoursSelectorProps) => {
  // Create array of days for iteration
  const daysOfWeek = [
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday,
    DayOfWeek.Saturday,
    DayOfWeek.Sunday
  ];

  const addTimeSlot = (day: DayOfWeek) => {
    const updatedHours = { ...officeHours };
    if (!updatedHours[day]) {
      updatedHours[day] = [];
    }
    updatedHours[day]?.push({ start: '09:00', end: '17:00' });
    onOfficeHoursChange(updatedHours);
  };

  const removeTimeSlot = (day: DayOfWeek, index: number) => {
    const updatedHours = { ...officeHours };
    if (updatedHours[day] && updatedHours[day]?.length > 0) {
      updatedHours[day] = updatedHours[day]?.filter((_, i) => i !== index);
    }
    onOfficeHoursChange(updatedHours);
  };

  const updateTimeSlot = (day: DayOfWeek, index: number, field: 'start' | 'end', value: string) => {
    const updatedHours = { ...officeHours };
    if (updatedHours[day] && updatedHours[day]?.[index]) {
      const slots = [...(updatedHours[day] || [])];
      slots[index] = { ...slots[index], [field]: value };
      updatedHours[day] = slots;
      onOfficeHoursChange(updatedHours);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium">Office Hours</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {daysOfWeek.map((day) => (
          <Card key={day} className={officeHours[day]?.length === 0 ? 'bg-gray-50' : ''}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium capitalize">{day}</h4>
                {officeHours[day]?.length === 0 ? (
                  <Badge variant="outline" className="text-gray-500">Closed</Badge>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => addTimeSlot(day)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Time
                  </Button>
                )}
              </div>
              
              {officeHours[day]?.length === 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => addTimeSlot(day)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Set Hours
                </Button>
              ) : (
                <div className="space-y-3">
                  {officeHours[day]?.map((timeSlot, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="grid gap-2">
                        <Label htmlFor={`${day}-start-${index}`} className="sr-only">Start Time</Label>
                        <Input
                          id={`${day}-start-${index}`}
                          type="time"
                          value={timeSlot.start}
                          onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                          className="w-24"
                        />
                      </div>
                      <span className="text-center">to</span>
                      <div className="grid gap-2">
                        <Label htmlFor={`${day}-end-${index}`} className="sr-only">End Time</Label>
                        <Input
                          id={`${day}-end-${index}`}
                          type="time"
                          value={timeSlot.end}
                          onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                          className="w-24"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimeSlot(day, index)}
                        className="h-8 w-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamOfficeHoursSelector;

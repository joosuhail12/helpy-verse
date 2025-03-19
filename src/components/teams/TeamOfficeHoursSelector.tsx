
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import type { DayOfWeek, TeamOfficeHoursSelectorProps, TimeSlot } from '@/types/team';
import { Input } from "@/components/ui/input";

const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const TeamOfficeHoursSelector = ({ 
  officeHours,
  onOfficeHoursChange
}: TeamOfficeHoursSelectorProps) => {
  const formatDayLabel = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const addTimeSlot = (day: DayOfWeek) => {
    const newOfficeHours = { ...officeHours };
    newOfficeHours[day] = [...(newOfficeHours[day] || []), { start: '09:00', end: '17:00' }];
    onOfficeHoursChange(newOfficeHours);
  };

  const removeTimeSlot = (day: DayOfWeek, index: number) => {
    const newOfficeHours = { ...officeHours };
    newOfficeHours[day] = newOfficeHours[day].filter((_, i) => i !== index);
    onOfficeHoursChange(newOfficeHours);
  };

  const updateTimeSlot = (day: DayOfWeek, index: number, field: keyof TimeSlot, value: string) => {
    const newOfficeHours = { ...officeHours };
    newOfficeHours[day] = newOfficeHours[day].map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    );
    onOfficeHoursChange(newOfficeHours);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Office Hours</h3>
      </div>
      
      <div className="space-y-6">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="space-y-3">
            <Label className="font-medium">{formatDayLabel(day)}</Label>
            
            <div className="space-y-3">
              {officeHours[day]?.map((slot, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    type="time"
                    value={slot.start}
                    onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                    className="w-32"
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={slot.end}
                    onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTimeSlot(day, index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTimeSlot(day)}
              >
                Add Time Slot
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamOfficeHoursSelector;

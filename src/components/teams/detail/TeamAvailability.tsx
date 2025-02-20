import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import type { DayOfWeek, TimeSlot } from '@/types/team';

interface TeamAvailabilityProps {
  officeHours: {
    [key in DayOfWeek]: TimeSlot[];
  };
  holidays: string[];
}


const TeamAvailability = ({ officeHours, holidays }: TeamAvailabilityProps) => {
  const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  console.log(officeHours, holidays);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-medium">Office Hours</h3>
        <div className="space-y-4">

          {daysOfWeek && daysOfWeek.length > 0 && officeHours && Object.keys(officeHours).length > 0 && daysOfWeek?.map((day) => (
            <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="capitalize font-medium">{day}</span>
              <div className="flex gap-2">
                {officeHours[day].length > 0 ? (
                  officeHours[day].map((slot, index) => (
                    <Badge key={index} variant="outline">
                      {slot.start} - {slot.end}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary">Closed</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Team Holidays</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Calendar
            mode="multiple"
            selected={holidays?.map(date => new Date(date))}
            className="rounded-md border"
            disabled
          />
          <div className="space-y-2">
            {holidays && holidays.length > 0 ? (
              [...holidays].sort().map((date) => (
                <div key={date} className="p-2 bg-gray-50 rounded-md">
                  {format(new Date(date), 'PPP')}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No holidays configured</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAvailability;

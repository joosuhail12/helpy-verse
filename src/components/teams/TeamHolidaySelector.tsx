
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TeamHolidaySelectorProps } from "@/types/team";

const TeamHolidaySelector = ({ selectedHolidays, onHolidaysChange }: TeamHolidaySelectorProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateString = date.toISOString().split('T')[0];
    const newHolidays = selectedHolidays.includes(dateString)
      ? selectedHolidays.filter(d => d !== dateString)
      : [...selectedHolidays, dateString];
    
    onHolidaysChange(newHolidays);
  };

  const removeHoliday = (dateString: string) => {
    const newHolidays = selectedHolidays.filter(d => d !== dateString);
    onHolidaysChange(newHolidays);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Team Holidays</h3>
      </div>

      <div className="space-y-6">
        <TooltipProvider>
          <Calendar
            mode="single"
            onSelect={handleDateSelect}
            className="rounded-md border mx-auto"
            selected={selectedHolidays.length > 0 ? new Date(selectedHolidays[selectedHolidays.length - 1]) : undefined}
            modifiers={{
              booked: selectedHolidays.map(date => new Date(date))
            }}
            modifiersStyles={{
              booked: { backgroundColor: 'rgb(var(--primary))' }
            }}
          />
        </TooltipProvider>

        <div className="space-y-4">
          <h4 className="font-medium">Selected Holidays</h4>
          {selectedHolidays.length === 0 ? (
            <p className="text-sm text-gray-500">No holidays selected</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedHolidays.sort().map((dateString) => (
                <div key={dateString} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span>{format(new Date(dateString), 'PPP')}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHoliday(dateString)}
                        >
                          Remove
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove this holiday</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamHolidaySelector;

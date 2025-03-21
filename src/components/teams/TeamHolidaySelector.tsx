
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, CalendarIcon, Plus } from 'lucide-react';
import type { TeamHolidaySelectorProps } from '@/types/team';

const TeamHolidaySelector = ({
  selectedHolidays,
  onHolidaysChange,
}: TeamHolidaySelectorProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [holidayName, setHolidayName] = useState('');
  
  const handleAddHoliday = () => {
    if (!selectedDate) return;
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    
    // Create a new array instead of modifying the original
    const updatedHolidays = [...selectedHolidays, dateString];
    
    onHolidaysChange(updatedHolidays);
    setSelectedDate(undefined);
    setHolidayName('');
    setIsCalendarOpen(false);
  };
  
  const handleRemoveHoliday = (dateToRemove: string) => {
    // Create a new array instead of modifying the original
    const updatedHolidays = selectedHolidays.filter(date => date !== dateToRemove);
    onHolidaysChange(updatedHolidays);
  };
  
  // Create a copy of the array and then sort to avoid mutating the original
  const sortedHolidays = selectedHolidays ? [...selectedHolidays].sort((a, b) => {
    return parseISO(a).getTime() - parseISO(b).getTime();
  }) : [];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Company Holidays</h3>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Holiday</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Select Holiday Date</h4>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </div>
              
              <div>
                <label htmlFor="holiday-name" className="text-sm font-medium mb-2 block">
                  Holiday Name (Optional)
                </label>
                <input
                  id="holiday-name"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  placeholder="e.g. Christmas Day"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsCalendarOpen(false);
                    setSelectedDate(undefined);
                    setHolidayName('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddHoliday}
                  disabled={!selectedDate}
                >
                  Add
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {sortedHolidays.length > 0 ? (
        <ScrollArea className="h-[150px] border rounded-md p-2">
          <div className="space-y-2">
            {sortedHolidays.map((date) => (
              <div key={date} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {format(parseISO(date), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleRemoveHoliday(date)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="border rounded-md p-4 text-center text-muted-foreground text-sm">
          No company holidays added
        </div>
      )}
    </div>
  );
};

export default TeamHolidaySelector;

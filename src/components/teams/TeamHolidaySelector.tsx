
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TeamHolidaySelectorProps {
  selectedHolidays: string[];
  onHolidaysChange: (holidays: string[]) => void;
}

const TeamHolidaySelector = ({ 
  selectedHolidays, 
  onHolidaysChange 
}: TeamHolidaySelectorProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [holidayName, setHolidayName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddHoliday = () => {
    if (date && holidayName.trim()) {
      const dateString = format(date, 'yyyy-MM-dd');
      if (!selectedHolidays.includes(dateString)) {
        onHolidaysChange([...selectedHolidays, dateString]);
      }
      // Reset form
      setDate(undefined);
      setHolidayName('');
      setShowAddForm(false);
    }
  };

  const handleRemoveHoliday = (holidayToRemove: string) => {
    onHolidaysChange(selectedHolidays.filter(h => h !== holidayToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium">Holidays</h3>
        {!showAddForm && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Holiday
          </Button>
        )}
      </div>
      
      {showAddForm ? (
        <div className="space-y-4 border rounded-md p-4">
          <div className="grid gap-2">
            <Label htmlFor="holiday-name">Holiday Name</Label>
            <Input
              id="holiday-name"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              placeholder="e.g., New Year's Day"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddHoliday}
              disabled={!date || !holidayName.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {selectedHolidays.length === 0 ? (
            <div className="text-center py-6 border rounded-md">
              <p className="text-sm text-muted-foreground">No holidays set</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedHolidays.map((holiday) => (
                <div 
                  key={holiday}
                  className="flex items-center justify-between border rounded-md p-2"
                >
                  <span className="text-sm">{format(new Date(holiday), 'PP')}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      Holiday
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveHoliday(holiday)}
                      className="h-7 w-7"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamHolidaySelector;


import { useState } from 'react';
import type { DayOfWeek, TimeSlot } from '@/types/team';

export const useTeamAvailability = (
  initialOfficeHours: { [key in DayOfWeek]: TimeSlot[] } = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  },
  initialHolidays: string[] = []
) => {
  const [officeHours, setOfficeHours] = useState<{ [key in DayOfWeek]: TimeSlot[] }>(initialOfficeHours);
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>(initialHolidays);

  return {
    officeHours,
    setOfficeHours,
    selectedHolidays,
    setSelectedHolidays
  };
};


import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TeamOfficeHoursSelector from '@/components/teams/TeamOfficeHoursSelector';
import TeamHolidaySelector from '@/components/teams/TeamHolidaySelector';
import type { DayOfWeek, TimeSlot } from '@/types/team';

interface TeamAvailabilitySectionProps {
  officeHours: { [key in DayOfWeek]: TimeSlot[] };
  onOfficeHoursChange: (hours: { [key in DayOfWeek]: TimeSlot[] }) => void;
  selectedHolidays: string[];
  onHolidaysChange: (holidays: string[]) => void;
}

const TeamAvailabilitySection = ({
  officeHours,
  onOfficeHoursChange,
  selectedHolidays,
  onHolidaysChange,
}: TeamAvailabilitySectionProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Team Availability</h2>
      <div className="space-y-8">
        <TeamOfficeHoursSelector
          officeHours={officeHours}
          onOfficeHoursChange={onOfficeHoursChange}
        />
        <Separator className="my-8" />
        <TeamHolidaySelector
          selectedHolidays={selectedHolidays}
          onHolidaysChange={onHolidaysChange}
        />
      </div>
    </Card>
  );
};

export default TeamAvailabilitySection;


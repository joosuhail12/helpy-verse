
import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface DateRangePickerProps {
  date: DateRange
  onDateChange: (date: DateRange) => void
  className?: string
  align?: "center" | "start" | "end"
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
  align = "start",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Predefined date ranges
  const handleSelectPreset = (preset: number | "custom") => {
    if (preset === "custom") {
      return
    }

    const today = new Date()
    const toDate = new Date()
    const fromDate = new Date()

    fromDate.setDate(today.getDate() - preset)

    onDateChange({
      from: fromDate,
      to: toDate,
    })
  }

  const hasDateRange = date.from && date.to

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              "justify-start text-left font-normal h-9",
              !date.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {hasDateRange ? (
              <span className="whitespace-nowrap">{format(date.from as Date, "MMM d")} - {format(date.to as Date, "MMM d, yyyy")}</span>
            ) : (
              <span>Date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <div className="flex flex-col gap-2 p-3 border-b border-border/50">
            <div className="flex justify-between">
              <h3 className="font-medium text-sm">Date Range</h3>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => onDateChange({ from: undefined, to: undefined })}
                disabled={!date.from && !date.to}
              >
                Clear
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select onValueChange={(value) => handleSelectPreset(value === "custom" ? "custom" : parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="14">Last 14 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-3">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date.from}
              selected={{
                from: date.from,
                to: date.to,
              }}
              onSelect={(selectedDateRange) => {
                onDateChange({
                  from: selectedDateRange?.from,
                  to: selectedDateRange?.to,
                })
              }}
              numberOfMonths={1}
            />
          </div>
          <div className="flex items-center justify-between p-3 border-t border-border/50">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={!date.from || !date.to}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

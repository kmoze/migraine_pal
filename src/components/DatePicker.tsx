import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

function DatePicker({ date, onDateChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
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
          onSelect={onDateChange}
          initialFocus
          disabled={(date) =>
            date > new Date() || date < new Date('1900-01-01')
          }
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;

'use client';

import { PopoverClose } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon, OctagonMinus } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  showReset?: boolean;
}

export const DatePicker = ({
  value,
  onChange,
  disabled = false,
  className,
  placeholder = 'Select date',
  showReset = false,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn('w-full justify-start px-3 text-left font-normal', !value && 'text-muted-foreground', className)}
        >
          <CalendarIcon className="mr-2 size-4" />
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={(date) => onChange(date as Date)} initialFocus />

        {showReset && value && (
          <PopoverClose asChild>
            <Button onClick={() => onChange(null)} variant="secondary" size="sm" className="w-full">
              <OctagonMinus className="size-4" />
              Reset Filter
            </Button>
          </PopoverClose>
        )}
      </PopoverContent>
    </Popover>
  );
};

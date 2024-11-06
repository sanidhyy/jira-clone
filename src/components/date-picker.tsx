'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const DatePicker = ({ value, onChange, disabled = false, className, placeholder = 'Select date' }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn('w-full justify-start text-left font-normal px-3', !value && 'text-muted-foreground', className)}
        >
          <CalendarIcon className="mr-2 size-4" />
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value} onSelect={(date) => onChange(date as Date)} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

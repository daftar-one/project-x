"use client";

import { format, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  value: string;        // "YYYY-MM-DD" or ""
  onChange: (val: string) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date' }: DatePickerProps) {
  const selected = value ? parseISO(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger
        className="flex items-center gap-2 w-full py-[7px] bg-transparent border-0 border-b border-[rgba(255,255,255,.12)] cursor-pointer text-left text-[13px] font-[inherit]"
        style={{ color: selected ? '#f0f2f5' : 'rgba(255,255,255,.3)' }}
      >
        <CalendarIcon size={15} className="text-gray-500 shrink-0" />
        {selected ? format(selected, 'd MMM, yyyy') : placeholder}
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-auto">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={date => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
        />
      </PopoverContent>
    </Popover>
  );
}

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
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          width: '100%', padding: '7px 0',
          background: 'transparent', border: 'none',
          borderBottom: '1px solid rgba(255,255,255,.12)',
          cursor: 'pointer', textAlign: 'left',
          fontSize: 13,
          color: selected ? '#f0f2f5' : 'rgba(255,255,255,.3)',
          fontFamily: 'inherit',
        }}
      >
        <CalendarIcon size={15} style={{ color: '#6b7280', flexShrink: 0 }} />
        {selected ? format(selected, 'd MMM, yyyy') : placeholder}
      </PopoverTrigger>
      <PopoverContent align="start" style={{ padding: 0, width: 'auto' }}>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={date => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
        />
      </PopoverContent>
    </Popover>
  );
}

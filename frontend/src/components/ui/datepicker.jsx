import React from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './datepicker.css'
import { Calendar } from 'lucide-react'
import { cn } from '../../lib/utils'

export const DatePicker = ({ 
  selected, 
  onChange, 
  minDate, 
  maxDate,
  placeholderText = "Select a date",
  disabled = false,
  className,
  ...props 
}) => {
  return (
    <div className="relative">
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholderText}
        disabled={disabled}
        dateFormat="MMMM d, yyyy"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        calendarClassName="custom-calendar"
        showPopperArrow={false}
        {...props}
      />
      <Calendar className="h-4 w-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
    </div>
  )
}

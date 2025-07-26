import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Event, EventMetadata } from "@/types";

interface WeekViewProps {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
  onEventClick?: (event: Event) => void;
}

export function WeekView({ events, eventMetadata, onEventClick }: WeekViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const weekDates = getWeekDates(currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      return event.startDate.toDateString() === date.toDateString();
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getEventPosition = (event: Event, dayEvents: Event[], eventIndex: number) => {
    const startHour = event.startDate.getHours();
    const startMinute = event.startDate.getMinutes();
    const endHour = event.endDate ? event.endDate.getHours() : startHour + 1;
    const endMinute = event.endDate ? event.endDate.getMinutes() : 0;
    
    const startPosition = startHour + startMinute / 60;
    const endPosition = endHour + endMinute / 60;
    const duration = endPosition - startPosition;
    
    // Find overlapping events (only events on the same day that overlap in time)
    const overlappingEvents = dayEvents.filter(otherEvent => {
      if (otherEvent.id === event.id) return true;
      
      // Only consider events that are actually on the same day
      if (otherEvent.startDate.toDateString() !== event.startDate.toDateString()) {
        return false;
      }
      
      const otherStartHour = otherEvent.startDate.getHours() + otherEvent.startDate.getMinutes() / 60;
      const otherEndHour = (otherEvent.endDate ? otherEvent.endDate.getHours() : otherEvent.startDate.getHours() + 1) + 
        (otherEvent.endDate ? otherEvent.endDate.getMinutes() / 60 : 0);
      
      // Check if events overlap in time
      return (startPosition < otherEndHour) && (endPosition > otherStartHour);
    });
    
    const overlapCount = overlappingEvents.length;
    const eventPosition = overlappingEvents.findIndex(e => e.id === event.id);
    const widthPercentage = overlapCount > 1 ? 100 / overlapCount : 100;
    const leftPercentage = overlapCount > 1 ? (eventPosition * widthPercentage) : 0;
    
    return {
      top: `${startPosition * 80}px`, // 80px per hour for better readability
      height: `${duration * 80}px`, // Accurate height based on actual duration
      left: `${leftPercentage}%`,
      width: `${widthPercentage}%`,
    };
  };

  const categoryColors = {
    academic: "bg-green-100 text-green-800 border-green-200",
    social: "bg-orange-100 text-orange-800 border-orange-200",
    cultural: "bg-purple-100 text-purple-800 border-purple-200",
    sports: "bg-red-100 text-red-800 border-red-200",
    professional: "bg-teal-100 text-teal-800 border-teal-200",
    wellness: "bg-blue-100 text-blue-800 border-blue-200",
    volunteer: "bg-yellow-100 text-yellow-800 border-yellow-200",
    arts: "bg-pink-100 text-pink-800 border-pink-200"
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateWeek('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        <button
          onClick={() => navigateWeek('next')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Week Grid */}
      <div className="border rounded-lg overflow-hidden bg-white">
        {/* Header */}
        <div className="grid grid-cols-8 border-b bg-gray-50">
          <div className="p-3 text-xs font-medium text-gray-500 border-r">Time</div>
          {weekDates.map((date, index) => (
            <div key={index} className="p-3 text-center border-r last:border-r-0">
              <div className="text-xs font-medium text-gray-500">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-8 relative">
          {/* Time labels column */}
          <div className="border-r">
            {hours.map((hour) => (
              <div key={hour} className="h-[80px] p-2 text-xs text-gray-500 border-b flex items-start">
                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
            ))}
          </div>
          
          {/* Day columns with events */}
          {weekDates.map((date, dayIndex) => {
            const dayEvents = getEventsForDay(date);
            
            return (
              <div key={dayIndex} className="relative border-r last:border-r-0">
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div key={hour} className="h-[80px] border-b"></div>
                ))}
                
                {/* Events positioned absolutely */}
                {dayEvents.map((event, eventIndex) => {
                  const metadata = eventMetadata[event.id];
                  const categoryColors = {
                    academic: "bg-green-100 text-green-800 border-green-200",
                    social: "bg-orange-100 text-orange-800 border-orange-200",
                    cultural: "bg-purple-100 text-purple-800 border-purple-200",
                    sports: "bg-red-100 text-red-800 border-red-200",
                    professional: "bg-teal-100 text-teal-800 border-teal-200",
                    wellness: "bg-blue-100 text-blue-800 border-blue-200",
                    volunteer: "bg-yellow-100 text-yellow-800 border-yellow-200",
                    arts: "bg-pink-100 text-pink-800 border-pink-200"
                  };
                  
                  const colorClass = metadata ? categoryColors[metadata.category as keyof typeof categoryColors] : "bg-gray-100 text-gray-800 border-gray-200";
                  const position = getEventPosition(event, dayEvents, eventIndex);
                  
                  return (
                    <div
                      key={event.id}
                      className={`absolute ${colorClass} border rounded p-2 text-sm z-20 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow event-card`}
                      style={{
                        ...position,
                        margin: '1px',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      <div className="font-medium leading-tight truncate text-sm">{event.title}</div>
                      <div className="text-xs opacity-75 leading-tight">
                        {event.startDate.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                        })}
                      </div>
                      {metadata && (
                        <div className="text-xs leading-tight">
                          <div className="truncate">{metadata.location}</div>
                          {metadata.organization && (
                            <div className="truncate opacity-75">{metadata.organization}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
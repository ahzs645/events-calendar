import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Event, EventMetadata } from "@/types";

interface MobileMonthViewProps {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
  onEventClick?: (event: Event) => void;
}

export function MobileMonthView({ events, eventMetadata, onEventClick }: MobileMonthViewProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  
  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === selectedDate.getDate() && 
             eventDate.getMonth() === selectedDate.getMonth() && 
             eventDate.getFullYear() === selectedDate.getFullYear();
    });
  };

  const selectedDateEvents = getEventsForSelectedDate();

  // Simple calendar implementation
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
  
  const days = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return (
    <Card className="w-full py-4 mobile-calendar">
      <CardContent className="px-4">
        {/* Simple calendar header with navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline"
            size="sm"
            onClick={handlePrevMonth}
          >
            <ArrowLeft className="h-4 w-4" />
            Prev
          </Button>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium py-2 text-gray-600 dark:text-gray-400">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === month;
            const isSelected = selectedDate && 
              day.getDate() === selectedDate.getDate() && 
              day.getMonth() === selectedDate.getMonth() && 
              day.getFullYear() === selectedDate.getFullYear();
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`
                  p-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                  ${isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}
                  ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                  ${isToday && !isSelected ? 'bg-gray-200 dark:bg-gray-700 font-semibold' : ''}
                `}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
        <div className="flex w-full items-center justify-between px-1">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {selectedDate?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          {selectedDateEvents.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No events on this day
            </div>
          ) : (
            selectedDateEvents.map((event) => {
              const metadata = eventMetadata[event.id];
              const categoryColors = {
                academic: "after:bg-green-500",
                social: "after:bg-orange-500",
                cultural: "after:bg-purple-500",
                sports: "after:bg-red-500",
                professional: "after:bg-teal-500",
                wellness: "after:bg-blue-500",
                volunteer: "after:bg-yellow-500",
                arts: "after:bg-pink-500"
              };
              const categoryColor = metadata ? categoryColors[metadata.category as keyof typeof categoryColors] : "after:bg-gray-500";

              return (
                <button
                  key={event.id}
                  className={`bg-muted dark:bg-gray-700 relative rounded-md p-2 pl-6 text-sm text-left w-full after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${categoryColor}`}
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">{event.title}</div>
                  <div className="text-muted-foreground dark:text-gray-400 text-xs">
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                    {metadata && ` • ${metadata.location}`}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
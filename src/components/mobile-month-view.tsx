import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Event, EventMetadata } from "@/types";

interface MobileMonthViewProps {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
}

export function MobileMonthView({ events, eventMetadata }: MobileMonthViewProps) {
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
          
          <h3 className="text-lg font-semibold">
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
            <div key={day} className="text-center text-sm font-medium py-2 text-gray-600">
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
                  p-2 text-sm rounded hover:bg-gray-100 transition-colors
                  ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                  ${isToday && !isSelected ? 'bg-gray-200 font-semibold' : ''}
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
          <div className="text-sm font-medium">
            {selectedDate?.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          {selectedDateEvents.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-4">
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
                <div
                  key={event.id}
                  className={`bg-muted relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full ${categoryColor}`}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                    {metadata && ` • ${metadata.location}`}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Event, EventMetadata } from "@/types";

interface MonthViewProps {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

export function MonthView({ events, eventMetadata, onDateClick, onEventClick }: MonthViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState<number>(0);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const getDaysInMonth = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1 }));
  };

  const getEventsForDay = (day: number, currentDate: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() && 
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const handlePrevMonth = () => {
    setDirection(-1);
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    setDirection(1);
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
  };

  const daysInMonth = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startOffset = firstDayOfMonth.getDay();

  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const lastDateOfPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();
  
  // Event Component
  const MonthEventComponent = ({ events }: { events: Event[] }) => {
    const categoryColors = {
      academic: "bg-green-500",
      social: "bg-orange-500",
      cultural: "bg-purple-500",
      sports: "bg-red-500",
      professional: "bg-teal-500",
      wellness: "bg-blue-500",
      volunteer: "bg-yellow-500",
      arts: "bg-pink-500"
    };

    const eventsByCategory = events.reduce((acc, event) => {
      const metadata = eventMetadata[event.id];
      const category = metadata?.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(event);
      return acc;
    }, {} as Record<string, Event[]>);

    return (
      <div className="flex flex-wrap gap-1">
        {Object.entries(eventsByCategory).map(([category, categoryEvents]) => {
          const colorClass = categoryColors[category as keyof typeof categoryColors] || "bg-gray-500";
          return (
            <div
              key={category}
              className={`${colorClass} text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium shadow-sm`}
              title={`${categoryEvents.length} ${category} event${categoryEvents.length > 1 ? 's' : ''}: ${categoryEvents.map(e => e.title).join(', ')}`}
            >
              {categoryEvents.length}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <motion.h2
          key={currentDate.getMonth()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl my-5 tracking-tighter font-bold text-gray-900 dark:text-gray-100"
        >
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </motion.h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrevMonth} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button variant="outline" onClick={handleNextMonth} className="gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={`${currentDate.getFullYear()}-${currentDate.getMonth()}`}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1 sm:gap-2"
        >
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className="text-left my-8 text-4xl tracking-tighter font-medium text-gray-900 dark:text-gray-100"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: startOffset }).map((_, idx) => (
            <div key={`offset-${idx}`} className="h-[150px] opacity-50">
              <div className="font-semibold relative text-3xl mb-1 text-gray-400 dark:text-gray-500">
                {lastDateOfPrevMonth - startOffset + idx + 1}
              </div>
            </div>
          ))}

          {daysInMonth.map((dayObj, index) => {
            const dayEvents = getEventsForDay(dayObj.day, currentDate);
            const isToday = new Date().getDate() === dayObj.day &&
              new Date().getMonth() === currentDate.getMonth() &&
              new Date().getFullYear() === currentDate.getFullYear();
            
            const dayOfWeek = (startOffset + dayObj.day - 1) % 7;
            const isRightEdge = dayOfWeek >= 5;

            return (
              <motion.div
                className="hover:z-50 border-none h-[150px] rounded group flex flex-col relative"
                key={dayObj.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setHoveredDay(dayObj.day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <Card 
                  className={`shadow-md overflow-hidden relative flex p-4 border h-full transition-shadow day-card ${
                    dayEvents.length > 0 
                      ? "cursor-pointer hover:shadow-lg" 
                      : "cursor-default"
                  }`}
                  onClick={dayEvents.length > 0 ? () => onDateClick?.(new Date(currentDate.getFullYear(), currentDate.getMonth(), dayObj.day)) : undefined}
                >
                  <div className={`font-semibold relative text-3xl mb-1 ${
                    dayEvents.length > 0 ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                  } ${isToday ? "text-secondary-500" : ""}`}>
                    {dayObj.day}
                  </div>
                  <div className="flex-grow flex flex-col gap-2 w-full">
                    <AnimatePresence mode="wait">
                      {dayEvents?.length > 0 && (
                        <motion.div
                          key={dayEvents[0].id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MonthEventComponent events={dayEvents} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
                
                {/* Hover Tooltip */}
                {hoveredDay === dayObj.day && dayEvents.length > 0 && (
                  <div 
                    className={`absolute top-full z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 w-80 ${
                      isRightEdge ? 'right-0' : 'left-0'
                    }`}
                    onMouseEnter={() => setHoveredDay(dayObj.day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                    </div>
                    <div className="space-y-2">
                      {dayEvents.map((event) => {
                        const metadata = eventMetadata[event.id];
                        const categoryColors = {
                          academic: "bg-green-500",
                          social: "bg-orange-500",
                          cultural: "bg-purple-500",
                          sports: "bg-red-500",
                          professional: "bg-teal-500",
                          wellness: "bg-blue-500",
                          volunteer: "bg-yellow-500",
                          arts: "bg-pink-500"
                        };
                        const colorClass = metadata ? categoryColors[metadata.category as keyof typeof categoryColors] : "bg-gray-500";
                        
                        return (
                          <div 
                            key={event.id} 
                            className="flex items-start gap-2 p-1 -m-1 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick?.(event);
                            }}
                          >
                            <div className={`w-2 h-2 rounded-full ${colorClass} flex-shrink-0 mt-1.5`}></div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-800 dark:text-gray-200 leading-tight">
                                {event.title}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                {formatTime(event.startDate)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
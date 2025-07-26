"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, Building2, Clock, Users, DollarSign, List, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Building } from "lucide-react";
import type { Event, EventMetadata, EventCategory } from "@/types";

// Convert UNBC events to Event format
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const unbcEvents: Event[] = [
  {
    id: "1",
    title: "Indigenous Culture Workshop",
    description: "Learn about local Indigenous traditions and participate in hands-on cultural activities led by community elders.",
    startDate: new Date(currentYear, currentMonth, 15, 14, 0),
    endDate: new Date(currentYear, currentMonth, 15, 16, 0),
    variant: "warning"
  },
  {
    id: "2",
    title: "Career Fair 2025",
    description: "Meet with local employers and explore career opportunities in Northern BC and beyond.",
    startDate: new Date(currentYear, currentMonth, 18, 10, 0),
    endDate: new Date(currentYear, currentMonth, 18, 15, 0),
    variant: "success"
  },
  {
    id: "3",
    title: "Hiking Trip to Tabletop Mountain",
    description: "Join us for a challenging but rewarding day hike to one of the region's most spectacular viewpoints.",
    startDate: new Date(currentYear, currentMonth, 22, 8, 0),
    endDate: new Date(currentYear, currentMonth, 22, 18, 0),
    variant: "danger"
  },
  {
    id: "4",
    title: "Mental Health Awareness Week",
    description: "A week-long series of workshops, activities, and resources focused on mental health and wellbeing.",
    startDate: new Date(currentYear, currentMonth, 26, 9, 0),
    endDate: new Date(currentYear, currentMonth, 26, 17, 0),
    variant: "warning"
  },
  {
    id: "5",
    title: "Spring Formal Dance",
    description: "Celebrate the end of the semester with music, dancing, and refreshments in our beautiful Winter Garden.",
    startDate: new Date(currentYear, currentMonth, Math.min(29, new Date(currentYear, currentMonth + 1, 0).getDate()), 19, 0),
    endDate: new Date(currentYear, currentMonth, Math.min(29, new Date(currentYear, currentMonth + 1, 0).getDate()), 23, 0),
    variant: "warning"
  },
  {
    id: "6",
    title: "Research Presentation Day",
    description: "Graduate students present their research findings across various disciplines.",
    startDate: new Date(currentYear, currentMonth, 12, 13, 0),
    endDate: new Date(currentYear, currentMonth, 12, 17, 0),
    variant: "success"
  },
  {
    id: "7",
    title: "Photography Workshop",
    description: "Learn basic photography techniques and composition.",
    startDate: new Date(currentYear, currentMonth, 5, 15, 30),
    endDate: new Date(currentYear, currentMonth, 5, 17, 30),
    variant: "warning"
  },
  {
    id: "8",
    title: "Volunteer Fair",
    description: "Connect with local organizations looking for volunteers.",
    startDate: new Date(currentYear, currentMonth, 8, 11, 0),
    endDate: new Date(currentYear, currentMonth, 8, 14, 0),
    variant: "default"
  },
  {
    id: "9",
    title: "Business Networking Event",
    description: "Network with local business professionals and alumni.",
    startDate: new Date(currentYear, currentMonth, 20, 18, 0),
    endDate: new Date(currentYear, currentMonth, 20, 20, 0),
    variant: "success"
  },
  {
    id: "10",
    title: "Stress Relief Workshop",
    description: "Learn effective stress management techniques for exam season.",
    startDate: new Date(currentYear, currentMonth, 14, 16, 0),
    endDate: new Date(currentYear, currentMonth, 14, 17, 30),
    variant: "warning"
  },
  {
    id: "11",
    title: "International Food Festival",
    description: "Taste foods from around the world and celebrate cultural diversity.",
    startDate: new Date(currentYear, currentMonth, 25, 12, 0),
    endDate: new Date(currentYear, currentMonth, 25, 16, 0),
    variant: "warning"
  },
  {
    id: "12",
    title: "Campus Soccer Tournament",
    description: "Join teams and compete in our annual soccer tournament.",
    startDate: new Date(currentYear, currentMonth, Math.min(30, new Date(currentYear, currentMonth + 1, 0).getDate()), 9, 0),
    endDate: new Date(currentYear, currentMonth, Math.min(30, new Date(currentYear, currentMonth + 1, 0).getDate()), 17, 0),
    variant: "danger"
  },
  {
    id: "13",
    title: "Morning Yoga Session",
    description: "Start your day with a relaxing yoga session.",
    startDate: new Date(currentYear, currentMonth, Math.max(1, today.getDate() - 2), 7, 0),
    endDate: new Date(currentYear, currentMonth, Math.max(1, today.getDate() - 2), 8, 0),
    variant: "warning"
  },
  {
    id: "14",
    title: "Study Group - Biology 101",
    description: "Group study session for upcoming Biology 101 midterm exam.",
    startDate: new Date(currentYear, currentMonth, Math.max(1, today.getDate() - 1), 10, 0),
    endDate: new Date(currentYear, currentMonth, Math.max(1, today.getDate() - 1), 12, 0),
    variant: "success"
  },
  {
    id: "15",
    title: "Lunch & Learn: Sustainability",
    description: "Learn about campus sustainability initiatives while enjoying lunch.",
    startDate: new Date(currentYear, currentMonth, today.getDate(), 12, 0),
    endDate: new Date(currentYear, currentMonth, today.getDate(), 13, 0),
    variant: "success"
  },
];

// Event metadata for enhanced display
const eventMetadata: Record<string, EventMetadata> = {
  "1": {
    category: "cultural",
    organization: "International Students Club",
    location: "Agora",
    cost: "Free",
    registrationRequired: true,
    posterUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=600&fit=crop&auto=format"
  },
  "2": {
    category: "professional",
    organization: "UNBC Student Union",
    location: "Campus Gymnasium",
    cost: "Free",
    registrationRequired: false,
    posterUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=600&fit=crop&auto=format"
  },
  "3": {
    category: "sports",
    organization: "UNBC Outdoor Club",
    location: "Meet at Student Union Building",
    cost: "$15",
    registrationRequired: true
  },
  "4": {
    category: "wellness",
    organization: "Student Health & Wellness",
    location: "Various Locations",
    cost: "Free",
    registrationRequired: false
  },
  "5": {
    category: "social",
    organization: "UNBC Student Union",
    location: "Winter Garden",
    cost: "$25",
    registrationRequired: true,
    posterUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=600&fit=crop&auto=format"
  },
  "6": {
    category: "academic",
    organization: "Graduate Studies",
    location: "Teaching Laboratory Building",
    cost: "Free",
    registrationRequired: false
  },
  "7": {
    category: "arts",
    organization: "Photography Club",
    location: "Art Building Studio 3",
    cost: "$10",
    registrationRequired: true
  },
  "8": {
    category: "volunteer",
    organization: "Community Engagement Office",
    location: "Student Union Building",
    cost: "Free",
    registrationRequired: false
  },
  "9": {
    category: "professional",
    organization: "Business Students Association",
    location: "Winter Garden",
    cost: "$5",
    registrationRequired: true
  },
  "10": {
    category: "wellness",
    organization: "Student Health & Wellness",
    location: "Campus Recreation Center",
    cost: "Free",
    registrationRequired: false
  },
  "11": {
    category: "cultural",
    organization: "International Students Club",
    location: "Agora",
    cost: "Free",
    registrationRequired: false
  },
  "12": {
    category: "sports",
    organization: "Athletics Department",
    location: "Campus Soccer Field",
    cost: "$20 per team",
    registrationRequired: true
  },
  "13": {
    category: "wellness",
    organization: "Student Health & Wellness",
    location: "Campus Recreation Center",
    cost: "Free",
    registrationRequired: false
  },
  "14": {
    category: "academic",
    organization: "Biology Students Association",
    location: "Library Study Room 201",
    cost: "Free",
    registrationRequired: false
  },
  "15": {
    category: "academic",
    organization: "Sustainability Office",
    location: "Agora",
    cost: "Free",
    registrationRequired: false
  }
};

// Mobile Month View Component - compact calendar + event list
const MobileMonthView = ({ events }: { events: Event[] }) => {
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
  const lastDayOfMonth = new Date(year, month + 1, 0);
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
};

// Custom Month View Component - mimics original Mina scheduler layout
const CustomMonthView = ({ events }: { events: Event[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState<number>(0);

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

  // Calculate previous month's last days for placeholders
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const lastDateOfPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();
  
  // Custom Month Event Component - shows all events as colored dots with numbers
  const CustomMonthEventComponent = ({ events }: { events: Event[] }) => {
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

    // Group events by category
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
          className="text-3xl my-5 tracking-tighter font-bold"
        >
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </motion.h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrevMonth}>
            <ArrowLeft />
            Prev
          </Button>
          <Button variant="outline" onClick={handleNextMonth}>
            Next
            <ArrowRight />
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
              className="text-left my-8 text-4xl tracking-tighter font-medium"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: startOffset }).map((_, idx) => (
            <div key={`offset-${idx}`} className="h-[150px] opacity-50">
              <div className="font-semibold relative text-3xl mb-1">
                {lastDateOfPrevMonth - startOffset + idx + 1}
              </div>
            </div>
          ))}

          {daysInMonth.map((dayObj) => {
            const dayEvents = getEventsForDay(dayObj.day, currentDate);
            const isToday = new Date().getDate() === dayObj.day &&
              new Date().getMonth() === currentDate.getMonth() &&
              new Date().getFullYear() === currentDate.getFullYear();

            return (
              <motion.div
                className="hover:z-50 border-none h-[150px] rounded group flex flex-col"
                key={dayObj.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-md overflow-hidden relative flex p-4 border h-full">
                  <div className={`font-semibold relative text-3xl mb-1 ${
                    dayEvents.length > 0 ? "text-primary-600" : "text-muted-foreground"
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
                          <CustomMonthEventComponent events={dayEvents} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Event Stats Component
const EventStats = ({ events }: { events: Event[] }) => {
  const stats = {
    total: events.length,
    thisWeek: events.filter(e => {
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      return e.startDate >= weekStart && e.startDate <= weekEnd;
    }).length,
    free: events.filter(e => {
      const metadata = eventMetadata[e.id];
      return metadata?.cost === "Free";
    }).length,
    requireRegistration: events.filter(e => {
      const metadata = eventMetadata[e.id];
      return metadata?.registrationRequired;
    }).length
  };

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      <div className="bg-white rounded-lg border p-3 text-center">
        <div className="text-xl font-bold text-blue-600">{stats.total}</div>
        <div className="text-xs text-gray-600">Total Events</div>
      </div>
      <div className="bg-white rounded-lg border p-3 text-center">
        <div className="text-xl font-bold text-green-600">{stats.thisWeek}</div>
        <div className="text-xs text-gray-600">This Week</div>
      </div>
      <div className="bg-white rounded-lg border p-3 text-center">
        <div className="text-xl font-bold text-purple-600">{stats.free}</div>
        <div className="text-xs text-gray-600">Free Events</div>
      </div>
      <div className="bg-white rounded-lg border p-3 text-center">
        <div className="text-xl font-bold text-orange-600">{stats.requireRegistration}</div>
        <div className="text-xs text-gray-600">Need Registration</div>
      </div>
    </div>
  );
};

// Mobile List View Component - matches mobile month style
const MobileListView = ({ events }: { events: Event[] }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const sortedEvents = [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Group events by date
  const eventsByDate = sortedEvents.reduce((acc, event) => {
    const dateKey = event.startDate.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="space-y-6">
      {sortedEvents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CalendarDays className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p>Try adjusting your filters to see more events.</p>
        </div>
      ) : (
        Object.entries(eventsByDate).map(([dateKey, dateEvents]) => {
          const date = new Date(dateKey);
          const isToday = date.toDateString() === new Date().toDateString();
          const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();
          
          let dateLabel = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          });
          
          if (isToday) dateLabel = `Today, ${dateLabel}`;
          else if (isTomorrow) dateLabel = `Tomorrow, ${dateLabel}`;

          return (
            <div key={dateKey} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center gap-3">
                <h3 className="text-base font-semibold text-gray-900">{dateLabel}</h3>
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {dateEvents.length}
                </span>
              </div>

              {/* Events for this date */}
              <div className="space-y-2">
                {dateEvents.map((event) => {
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
                      className={`bg-muted relative rounded-md p-3 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full ${categoryColor}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-grow min-w-0">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-muted-foreground text-xs mt-1">
                            {formatTime(event.startDate)} - {formatTime(event.endDate)}
                          </div>
                          {metadata && (
                            <div className="text-muted-foreground text-xs mt-1">
                              {metadata.location}
                            </div>
                          )}
                          {metadata && (
                            <div className="text-muted-foreground text-xs mt-1">
                              {metadata.organization}
                            </div>
                          )}
                        </div>
                        {metadata && (
                          <div className="text-sm font-semibold text-green-600 flex-shrink-0 ml-2">
                            {metadata.cost}
                          </div>
                        )}
                      </div>
                      {metadata?.registrationRequired && (
                        <div className="mt-2">
                          <Badge variant="outline" size="sm">Registration Required</Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

// Compact Event List View Component with Poster Support
const EventListView = ({ events }: { events: Event[] }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const sortedEvents = [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Group events by date
  const eventsByDate = sortedEvents.reduce((acc, event) => {
    const dateKey = event.startDate.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="space-y-6">
      {sortedEvents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CalendarDays className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p>Try adjusting your filters to see more events.</p>
        </div>
      ) : (
        Object.entries(eventsByDate).map(([dateKey, dateEvents]) => {
          const date = new Date(dateKey);
          const isToday = date.toDateString() === new Date().toDateString();
          const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();
          
          let dateLabel = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          });
          
          if (isToday) dateLabel = `Today, ${dateLabel}`;
          else if (isTomorrow) dateLabel = `Tomorrow, ${dateLabel}`;

          return (
            <div key={dateKey} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{dateLabel}</h3>
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {dateEvents.length} event{dateEvents.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Events for this date */}
              <div className="space-y-2">
                {dateEvents.map((event) => {
                  const metadata = eventMetadata[event.id];

                  return (
                    <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer bg-white">
                      <CardContent className="p-2">
                        <div className="flex gap-6 items-center">
                          {/* Time Column */}
                          <div className="flex-shrink-0 text-center w-16">
                            <div className="text-lg font-bold text-gray-900 leading-tight">
                              {formatTime(event.startDate)}
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatTime(event.endDate)}
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 truncate pr-4">
                                {event.title}
                              </h3>
                              {metadata && (
                                <div className="text-sm font-semibold text-green-600 flex-shrink-0">
                                  {metadata.cost}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-6 text-xs text-gray-600 mt-0.5">
                              {metadata && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{metadata.location}</span>
                                </div>
                              )}
                              {metadata && (
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  <span className="truncate">{metadata.organization}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              {metadata && (
                                <Badge size="sm" className={
                                  metadata.category === 'academic' ? 'bg-green-100 text-green-800' :
                                  metadata.category === 'social' ? 'bg-orange-100 text-orange-800' :
                                  metadata.category === 'cultural' ? 'bg-purple-100 text-purple-800' :
                                  metadata.category === 'sports' ? 'bg-red-100 text-red-800' :
                                  metadata.category === 'professional' ? 'bg-teal-100 text-teal-800' :
                                  metadata.category === 'wellness' ? 'bg-blue-100 text-blue-800' :
                                  metadata.category === 'volunteer' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-pink-100 text-pink-800'
                                }>
                                  {metadata.category.charAt(0).toUpperCase() + metadata.category.slice(1)}
                                </Badge>
                              )}
                              {metadata?.cost === 'Free' && (
                                <Badge variant="secondary" size="sm">Free</Badge>
                              )}
                              {metadata?.registrationRequired && (
                                <Badge variant="outline" size="sm">Registration Required</Badge>
                              )}
                            </div>
                          </div>

                          {/* Poster Image - Right Side */}
                          {metadata?.posterUrl && (
                            <div className="flex-shrink-0">
                              <img 
                                src={metadata.posterUrl} 
                                alt={`${event.title} poster`}
                                className="w-20 h-16 object-cover rounded-lg shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

// Week View Component
const WeekView = ({ events }: { events: Event[] }) => {
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
    
    // Find overlapping events
    const overlappingEvents = dayEvents.filter(otherEvent => {
      if (otherEvent.id === event.id) return true;
      
      const otherStartHour = otherEvent.startDate.getHours() + otherEvent.startDate.getMinutes() / 60;
      const otherEndHour = (otherEvent.endDate ? otherEvent.endDate.getHours() : otherEvent.startDate.getHours() + 1) + 
        (otherEvent.endDate ? otherEvent.endDate.getMinutes() / 60 : 0);
      
      // Check if events overlap
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
                      className={`absolute ${colorClass} border rounded p-2 text-sm z-10 overflow-hidden flex flex-col`}
                      style={{
                        ...position,
                        margin: '1px',
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
};

// Day View Component  
const DayView = ({ events }: { events: Event[] }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const getEventsForDay = () => {
    return events.filter(event => {
      return event.startDate.toDateString() === currentDate.toDateString();
    });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
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
    
    // Find overlapping events
    const overlappingEvents = dayEvents.filter(otherEvent => {
      if (otherEvent.id === event.id) return true;
      
      const otherStartHour = otherEvent.startDate.getHours() + otherEvent.startDate.getMinutes() / 60;
      const otherEndHour = (otherEvent.endDate ? otherEvent.endDate.getHours() : otherEvent.startDate.getHours() + 1) + 
        (otherEvent.endDate ? otherEvent.endDate.getMinutes() / 60 : 0);
      
      // Check if events overlap
      return (startPosition < otherEndHour) && (endPosition > otherStartHour);
    });
    
    const overlapCount = overlappingEvents.length;
    const eventPosition = overlappingEvents.findIndex(e => e.id === event.id);
    const widthPercentage = overlapCount > 1 ? 100 / overlapCount : 100;
    const leftPercentage = overlapCount > 1 ? (eventPosition * widthPercentage) : 0;
    
    return {
      top: `${startPosition * 80}px`, // 80px per hour for day view
      height: `${duration * 80}px`, // Accurate height based on actual duration
      left: `${leftPercentage}%`,
      width: `${widthPercentage}%`,
    };
  };

  const dayEvents = getEventsForDay();

  return (
    <div className="space-y-4">
      {/* Day Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateDay('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </h2>
        <button
          onClick={() => navigateDay('next')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day Schedule */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="flex">
          {/* Time column */}
          <div className="w-20 border-r bg-gray-50">
            {hours.map((hour) => (
              <div key={hour} className="h-[80px] p-3 text-sm text-gray-500 border-b flex items-start">
                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
            ))}
          </div>
          
          {/* Events column */}
          <div className="flex-1 relative">
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
                  className={`absolute ${colorClass} border rounded-lg p-2 text-sm z-10 overflow-hidden flex flex-col`}
                  style={{
                    ...position,
                    margin: '2px',
                  }}
                >
                  <div className="font-semibold leading-tight truncate">{event.title}</div>
                  <div className="text-xs opacity-75 leading-tight">
                    {event.startDate.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    })}
                    {event.endDate && ` - ${event.endDate.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    })}`}
                  </div>
                  {metadata && (
                    <div className="text-xs leading-tight">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" />
                        <span className="truncate">{metadata.location}</span>
                      </div>
                      {metadata.organization && (
                        <div className="flex items-center gap-1">
                          <Building className="h-2.5 w-2.5" />
                          <span className="truncate opacity-75">{metadata.organization}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main UNBC Calendar Component
export default function UNBCCalendar() {
  // Minimal CSS for view-only calendar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide any add event hover text */
      .unbc-calendar-view .absolute.bg-accent.flex.items-center.justify-center {
        display: none !important;
      }
      
      /* Disable click events on calendar cells but not on buttons */
      .unbc-calendar-view [role="tabpanel"] .cursor-pointer:not(button):not(.mobile-calendar button) {
        cursor: default !important;
        pointer-events: none !important;
      }
      
      /* Explicitly ensure navigation buttons work */
      .unbc-calendar-view button,
      .mobile-calendar button {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      
      /* Ensure card clicks are disabled */
      .unbc-calendar-view .shadow-md.cursor-pointer {
        cursor: default !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(unbcEvents);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [organizationFilter, setOrganizationFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Filter events based on current filters
  const applyFilters = () => {
    let filtered = unbcEvents;

    if (categoryFilter !== "all") {
      filtered = filtered.filter(event => {
        const metadata = eventMetadata[event.id];
        return metadata?.category === categoryFilter;
      });
    }

    if (organizationFilter !== "all") {
      filtered = filtered.filter(event => {
        const metadata = eventMetadata[event.id];
        return metadata?.organization.toLowerCase().includes(organizationFilter);
      });
    }

    if (searchFilter) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        eventMetadata[event.id]?.organization.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  // Apply filters when any filter changes
  React.useEffect(() => {
    applyFilters();
  }, [categoryFilter, organizationFilter, searchFilter]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
          🗓️ UNBC Campus Events
        </h1>
        <p className="text-gray-600 text-lg">
          Discover what's happening at UNBC - from academic workshops to social gatherings, all in one place
        </p>
      </div>

      {/* Event Statistics */}
      <EventStats events={filteredEvents} />

      {/* Calendar Views */}
      <div className="bg-white rounded-lg border shadow-sm unbc-calendar-view">
        <Tabs defaultValue="month" className="w-full">
          {/* Desktop: Tabs and Filters inline */}
          <div className="hidden md:flex p-6 pb-0 justify-between items-start gap-6">
            <TabsList className="h-9">
              <TabsTrigger value="day" className="text-xs px-3 py-1 flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                Day
              </TabsTrigger>
              <TabsTrigger value="week" className="text-xs px-3 py-1 flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-3 py-1 flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                Month
              </TabsTrigger>
              <TabsTrigger value="list" className="text-xs px-3 py-1 flex items-center gap-1">
                <List className="h-3 w-3" />
                List
              </TabsTrigger>
            </TabsList>
            
            {/* Desktop Filters - Inline */}
            <div className="flex items-center gap-3">
              <Select onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="arts">Arts & Creative</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="sports">Sports & Recreation</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="wellness">Health & Wellness</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setOrganizationFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="All Organizations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  <SelectItem value="student-union">UNBC Student Union</SelectItem>
                  <SelectItem value="outdoor-club">UNBC Outdoor Club</SelectItem>
                  <SelectItem value="business-club">Business Students Association</SelectItem>
                  <SelectItem value="international">International Students Club</SelectItem>
                  <SelectItem value="sustainability">Sustainability Office</SelectItem>
                  <SelectItem value="health-wellness">Student Health & Wellness</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Search events..."
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-40"
              />
            </div>
          </div>

          {/* Mobile: Tabs and Filters stacked */}
          <div className="md:hidden">
            <div className="p-6 pb-0 flex justify-center">
              <TabsList className="h-9">
                <TabsTrigger value="day" className="text-xs px-3 py-1 flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  Day
                </TabsTrigger>
                <TabsTrigger value="month" className="text-xs px-3 py-1 flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  Month
                </TabsTrigger>
                <TabsTrigger value="list" className="text-xs px-3 py-1 flex items-center gap-1">
                  <List className="h-3 w-3" />
                  List
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Mobile Filters - Stacked */}
            <div className="p-6 pt-4 space-y-3">
              <Select onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="arts">Arts & Creative</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="sports">Sports & Recreation</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="wellness">Health & Wellness</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setOrganizationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Organizations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  <SelectItem value="student-union">UNBC Student Union</SelectItem>
                  <SelectItem value="outdoor-club">UNBC Outdoor Club</SelectItem>
                  <SelectItem value="business-club">Business Students Association</SelectItem>
                  <SelectItem value="international">International Students Club</SelectItem>
                  <SelectItem value="sustainability">Sustainability Office</SelectItem>
                  <SelectItem value="health-wellness">Student Health & Wellness</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Search events..."
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="month" className="p-6 pt-4">
            <div className="hidden md:block">
              <CustomMonthView events={filteredEvents} />
            </div>
            <div className="block md:hidden mobile-calendar">
              <MobileMonthView events={filteredEvents} />
            </div>
          </TabsContent>

          <TabsContent value="week" className="p-6 pt-4">
            <WeekView events={filteredEvents} />
          </TabsContent>

          <TabsContent value="day" className="p-6 pt-4">
            <DayView events={filteredEvents} />
          </TabsContent>

          <TabsContent value="list" className="p-6 pt-4">
            <div className="hidden md:block">
              <EventListView events={filteredEvents} />
            </div>
            <div className="block md:hidden">
              <MobileListView events={filteredEvents} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries({
              academic: "Academic",
              social: "Social",
              cultural: "Cultural",
              sports: "Sports & Recreation",
              professional: "Professional",
              wellness: "Health & Wellness",
              volunteer: "Volunteer",
              arts: "Arts & Creative"
            }).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${
                  key === 'academic' ? 'bg-green-500' :
                  key === 'social' ? 'bg-orange-500' :
                  key === 'cultural' ? 'bg-purple-500' :
                  key === 'sports' ? 'bg-red-500' :
                  key === 'professional' ? 'bg-teal-500' :
                  key === 'wellness' ? 'bg-blue-500' :
                  key === 'volunteer' ? 'bg-yellow-500' :
                  'bg-pink-500'
                }`}></div>
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
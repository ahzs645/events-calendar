"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List, Moon, Sun } from "lucide-react";
import type { Event } from "@/types";
import { unbcEvents, eventMetadata } from "@/data/events";
import { EventDialog } from "@/components/event-dialog";
import { MonthView, WeekView, DayView } from "@/components/calendar-views";
import { MobileMonthView } from "./mobile-month-view";
import { EventListView, MobileListView } from "./list-views";
import { EventStats } from "./event-stats";

export default function UNBCCalendar() {
  const [activeTab, setActiveTab] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  
  // Minimal CSS for view-only calendar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide any add event hover text */
      .unbc-calendar-view .absolute.bg-accent.flex.items-center.justify-center {
        display: none !important;
      }
      
      /* Disable click events on some elements but not on interactive ones */
      .unbc-calendar-view .cursor-pointer.disable-clicks {
        cursor: default !important;
        pointer-events: none !important;
      }
      
      /* Explicitly ensure navigation buttons work */
      .unbc-calendar-view button,
      .mobile-calendar button {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      
      /* Ensure day cards are clickable */
      .unbc-calendar-view .day-card {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      
      /* Ensure event cards in day/week view are clickable */
      .unbc-calendar-view .event-card {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      
      /* Ensure the grid doesn't block events */
      .unbc-calendar-view [role="tabpanel"] > div > div {
        pointer-events: none;
      }
      
      .unbc-calendar-view [role="tabpanel"] > div > div > * {
        pointer-events: auto;
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
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setActiveTab("day");
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode to document body
  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#1f2937'; // gray-800
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '';
    }
  }, [darkMode]);

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
    <div className={`w-full space-y-6 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="text-center relative">
        <div className="absolute top-0 right-0">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Event Statistics */}
      <EventStats events={filteredEvents} eventMetadata={eventMetadata} />

      {/* Calendar Views */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm unbc-calendar-view">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop: Tabs and Filters inline */}
          <div className="hidden md:flex p-6 pb-0 justify-between items-start gap-6">
            <TabsList className="h-9 bg-gray-100 dark:bg-gray-700 p-1">
              <TabsTrigger value="day" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm dark:text-gray-300">
                <CalendarDays className="h-3 w-3" />
                Day
              </TabsTrigger>
              <TabsTrigger value="week" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm dark:text-gray-300">
                <CalendarDays className="h-3 w-3" />
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm dark:text-gray-300">
                <CalendarDays className="h-3 w-3" />
                Month
              </TabsTrigger>
              <TabsTrigger value="list" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm dark:text-gray-300">
                <List className="h-3 w-3" />
                List
              </TabsTrigger>
            </TabsList>
            
            {/* Desktop Filters - Inline */}
            <div className="flex items-center gap-3">
              <Select onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="all" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">All Categories</SelectItem>
                  <SelectItem value="academic" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Academic</SelectItem>
                  <SelectItem value="arts" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Arts & Creative</SelectItem>
                  <SelectItem value="cultural" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Cultural</SelectItem>
                  <SelectItem value="professional" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Professional</SelectItem>
                  <SelectItem value="social" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Social</SelectItem>
                  <SelectItem value="sports" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Sports & Recreation</SelectItem>
                  <SelectItem value="volunteer" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Volunteer</SelectItem>
                  <SelectItem value="wellness" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Health & Wellness</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setOrganizationFilter}>
                <SelectTrigger className="w-44 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="All Organizations" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="all" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">All Organizations</SelectItem>
                  <SelectItem value="student-union" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">UNBC Student Union</SelectItem>
                  <SelectItem value="outdoor-club" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">UNBC Outdoor Club</SelectItem>
                  <SelectItem value="business-club" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Business Students Association</SelectItem>
                  <SelectItem value="international" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">International Students Club</SelectItem>
                  <SelectItem value="sustainability" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Sustainability Office</SelectItem>
                  <SelectItem value="health-wellness" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Student Health & Wellness</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Search events..."
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-40 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Mobile: Tabs and Filters stacked */}
          <div className="md:hidden">
            <div className="p-6 pb-0 flex justify-center">
              <TabsList className="h-9 bg-gray-100 dark:bg-gray-700 p-1">
                <TabsTrigger value="day" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm dark:text-gray-300">
                  <CalendarDays className="h-3 w-3" />
                  Day
                </TabsTrigger>
                <TabsTrigger value="month" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm dark:text-gray-300">
                  <CalendarDays className="h-3 w-3" />
                  Month
                </TabsTrigger>
                <TabsTrigger value="list" className="text-xs px-3 py-1 flex items-center gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm dark:text-gray-300">
                  <List className="h-3 w-3" />
                  List
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Mobile Filters - Stacked */}
            <div className="p-6 pt-4 space-y-3">
              <Select onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="all" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">All Categories</SelectItem>
                  <SelectItem value="academic" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Academic</SelectItem>
                  <SelectItem value="arts" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Arts & Creative</SelectItem>
                  <SelectItem value="cultural" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Cultural</SelectItem>
                  <SelectItem value="professional" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Professional</SelectItem>
                  <SelectItem value="social" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Social</SelectItem>
                  <SelectItem value="sports" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Sports & Recreation</SelectItem>
                  <SelectItem value="volunteer" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Volunteer</SelectItem>
                  <SelectItem value="wellness" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Health & Wellness</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setOrganizationFilter}>
                <SelectTrigger className="border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="All Organizations" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="all" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">All Organizations</SelectItem>
                  <SelectItem value="student-union" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">UNBC Student Union</SelectItem>
                  <SelectItem value="outdoor-club" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">UNBC Outdoor Club</SelectItem>
                  <SelectItem value="business-club" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Business Students Association</SelectItem>
                  <SelectItem value="international" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">International Students Club</SelectItem>
                  <SelectItem value="sustainability" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Sustainability Office</SelectItem>
                  <SelectItem value="health-wellness" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-600">Student Health & Wellness</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Search events..."
                onChange={(e) => setSearchFilter(e.target.value)}
                className="border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          <TabsContent value="month" className="p-6 pt-4">
            <div className="hidden md:block">
              <MonthView 
                events={filteredEvents} 
                eventMetadata={eventMetadata}
                onDateClick={handleDateClick} 
                onEventClick={handleEventClick} 
              />
            </div>
            <div className="block md:hidden mobile-calendar">
              <MobileMonthView 
                events={filteredEvents} 
                eventMetadata={eventMetadata} 
                onEventClick={handleEventClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="week" className="p-6 pt-4">
            <WeekView 
              events={filteredEvents} 
              eventMetadata={eventMetadata}
              onEventClick={handleEventClick} 
            />
          </TabsContent>

          <TabsContent value="day" className="p-6 pt-4">
            <DayView 
              events={filteredEvents} 
              eventMetadata={eventMetadata}
              initialDate={selectedDate} 
              onEventClick={handleEventClick} 
            />
          </TabsContent>

          <TabsContent value="list" className="p-6 pt-4">
            <div className="hidden md:block">
              <EventListView events={filteredEvents} eventMetadata={eventMetadata} onEventClick={handleEventClick} />
            </div>
            <div className="block md:hidden">
              <MobileListView events={filteredEvents} eventMetadata={eventMetadata} onEventClick={handleEventClick} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Legend */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Event Categories</CardTitle>
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
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <EventDialog 
        event={selectedEvent}
        eventMetadata={eventMetadata}
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
      />
    </div>
  );
}
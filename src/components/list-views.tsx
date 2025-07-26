import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import type { Event, EventMetadata } from "@/types";

interface ListViewProps {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
  onEventClick?: (event: Event) => void;
}

export function EventListView({ events, eventMetadata, onEventClick }: ListViewProps) {
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
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{dateLabel}</h3>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {dateEvents.length} event{dateEvents.length > 1 ? 's' : ''}
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
                      className={`bg-muted dark:bg-gray-700 relative rounded-md p-3 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${categoryColor}`}
                      onClick={() => onEventClick?.(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-grow min-w-0">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{event.title}</div>
                          <div className="text-muted-foreground dark:text-gray-400 text-xs mt-1">
                            {formatTime(event.startDate)} - {formatTime(event.endDate)}
                          </div>
                          {metadata && (
                            <div className="text-muted-foreground dark:text-gray-400 text-xs mt-1">
                              {metadata.location}
                            </div>
                          )}
                          {metadata && (
                            <div className="text-muted-foreground dark:text-gray-400 text-xs mt-1">
                              {metadata.organization}
                            </div>
                          )}
                        </div>
                        {metadata && (
                          <div className="text-sm font-semibold text-green-600 dark:text-green-400 flex-shrink-0 ml-2">
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
}

export function MobileListView({ events, eventMetadata, onEventClick }: ListViewProps) {
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
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
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
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{dateLabel}</h3>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
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
                      className={`bg-muted dark:bg-gray-700 relative rounded-md p-3 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${categoryColor}`}
                      onClick={() => onEventClick?.(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-grow min-w-0">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{event.title}</div>
                          <div className="text-muted-foreground dark:text-gray-400 text-xs mt-1">
                            {formatTime(event.startDate)} - {formatTime(event.endDate)}
                          </div>
                          {metadata && (
                            <div className="text-muted-foreground dark:text-gray-400 text-xs mt-1">
                              {metadata.location}
                            </div>
                          )}
                          {metadata && (
                            <div className="text-muted-foreground dark:text-gray-400 text-xs mt-1">
                              {metadata.organization}
                            </div>
                          )}
                        </div>
                        {metadata && (
                          <div className="text-sm font-semibold text-green-600 dark:text-green-400 flex-shrink-0 ml-2">
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
}
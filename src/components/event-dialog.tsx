import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Building2, DollarSign, Calendar } from "lucide-react";
import type { Event, EventMetadata } from "@/types";

interface EventDialogProps {
  event: Event | null;
  eventMetadata: Record<string, EventMetadata>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDialog({ event, eventMetadata, open, onOpenChange }: EventDialogProps) {
  if (!event) return null;

  const metadata = eventMetadata[event.id];

  // Generate calendar links
  const generateCalendarLink = (type: 'google' | 'outlook' | 'apple') => {
    const startDate = event.startDate;
    const endDate = event.endDate || new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };
    
    const formatDateForOutlook = (date: Date) => {
      return date.toISOString();
    };

    switch (type) {
      case 'google':
        const googleUrl = new URL('https://calendar.google.com/calendar/render');
        googleUrl.searchParams.append('action', 'TEMPLATE');
        googleUrl.searchParams.append('text', event.title);
        googleUrl.searchParams.append('dates', `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`);
        googleUrl.searchParams.append('details', event.description || '');
        if (metadata?.location) {
          googleUrl.searchParams.append('location', metadata.location);
        }
        return googleUrl.toString();
        
      case 'outlook':
        const outlookUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
        outlookUrl.searchParams.append('subject', event.title);
        outlookUrl.searchParams.append('body', event.description || '');
        outlookUrl.searchParams.append('startdt', formatDateForOutlook(startDate));
        outlookUrl.searchParams.append('enddt', formatDateForOutlook(endDate));
        if (metadata?.location) {
          outlookUrl.searchParams.append('location', metadata.location);
        }
        return outlookUrl.toString();
        
      case 'apple':
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          `DTSTART:${formatDateForGoogle(startDate)}`,
          `DTEND:${formatDateForGoogle(endDate)}`,
          `SUMMARY:${event.title}`,
          `DESCRIPTION:${event.description || ''}`,
          metadata?.location ? `LOCATION:${metadata.location}` : '',
          'END:VEVENT',
          'END:VCALENDAR'
        ].filter(line => line).join('\n');
        
        return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
    }
  };

  const categoryStyles = {
    academic: 'bg-green-100 text-green-800',
    social: 'bg-orange-100 text-orange-800',
    cultural: 'bg-purple-100 text-purple-800',
    sports: 'bg-red-100 text-red-800',
    professional: 'bg-teal-100 text-teal-800',
    wellness: 'bg-blue-100 text-blue-800',
    volunteer: 'bg-yellow-100 text-yellow-800',
    arts: 'bg-pink-100 text-pink-800'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">{event.title}</DialogTitle>
          <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
            {event.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {event.startDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
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
              </div>
            </div>
            
            {metadata && (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">{metadata.location}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">{metadata.organization}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">{metadata.cost}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={categoryStyles[metadata.category as keyof typeof categoryStyles] || 'bg-gray-100 text-gray-800'}>
                    {metadata.category.charAt(0).toUpperCase() + metadata.category.slice(1)}
                  </Badge>
                  {metadata.registrationRequired && (
                    <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Registration Required</Badge>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Add to your calendar:</div>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(generateCalendarLink('google'), '_blank')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Google
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(generateCalendarLink('outlook'), '_blank')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Outlook
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                const link = generateCalendarLink('apple');
                const a = document.createElement('a');
                a.href = link;
                a.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
                a.click();
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Apple
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
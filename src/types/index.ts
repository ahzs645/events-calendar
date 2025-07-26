export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  variant?: 'success' | 'primary' | 'default' | 'warning' | 'danger';
}

export interface EventMetadata {
  category: string;
  organization: string;
  location: string;
  cost: string;
  registrationRequired: boolean;
  posterUrl?: string;
}

export type EventCategory = 
  | 'academic'
  | 'social'
  | 'cultural'
  | 'sports'
  | 'professional'
  | 'wellness'
  | 'volunteer'
  | 'arts';

export type ViewType = 'month' | 'week' | 'day' | 'list';
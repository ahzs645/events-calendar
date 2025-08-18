# ReactPress WordPress Integration Guide

## Overview
This guide shows how to integrate the WordPress Core Data Retrieval Architecture with your ReactPress event calendar, replacing the static data with dynamic WordPress REST API calls.

## Part 1: WordPress Backend Setup

### 1. Create the WordPress Plugin Structure

First, create your WordPress plugin with the following structure:

```
wp-content/plugins/unbc-events/
├── unbc-events.php
├── includes/
│   ├── class-post-types.php
│   ├── class-rest-api.php
│   └── class-meta-boxes.php
└── admin/
    └── admin-functions.php
```

### 2. Main Plugin File (unbc-events.php)

```php
<?php
/**
 * Plugin Name: UNBC Events
 * Description: Event management system for UNBC campus events
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class UNBC_Events_Plugin {
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    public function init() {
        $this->include_files();
        new UNBC_Events_Post_Types();
        new UNBC_Events_Meta_Boxes();
    }

    public function register_rest_routes() {
        new UNBC_Events_REST_API();
    }

    private function include_files() {
        require_once plugin_dir_path(__FILE__) . 'includes/class-post-types.php';
        require_once plugin_dir_path(__FILE__) . 'includes/class-rest-api.php';
        require_once plugin_dir_path(__FILE__) . 'includes/class-meta-boxes.php';
    }
}

new UNBC_Events_Plugin();
```

### 3. Custom Post Type Registration (includes/class-post-types.php)

```php
<?php
class UNBC_Events_Post_Types {
    public function __construct() {
        add_action('init', array($this, 'register_post_types'));
        add_action('init', array($this, 'register_taxonomies'));
    }

    public function register_post_types() {
        register_post_type('unbc_event', array(
            'labels' => array(
                'name' => 'Events',
                'singular_name' => 'Event',
                'add_new' => 'Add New Event',
                'add_new_item' => 'Add New Event',
                'edit_item' => 'Edit Event',
                'new_item' => 'New Event',
                'view_item' => 'View Event',
                'search_items' => 'Search Events',
                'not_found' => 'No events found',
                'not_found_in_trash' => 'No events found in Trash'
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'editor', 'excerpt', 'thumbnail'),
            'show_in_rest' => true,
            'rest_base' => 'events'
        ));

        // Organization post type for event organizers
        register_post_type('organization', array(
            'labels' => array(
                'name' => 'Organizations',
                'singular_name' => 'Organization'
            ),
            'public' => true,
            'supports' => array('title', 'editor'),
            'show_in_rest' => true
        ));
    }

    public function register_taxonomies() {
        register_taxonomy('event_category', 'unbc_event', array(
            'labels' => array(
                'name' => 'Event Categories',
                'singular_name' => 'Event Category'
            ),
            'hierarchical' => true,
            'show_in_rest' => true,
            'public' => true
        ));
    }
}
```

### 4. Meta Boxes (includes/class-meta-boxes.php)

```php
<?php
class UNBC_Events_Meta_Boxes {
    public function __construct() {
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        add_action('save_post', array($this, 'save_meta_boxes'));
    }

    public function add_meta_boxes() {
        add_meta_box(
            'event_details',
            'Event Details',
            array($this, 'event_details_callback'),
            'unbc_event',
            'normal',
            'high'
        );
    }

    public function event_details_callback($post) {
        wp_nonce_field('event_details_nonce', 'event_details_nonce');
        
        $event_date = get_post_meta($post->ID, 'event_date', true);
        $start_time = get_post_meta($post->ID, 'start_time', true);
        $end_time = get_post_meta($post->ID, 'end_time', true);
        $location = get_post_meta($post->ID, 'location', true);
        $building = get_post_meta($post->ID, 'building', true);
        $room = get_post_meta($post->ID, 'room', true);
        $cost = get_post_meta($post->ID, 'cost', true);
        $organization_id = get_post_meta($post->ID, 'organization_id', true);
        $registration_required = get_post_meta($post->ID, 'registration_required', true);
        $registration_link = get_post_meta($post->ID, 'registration_link', true);
        $contact_email = get_post_meta($post->ID, 'contact_email', true);
        $is_virtual = get_post_meta($post->ID, 'is_virtual', true);
        $virtual_link = get_post_meta($post->ID, 'virtual_link', true);
        $capacity = get_post_meta($post->ID, 'capacity', true);
        $featured = get_post_meta($post->ID, 'featured', true);

        ?>
        <table class="form-table">
            <tr>
                <th><label for="event_date">Event Date</label></th>
                <td><input type="date" id="event_date" name="event_date" value="<?php echo esc_attr($event_date); ?>" /></td>
            </tr>
            <tr>
                <th><label for="start_time">Start Time</label></th>
                <td><input type="time" id="start_time" name="start_time" value="<?php echo esc_attr($start_time); ?>" /></td>
            </tr>
            <tr>
                <th><label for="end_time">End Time</label></th>
                <td><input type="time" id="end_time" name="end_time" value="<?php echo esc_attr($end_time); ?>" /></td>
            </tr>
            <tr>
                <th><label for="location">Location</label></th>
                <td><input type="text" id="location" name="location" value="<?php echo esc_attr($location); ?>" /></td>
            </tr>
            <tr>
                <th><label for="building">Building</label></th>
                <td><input type="text" id="building" name="building" value="<?php echo esc_attr($building); ?>" /></td>
            </tr>
            <tr>
                <th><label for="room">Room</label></th>
                <td><input type="text" id="room" name="room" value="<?php echo esc_attr($room); ?>" /></td>
            </tr>
            <tr>
                <th><label for="cost">Cost</label></th>
                <td><input type="text" id="cost" name="cost" value="<?php echo esc_attr($cost); ?>" placeholder="Free" /></td>
            </tr>
            <tr>
                <th><label for="organization_id">Organization</label></th>
                <td>
                    <?php
                    $organizations = get_posts(array('post_type' => 'organization', 'numberposts' => -1));
                    echo '<select id="organization_id" name="organization_id">';
                    echo '<option value="">Select Organization</option>';
                    foreach ($organizations as $org) {
                        $selected = ($organization_id == $org->ID) ? 'selected' : '';
                        echo '<option value="' . $org->ID . '" ' . $selected . '>' . $org->post_title . '</option>';
                    }
                    echo '</select>';
                    ?>
                </td>
            </tr>
            <tr>
                <th><label for="registration_required">Registration Required</label></th>
                <td><input type="checkbox" id="registration_required" name="registration_required" value="1" <?php checked($registration_required, '1'); ?> /></td>
            </tr>
            <tr>
                <th><label for="registration_link">Registration Link</label></th>
                <td><input type="url" id="registration_link" name="registration_link" value="<?php echo esc_attr($registration_link); ?>" /></td>
            </tr>
            <tr>
                <th><label for="contact_email">Contact Email</label></th>
                <td><input type="email" id="contact_email" name="contact_email" value="<?php echo esc_attr($contact_email); ?>" /></td>
            </tr>
            <tr>
                <th><label for="is_virtual">Virtual Event</label></th>
                <td><input type="checkbox" id="is_virtual" name="is_virtual" value="1" <?php checked($is_virtual, '1'); ?> /></td>
            </tr>
            <tr>
                <th><label for="virtual_link">Virtual Link</label></th>
                <td><input type="url" id="virtual_link" name="virtual_link" value="<?php echo esc_attr($virtual_link); ?>" /></td>
            </tr>
            <tr>
                <th><label for="capacity">Capacity</label></th>
                <td><input type="number" id="capacity" name="capacity" value="<?php echo esc_attr($capacity); ?>" /></td>
            </tr>
            <tr>
                <th><label for="featured">Featured Event</label></th>
                <td><input type="checkbox" id="featured" name="featured" value="1" <?php checked($featured, '1'); ?> /></td>
            </tr>
        </table>
        <?php
    }

    public function save_meta_boxes($post_id) {
        if (!isset($_POST['event_details_nonce']) || !wp_verify_nonce($_POST['event_details_nonce'], 'event_details_nonce')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $meta_fields = array(
            'event_date', 'start_time', 'end_time', 'location', 'building', 'room',
            'cost', 'organization_id', 'registration_link', 'contact_email',
            'virtual_link', 'capacity'
        );

        foreach ($meta_fields as $field) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
            }
        }

        // Handle checkboxes
        $checkbox_fields = array('registration_required', 'is_virtual', 'featured');
        foreach ($checkbox_fields as $field) {
            update_post_meta($post_id, $field, isset($_POST[$field]) ? '1' : '0');
        }
    }
}
```

### 5. REST API Endpoints (includes/class-rest-api.php)

```php
<?php
class UNBC_Events_REST_API {
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes() {
        register_rest_route('unbc-events/v1', '/events', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'get_events'),
            'permission_callback' => '__return_true',
            'args' => array(
                'per_page' => array(
                    'default' => 10,
                    'sanitize_callback' => 'absint'
                ),
                'page' => array(
                    'default' => 1,
                    'sanitize_callback' => 'absint'
                ),
                'start_date' => array(
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                'end_date' => array(
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                'category' => array(
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                'organization' => array(
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                'featured' => array(
                    'sanitize_callback' => 'rest_sanitize_boolean'
                ),
                'search' => array(
                    'sanitize_callback' => 'sanitize_text_field'
                )
            )
        ));
    }

    public function get_events($request) {
        $params = $request->get_params();
        
        $args = array(
            'post_type' => 'unbc_event',
            'post_status' => 'publish',
            'posts_per_page' => $params['per_page'],
            'paged' => $params['page'],
            'meta_query' => array(),
            'tax_query' => array()
        );

        // Date filtering
        if (!empty($params['start_date']) || !empty($params['end_date'])) {
            $date_query = array('relation' => 'AND');
            
            if (!empty($params['start_date'])) {
                $date_query[] = array(
                    'key' => 'event_date',
                    'value' => $params['start_date'],
                    'compare' => '>='
                );
            }
            
            if (!empty($params['end_date'])) {
                $date_query[] = array(
                    'key' => 'event_date',
                    'value' => $params['end_date'],
                    'compare' => '<='
                );
            }
            
            $args['meta_query'][] = $date_query;
        }

        // Category filtering
        if (!empty($params['category'])) {
            $args['tax_query'][] = array(
                'taxonomy' => 'event_category',
                'field' => 'slug',
                'terms' => $params['category']
            );
        }

        // Organization filtering
        if (!empty($params['organization'])) {
            $args['meta_query'][] = array(
                'key' => 'organization_id',
                'value' => $params['organization'],
                'compare' => '='
            );
        }

        // Featured filtering
        if (isset($params['featured']) && $params['featured']) {
            $args['meta_query'][] = array(
                'key' => 'featured',
                'value' => '1',
                'compare' => '='
            );
        }

        // Search functionality
        if (!empty($params['search'])) {
            $args['s'] = $params['search'];
        }

        $query = new WP_Query($args);
        $events = array();

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $events[] = $this->format_event_data(get_the_ID());
            }
            wp_reset_postdata();
        }

        return rest_ensure_response(array(
            'events' => $events,
            'total' => $query->found_posts,
            'pages' => $query->max_num_pages
        ));
    }

    private function format_event_data($event_id) {
        $event = get_post($event_id);
        
        // Get meta data
        $event_date = get_post_meta($event_id, 'event_date', true);
        $start_time = get_post_meta($event_id, 'start_time', true) ?: '00:00';
        $end_time = get_post_meta($event_id, 'end_time', true) ?: '23:59';
        $location = get_post_meta($event_id, 'location', true);
        $building = get_post_meta($event_id, 'building', true);
        $room = get_post_meta($event_id, 'room', true);
        
        // Build full location string
        $full_location_parts = array_filter(array($location, $building, $room));
        $full_location = !empty($full_location_parts) ? implode(', ', $full_location_parts) : 'TBD';
        
        // Get organization
        $organization_id = get_post_meta($event_id, 'organization_id', true);
        $organization_name = '';
        if ($organization_id) {
            $organization = get_post($organization_id);
            $organization_name = $organization ? $organization->post_title : '';
        }
        
        // Get categories
        $categories = wp_get_post_terms($event_id, 'event_category');
        $category_data = array();
        foreach ($categories as $category) {
            $category_data[] = array(
                'id' => $category->term_id,
                'name' => $category->name,
                'slug' => $category->slug
            );
        }

        return array(
            'id' => $event_id,
            'title' => $event->post_title,
            'description' => $event->post_content,
            'excerpt' => $event->post_excerpt,
            'date' => $event_date,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'location' => $location,
            'building' => $building,
            'room' => $room,
            'full_location' => $full_location,
            'cost' => get_post_meta($event_id, 'cost', true) ?: 'Free',
            'organization' => $organization_name,
            'categories' => $category_data,
            'featured_image' => get_the_post_thumbnail_url($event_id, 'large'),
            'registration_required' => get_post_meta($event_id, 'registration_required', true) === '1',
            'registration_link' => get_post_meta($event_id, 'registration_link', true),
            'contact_email' => get_post_meta($event_id, 'contact_email', true),
            'is_virtual' => get_post_meta($event_id, 'is_virtual', true) === '1',
            'virtual_link' => get_post_meta($event_id, 'virtual_link', true),
            'capacity' => get_post_meta($event_id, 'capacity', true),
            'featured' => get_post_meta($event_id, 'featured', true) === '1',
            'permalink' => get_permalink($event_id)
        );
    }
}
```

## Part 2: ReactPress Frontend Integration

### 1. Create API Service (src/services/eventsApi.ts)

```typescript
interface WordPressEvent {
  id: number;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  building: string;
  room: string;
  full_location: string;
  cost: string;
  organization: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  featured_image: string;
  registration_required: boolean;
  registration_link: string;
  contact_email: string;
  is_virtual: boolean;
  virtual_link: string;
  capacity: string;
  featured: boolean;
  permalink: string;
}

interface EventsApiResponse {
  events: WordPressEvent[];
  total: number;
  pages: number;
}

interface EventFilters {
  per_page?: number;
  page?: number;
  start_date?: string;
  end_date?: string;
  category?: string;
  organization?: string;
  featured?: boolean;
  search?: string;
}

class EventsAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/wp-json/unbc-events/v1') {
    this.baseUrl = baseUrl;
  }

  async fetchEvents(filters: EventFilters = {}): Promise<EventsApiResponse> {
    try {
      const queryString = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryString.append(key, value.toString());
        }
      });

      const url = `${this.baseUrl}/events${queryString.toString() ? '?' + queryString.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  transformWordPressEventToEvent(wpEvent: WordPressEvent): Event {
    const startDate = this.parseDateTime(wpEvent.date, wpEvent.start_time);
    const endDate = this.parseDateTime(wpEvent.date, wpEvent.end_time);
    
    return {
      id: wpEvent.id.toString(),
      title: wpEvent.title,
      description: wpEvent.excerpt || this.stripHtml(wpEvent.description),
      startDate: startDate,
      endDate: endDate,
      variant: this.getCategoryVariant(wpEvent.categories)
    };
  }

  transformWordPressEventToMetadata(wpEvent: WordPressEvent): EventMetadata {
    return {
      category: this.mapWordPressCategory(wpEvent.categories),
      organization: wpEvent.organization,
      location: wpEvent.full_location,
      cost: wpEvent.cost,
      registrationRequired: wpEvent.registration_required,
      posterUrl: wpEvent.featured_image,
      registrationLink: wpEvent.registration_link,
      contactEmail: wpEvent.contact_email,
      isVirtual: wpEvent.is_virtual,
      virtualLink: wpEvent.virtual_link,
      capacity: wpEvent.capacity,
      featured: wpEvent.featured
    };
  }

  private parseDateTime(date: string, time: string): Date {
    const dateTime = new Date(`${date}T${time}`);
    return isNaN(dateTime.getTime()) ? new Date() : dateTime;
  }

  private stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  private getCategoryVariant(categories: Array<{name: string; slug: string}>): string {
    if (categories.length === 0) return 'default';
    
    const categoryMap: {[key: string]: string} = {
      'academic': 'success',
      'social': 'warning',
      'cultural': 'primary',
      'sports': 'danger',
      'professional': 'success',
      'wellness': 'primary',
      'volunteer': 'warning',
      'arts': 'primary'
    };
    
    return categoryMap[categories[0].slug] || 'default';
  }

  private mapWordPressCategory(categories: Array<{name: string; slug: string}>): EventCategory {
    if (categories.length === 0) return 'academic';
    
    const categoryMap: {[key: string]: EventCategory} = {
      'academic': 'academic',
      'social': 'social',
      'cultural': 'cultural',
      'sports': 'sports',
      'professional': 'professional',
      'wellness': 'wellness',
      'volunteer': 'volunteer',
      'arts': 'arts'
    };
    
    return categoryMap[categories[0].slug] || 'academic';
  }
}

export const eventsAPI = new EventsAPI();
export type { WordPressEvent, EventsApiResponse, EventFilters };
```

### 2. Create Event Hook (src/hooks/useEvents.ts)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { eventsAPI, type EventFilters } from '@/services/eventsApi';
import type { Event, EventMetadata } from '@/types';

interface UseEventsResult {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
  loading: boolean;
  error: string | null;
  total: number;
  pages: number;
  refetch: () => void;
  setFilters: (filters: EventFilters) => void;
}

export function useEvents(initialFilters: EventFilters = {}): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventMetadata, setEventMetadata] = useState<Record<string, EventMetadata>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [filters, setFilters] = useState<EventFilters>(initialFilters);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsAPI.fetchEvents(filters);
      
      const transformedEvents: Event[] = [];
      const transformedMetadata: Record<string, EventMetadata> = {};
      
      response.events.forEach(wpEvent => {
        const event = eventsAPI.transformWordPressEventToEvent(wpEvent);
        const metadata = eventsAPI.transformWordPressEventToMetadata(wpEvent);
        
        transformedEvents.push(event);
        transformedMetadata[event.id] = metadata;
      });
      
      setEvents(transformedEvents);
      setEventMetadata(transformedMetadata);
      setTotal(response.total);
      setPages(response.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateFilters = useCallback((newFilters: EventFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    events,
    eventMetadata,
    loading,
    error,
    total,
    pages,
    refetch,
    setFilters: updateFilters
  };
}
```

### 3. Update Main Calendar Component (src/components/unbc-calendar.tsx)

```typescript
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, List, Loader2 } from "lucide-react";
import type { Event } from "@/types";
import { useEvents } from "@/hooks/useEvents";
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
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");

  // Use the events hook
  const { 
    events, 
    eventMetadata, 
    loading, 
    error, 
    total, 
    setFilters 
  } = useEvents({
    per_page: 100, // Get all events for calendar view
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    organization: organizationFilter !== "all" ? organizationFilter : undefined,
    search: searchFilter || undefined
  });

  // Update filters when form controls change
  React.useEffect(() => {
    setFilters({
      category: categoryFilter !== "all" ? categoryFilter : undefined,
      organization: organizationFilter !== "all" ? organizationFilter : undefined,
      search: searchFilter || undefined
    });
  }, [categoryFilter, organizationFilter, searchFilter, setFilters]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">Error loading events: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
          🗓️ UNBC Campus Events
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Discover what's happening at UNBC - from academic workshops to social gatherings, all in one place
        </p>
      </div>

      {/* Event Statistics */}
      <EventStats events={events} eventMetadata={eventMetadata} />

      {/* Calendar Views */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop: Tabs and Filters inline */}
          <div className="hidden md:flex p-6 pb-0 justify-between items-center">
            <TabsList className="grid w-auto grid-cols-4">
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-4 items-center">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="sports">Sports & Recreation</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="wellness">Health & Wellness</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="arts">Arts & Creative</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Search events..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          {/* Mobile: Stacked layout */}
          <div className="md:hidden p-4 space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
            
            <div className="space-y-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="sports">Sports & Recreation</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="wellness">Health & Wellness</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="arts">Arts & Creative</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Search events..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Tab Contents */}
          <TabsContent value="month" className="p-6 pt-2">
            <div className="hidden md:block">
              <MonthView 
                events={events} 
                onEventClick={handleEventClick}
                initialDate={selectedDate}
              />
            </div>
            <div className="md:hidden">
              <MobileMonthView 
                events={events} 
                eventMetadata={eventMetadata}
                onEventClick={handleEventClick}
                initialDate={selectedDate}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="p-6 pt-2">
            <WeekView 
              events={events} 
              onEventClick={handleEventClick}
              initialDate={selectedDate}
            />
          </TabsContent>
          
          <TabsContent value="day" className="p-6 pt-2">
            <DayView 
              events={events} 
              onEventClick={handleEventClick}
              initialDate={selectedDate}
            />
          </TabsContent>
          
          <TabsContent value="list" className="p-6 pt-2">
            <div className="hidden md:block">
              <EventListView 
                events={events} 
                eventMetadata={eventMetadata}
                onEventClick={handleEventClick}
              />
            </div>
            <div className="md:hidden">
              <MobileListView 
                events={events} 
                eventMetadata={eventMetadata}
                onEventClick={handleEventClick}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Event Dialog */}
      <EventDialog
        event={selectedEvent}
        eventMetadata={eventMetadata}
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
      />
    </div>
  );
}
```

## Part 3: Configuration and Environment

### 1. Environment Variables

Create a `.env.local` file in your ReactPress root:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/unbc-events/v1
```

### 2. Update API Service with Environment

```typescript
class EventsAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '/wp-json/unbc-events/v1';
  }
  
  // ... rest of the class
}
```

## Part 4: Migration Strategy

### 1. Gradual Migration Approach

1. **Phase 1**: Set up WordPress plugin and create a few test events
2. **Phase 2**: Update ReactPress to use the hook but keep static data as fallback
3. **Phase 3**: Migrate all static events to WordPress
4. **Phase 4**: Remove static data completely

### 2. Fallback Implementation

```typescript
// In useEvents hook, add fallback to static data
import { unbcEvents as staticEvents, eventMetadata as staticMetadata } from '@/data/events';

export function useEvents(initialFilters: EventFilters = {}): UseEventsResult {
  // ... existing code

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsAPI.fetchEvents(filters);
      
      // Transform WordPress events
      const transformedEvents: Event[] = [];
      const transformedMetadata: Record<string, EventMetadata> = {};
      
      response.events.forEach(wpEvent => {
        const event = eventsAPI.transformWordPressEventToEvent(wpEvent);
        const metadata = eventsAPI.transformWordPressEventToMetadata(wpEvent);
        
        transformedEvents.push(event);
        transformedMetadata[event.id] = metadata;
      });
      
      setEvents(transformedEvents);
      setEventMetadata(transformedMetadata);
      setTotal(response.total);
      setPages(response.pages);
    } catch (err) {
      // Fallback to static data on error
      console.warn('Failed to fetch from WordPress, using static data:', err);
      setEvents(staticEvents);
      setEventMetadata(staticMetadata);
      setTotal(staticEvents.length);
      setPages(1);
      setError('Using static data - WordPress connection failed');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ... rest of the hook
}
```

## Summary

This implementation provides:

1. **WordPress Backend**: Complete custom post type system with REST API
2. **ReactPress Frontend**: Hook-based data fetching with error handling
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Filtering**: Advanced filtering capabilities matching your current UI
5. **Migration Path**: Gradual migration strategy with fallbacks
6. **Performance**: Efficient data fetching with caching possibilities

The system maintains your current UI/UX while connecting to dynamic WordPress data, giving you the best of both worlds.
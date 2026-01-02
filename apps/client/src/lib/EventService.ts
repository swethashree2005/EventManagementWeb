// lib/eventService.ts - Event Management Functions

import { supabase, Event, Registration, EventStats } from './supabaseClient';

export const eventService = {
  // Get all published events
  getPublishedEvents: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*, organizer:profiles(*)')
      .eq('status', 'published')
      .order('event_date', { ascending: true });
    return { data, error };
  },

  // Get single event by ID
  getEventById: async (eventId: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*, organizer:profiles(*)')
      .eq('id', eventId)
      .single();
    return { data, error };
  },

  // Get events by organizer
  getOrganizerEvents: async (organizerId: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', organizerId)
      .order('event_date', { ascending: false });
    return { data, error };
  },

  // Create new event
  createEvent: async (eventData: Partial<Event>) => {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
    return { data, error };
  },

  // Update event
  updateEvent: async (eventId: string, updates: Partial<Event>) => {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();
    return { data, error };
  },

  // Delete event
  deleteEvent: async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    return { error };
  },

  // Upload event image
  uploadEventImage: async (file: File, eventId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${eventId}-${Date.now()}.${fileExt}`;
    const filePath = `${eventId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) return { data: null, error };

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('event-images')
      .getPublicUrl(filePath);

    return { data: { path: filePath, url: publicUrl }, error: null };
  },

  // Delete event image
  deleteEventImage: async (imagePath: string) => {
    const { error } = await supabase.storage
      .from('event-images')
      .remove([imagePath]);
    return { error };
  },

  // Get categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    return { data, error };
  },

  // Search events
  searchEvents: async (query: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*, organizer:profiles(*)')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('event_date', { ascending: true });
    return { data, error };
  },

  // Filter events by category
  filterEventsByCategory: async (category: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*, organizer:profiles(*)')
      .eq('status', 'published')
      .eq('category', category)
      .order('event_date', { ascending: true });
    return { data, error };
  },
};

export const registrationService = {
  // Register for event (RSVP)
  registerForEvent: async (eventId: string, userId: string, notes?: string) => {
    const { data, error } = await supabase
      .from('registrations')
      .insert([{
        event_id: eventId,
        user_id: userId,
        notes: notes || null,
      }])
      .select()
      .single();
    return { data, error };
  },

  // Cancel registration
  cancelRegistration: async (registrationId: string) => {
    const { data, error } = await supabase
      .from('registrations')
      .update({ status: 'cancelled' })
      .eq('id', registrationId)
      .select()
      .single();
    return { data, error };
  },

  // Get user registrations
  getUserRegistrations: async (userId: string) => {
    const { data, error } = await supabase
      .from('registrations')
      .select('*, event:events(*, organizer:profiles(*))')
      .eq('user_id', userId)
      .order('registered_at', { ascending: false });
    return { data, error };
  },

  // Get event registrations (for organizers)
  getEventRegistrations: async (eventId: string) => {
    const { data, error } = await supabase
      .from('registrations')
      .select('*, user:profiles(*)')
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false });
    return { data, error };
  },

  // Check if user is registered
  isUserRegistered: async (eventId: string, userId: string) => {
    const { data, error } = await supabase
      .from('registrations')
      .select('id, status')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .eq('status', 'registered')
      .maybeSingle();
    return { isRegistered: !!data, registration: data, error };
  },

  // Mark attendee as attended
  markAttended: async (registrationId: string) => {
    const { data, error } = await supabase
      .from('registrations')
      .update({ status: 'attended' })
      .eq('id', registrationId)
      .select()
      .single();
    return { data, error };
  },
};

export const dashboardService = {
  // Get event statistics for organizer
  getEventStats: async (organizerId: string) => {
    const { data, error } = await supabase
      .from('event_stats')
      .select('*')
      .eq('organizer_id', organizerId)
      .order('event_date', { ascending: false });
    return { data, error };
  },

  // Get organizer summary
  getOrganizerSummary: async (organizerId: string) => {
    // Get total events
    const { count: totalEvents } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('organizer_id', organizerId);

    // Get published events
    const { count: publishedEvents } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('organizer_id', organizerId)
      .eq('status', 'published');

    // Get total registrations across all events
    const { data: registrations } = await supabase
      .from('registrations')
      .select('id, event:events!inner(organizer_id)')
      .eq('event.organizer_id', organizerId);

    const totalRegistrations = registrations?.length || 0;

    // Get upcoming events count
    const { count: upcomingEvents } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('organizer_id', organizerId)
      .eq('status', 'published')
      .gte('event_date', new Date().toISOString());

    return {
      totalEvents: totalEvents || 0,
      publishedEvents: publishedEvents || 0,
      totalRegistrations,
      upcomingEvents: upcomingEvents || 0,
    };
  },
};
// lib/supabase.ts - Supabase Client Configuration

import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
// Get these from: Supabase Dashboard > Project Settings > API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'organizer' | 'attendee';
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  venue: string | null;
  event_date: string;
  end_date: string | null;
  capacity: number | null;
  price: number;
  image_url: string | null;
  image_path: string | null;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  rsvp_enabled: boolean;
  rsvp_deadline: string | null;
  created_at: string;
  updated_at: string;
  organizer?: Profile;
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  status: 'registered' | 'cancelled' | 'attended';
  payment_status: 'pending' | 'paid' | 'refunded';
  registered_at: string;
  notes: string | null;
  event?: Event;
  user?: Profile;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface EventStats {
  id: string;
  title: string;
  organizer_id: string;
  event_date: string;
  status: string;
  capacity: number | null;
  total_registrations: number;
  active_registrations: number;
  cancelled_registrations: number;
  attendees: number;
  capacity_percentage: number;
}
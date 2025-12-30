"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [events, setEvents] = useState([]);

  // Fetch events with RSVP count
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*, rsvps(count)")
      .order("date", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    // Convert Supabase nested result into usable field
    const mapped = data.map((event: any) => ({
      ...event,
      rsvp_count: event.rsvps?.[0]?.count || 0,
    }));

    setEvents(mapped);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle RSVP
  const handleRSVP = async (eventId: string) => {
    const name = prompt("Enter your name:");
    const email = prompt("Enter your email:");

    if (!name || !email) {
      alert("Both name and email are required!");
      return;
    }

    const { error } = await supabase
      .from("rsvps")
      .insert([{ event_id: eventId, name, email }]);

    if (error) {
      alert("Error submitting RSVP: " + error.message);
    } else {
      alert("RSVP submitted! 🎉");
      fetchEvents(); // refresh the updated RSVP count
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      {events.length === 0 ? (
        <p className="text-gray-500">No events available. Create one!</p>
      ) : (
        <div className="space-y-5">
          {events.map((event: any) => (
            <div
              key={event.id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <a
                href={`/event/${event.id}`}
                className="text-xl font-semibold text-blue-700 hover:underline"
              >
                {event.title}
              </a>

              <p className="text-gray-600 mb-2">{event.description}</p>

              <p className="text-blue-600 text-sm">
                {new Date(event.date).toLocaleString()}
              </p>

              <p className="text-green-700 text-sm mt-1">
                RSVPs: {event.rsvp_count}
              </p>

              <button
                onClick={() => handleRSVP(event.id)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                RSVP
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

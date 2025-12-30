"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function EventDetails({ params }: any) {
  const eventId = params.id; // dynamic route value

  const [event, setEvent] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch event + RSVPs
  const fetchEventData = async () => {
    setLoading(true);

    // Fetch event info
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError) console.error(eventError);
    else setEvent(eventData);

    // Fetch RSVPs for this event
    const { data: rsvpData, error: rsvpError } = await supabase
      .from("rsvps")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (rsvpError) console.error(rsvpError);
    else setRsvps(rsvpData);

    setLoading(false);
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  // RSVP button handler
  const handleRSVP = async () => {
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
      alert("Error sending RSVP: " + error.message);
    } else {
      alert("RSVP successful!");
      fetchEventData(); // Refresh list
    }
  };

  if (loading) {
    return <p className="p-6">Loading event...</p>;
  }

  if (!event) {
    return <p className="p-6 text-red-600">Event not found.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-3">{event.title}</h1>

      <p className="text-gray-700 mb-2">{event.description}</p>

      <p className="text-blue-600 mb-4">
        {new Date(event.date).toLocaleString()}
      </p>

      {/* RSVP Button */}
      <button
        onClick={handleRSVP}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        RSVP
      </button>

      {/* RSVP List */}
      <h2 className="text-xl font-semibold mb-3">Attendees ({rsvps.length})</h2>

      {rsvps.length === 0 ? (
        <p className="text-gray-500">No one has RSVP’d yet.</p>
      ) : (
        <ul className="space-y-3">
          {rsvps.map((person) => (
            <li
              key={person.id}
              className="border p-3 rounded bg-white shadow-sm"
            >
              <p className="font-medium">{person.name}</p>
              <p className="text-gray-600 text-sm">{person.email}</p>
              <p className="text-gray-400 text-xs">
                {new Date(person.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

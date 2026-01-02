"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { eventService, registrationService } from "@/lib/EventService";
import { authHelpers } from "@/lib/auth";
import { Event } from "@/lib/supabaseClient";
import { formatDateTime } from "@/lib/DateUtils";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params Promise
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    loadEvent();
  }, [eventId]);

  const checkUser = async () => {
    const { user } = await authHelpers.getCurrentUser();
    setUser(user);
  };

  const loadEvent = async () => {
    setLoading(true);
    const { data, error } = await eventService.getEventById(eventId);
    if (!error && data) {
      setEvent(data);
      if (user) {
        await checkRegistration(data.id);
      }
    }
    setLoading(false);
  };

  const checkRegistration = async (eventId: string) => {
    if (!user) return;
    const { isRegistered } = await registrationService.isUserRegistered(
      eventId,
      user.id
    );
    setIsRegistered(isRegistered);
  };

  const handleRSVP = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setRegistering(true);
    const { error } = await registrationService.registerForEvent(
      event!.id,
      user.id
    );

    if (!error) {
      setIsRegistered(true);
      alert("Successfully registered for the event!");
    } else {
      alert("Failed to register: " + error.message);
    }
    setRegistering(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h2>
          <button
            onClick={() => router.push("/events")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.push("/events")}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Events
        </button>

        {/* Event Image */}
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg mb-8"
          />
        ) : (
          <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-lg mb-8 flex items-center justify-center">
            <span className="text-white text-9xl">📅</span>
          </div>
        )}

        {/* Event Details */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded">
                {event.category || "Event"}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">
                {event.title}
              </h1>
              <p className="text-gray-600">
                Organized by {event.organizer?.full_name || "Unknown"}
              </p>
            </div>
            {event.price > 0 && (
              <div className="text-right ml-4">
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${event.price}
                </p>
              </div>
            )}
          </div>

          {/* Event Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Date & Time</p>
                <p className="text-gray-600">
                  {formatDateTime(event.event_date)}
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Location</p>
                  <p className="text-gray-600">{event.location}</p>
                  {event.venue && (
                    <p className="text-gray-500 text-sm">{event.venue}</p>
                  )}
                </div>
              </div>
            )}

            {event.capacity && (
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Capacity</p>
                  <p className="text-gray-600">{event.capacity} attendees</p>
                </div>
              </div>
            )}

            {event.price === 0 && (
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 mr-3 text-green-600 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Admission</p>
                  <p className="text-green-600 font-semibold">Free Event</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="border-t pt-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Event
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* RSVP Button */}
          {event.rsvp_enabled && (
            <div className="border-t pt-6">
              {isRegistered ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-green-600 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-green-800 font-semibold">
                      You're registered for this event!
                    </span>
                  </div>
                  <button
                    onClick={() => router.push("/my-events")}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    View My Events
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRSVP}
                  disabled={registering}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registering ? "Registering..." : "RSVP Now"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

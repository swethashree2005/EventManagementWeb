"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authHelpers } from "@/lib/auth";
import { registrationService } from "@/lib/EventService";
import { formatDateTime, formatDate } from "@/lib/DateUtils";

export default function MyEventsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkUserAndLoadEvents();
  }, []);

  const checkUserAndLoadEvents = async () => {
    const { user } = await authHelpers.getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);
    await loadRegistrations(user.id);
  };

  const loadRegistrations = async (userId: string) => {
    setLoading(true);
    const { data, error } =
      await registrationService.getUserRegistrations(userId);
    if (!error && data) {
      setRegistrations(data);
    }
    setLoading(false);
  };

  const handleCancelRegistration = async (registrationId: string) => {
    if (!confirm("Are you sure you want to cancel this registration?")) return;

    const { error } =
      await registrationService.cancelRegistration(registrationId);
    if (!error) {
      alert("Registration cancelled successfully");
      loadRegistrations(user.id);
    } else {
      alert("Failed to cancel registration");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      registered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      attended: "bg-blue-100 text-blue-800",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Events</h1>
          <Link href="/events" className="btn-primary">
            Browse More Events
          </Link>
        </div>

        {registrations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-400 mb-4"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Events Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't registered for any events. Start exploring!
            </p>
            <Link href="/event" className="btn-primary">
              Discover Events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="md:flex">
                  {/* Event Image */}
                  <div className="md:w-64 h-48 md:h-auto">
                    {reg.event?.image_url ? (
                      <img
                        src={reg.event.image_url}
                        alt={reg.event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-6xl">📅</span>
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Link
                          href={`/event/${reg.event?.id}`}
                          className="text-2xl font-bold text-gray-900 hover:text-blue-600"
                        >
                          {reg.event?.title}
                        </Link>
                        <p className="text-gray-600 mt-1">
                          {reg.event?.category}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          reg.status
                        )}`}
                      >
                        {reg.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDateTime(reg.event?.event_date)}
                      </div>

                      {reg.event?.location && (
                        <div className="flex items-center text-gray-600">
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
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {reg.event.location}
                        </div>
                      )}

                      <div className="flex items-center text-gray-600">
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Registered {formatDate(reg.registered_at)}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/event/${reg.event?.id}`}
                        className="btn-secondary"
                      >
                        View Details
                      </Link>
                      {reg.status === "registered" && (
                        <button
                          onClick={() => handleCancelRegistration(reg.id)}
                          className="btn-danger"
                        >
                          Cancel Registration
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

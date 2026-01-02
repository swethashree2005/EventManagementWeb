"use client";

import Link from "next/link";
import {
  Calendar,
  Users,
  TrendingUp,
  Award,
  ArrowRight,
  UserPlus,
  ShieldCheck,
  Zap,
  BarChart3,
  Settings,
  Ticket,
  MapPin,
  Clock,
  Image as ImageIcon,
  Database,
  Users2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(120,119,198,0.1),transparent_50%)]" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-2xl border border-slate-700/50 mb-8">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Enterprise Grade Event Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-slate-200 to-slate-100 bg-clip-text text-transparent">
              Professional Event
            </span>
            <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Management Platform
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Create, manage, and scale events with enterprise-grade tools. From
            small meetups to 10K+ attendee conferences, get complete control
            with real-time analytics, automated workflows, and seamless attendee
            management.
          </p>

          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-20">
            <Link
              href="/create-event"
              className="group relative bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 transform-gpu flex items-center gap-3 w-full lg:w-auto"
            >
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>Create Your First Event</span>
              <ArrowRight className="w-6 h-6 ml-auto group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              href="/event"
              className="group bg-slate-800/50 hover:bg-slate-700 backdrop-blur-xl text-slate-200 hover:text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl hover:-translate-y-2 border border-slate-700/50 transition-all duration-500 transform-gpu flex items-center gap-3 w-full lg:w-auto"
            >
              <BarChart3 className="w-6 h-6" />
              Browse Events
            </Link>
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-black text-emerald-400 mb-2">
                50K+
              </div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">
                Events Hosted
              </div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-black text-blue-400 mb-2">
                1M+
              </div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">
                Attendees
              </div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-black text-purple-400 mb-2">
                99.9%
              </div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">
                Uptime
              </div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-black text-emerald-400 mb-2">
                24/7
              </div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">
                Support
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-32 relative">
        <div className="text-center mb-24">
          <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-200 to-slate-100 bg-clip-text text-transparent mb-6">
            Complete Event Lifecycle Management
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Every tool you need to plan, execute, and analyze successful events.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Feature Details */}
          <div className="space-y-12">
            <div className="group bg-slate-800/50 backdrop-blur-xl p-10 rounded-3xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-xl">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">
                    Event Creation & Planning
                  </h3>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Rich event builder with templates</li>
                    <li>• Advanced scheduling & recurring events</li>
                    <li>• Location management with maps</li>
                    <li>• Capacity limits & waitlists</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="group bg-slate-800/50 backdrop-blur-xl p-10 rounded-3xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
                  <Users2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">
                    Attendee Management
                  </h3>
                  <ul className="space-y-2 text-slate-300">
                    <li>• RSVP & check-in system</li>
                    <li>• Custom registration forms</li>
                    <li>• Automated email/SMS notifications</li>
                    <li>• Detailed attendee profiles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - More Features */}
          <div className="space-y-12">
            <div className="group bg-slate-800/50 backdrop-blur-xl p-10 rounded-3xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">
                    Analytics & Insights
                  </h3>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Real-time attendance tracking</li>
                    <li>• Conversion funnel analysis</li>
                    <li>• Revenue & ticket reports</li>
                    <li>• Post-event surveys</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="group bg-slate-800/50 backdrop-blur-xl p-10 rounded-3xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">
                    Admin & Integrations
                  </h3>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Role-based permissions</li>
                    <li>• Zapier, Stripe, Google Calendar</li>
                    <li>• Custom domains & branding</li>
                    <li>• API access for developers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900/50 backdrop-blur-xl rounded-3xl p-16 lg:p-24 border border-slate-700 shadow-2xl">
          <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Ready to Scale Your Events?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Start with our forever-free plan. No credit card required.
            Enterprise features available.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/signup"
              className="group bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 transform-gpu flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <UserPlus className="w-6 h-6" />
              Start Free Trial
            </Link>
            <Link
              href="/event"
              className="group bg-transparent hover:bg-slate-800 text-slate-200 hover:text-white px-12 py-6 rounded-2xl text-xl font-bold border-2 border-slate-600 hover:border-emerald-500 transition-all duration-500 flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              View Demo Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

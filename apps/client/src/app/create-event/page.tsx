"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authHelpers } from "@/lib/auth";
import { eventService } from "@/lib/EventService";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  Upload,
  ChevronLeft,
  Zap,
  Loader2,
  AlertCircle,
  Ticket,
  Tag,
  Users2,
  ShieldCheck,
} from "lucide-react";

export default function CreateEventPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    venue: "",
    event_date: "",
    end_date: "",
    capacity: "",
    price: "",
    status: "draft" as "draft" | "published",
    rsvp_enabled: true,
    rsvp_deadline: "",
  });

  useEffect(() => {
    checkUser();
    loadCategories();
  }, []);

  const checkUser = async () => {
    const { user } = await authHelpers.getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);
  };

  const loadCategories = async () => {
    const { data } = await eventService.getCategories();
    if (data) {
      setCategories(data);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }
    if (file) {
      setImageFile(file);
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Basic validation
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.location ||
      !formData.event_date
    ) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const eventData: any = {
        ...formData,
        organizer_id: user.id,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        price: formData.price ? parseFloat(formData.price) : 0,
      };

      // Upload image if selected
      if (imageFile) {
        setImageUploading(true);
        const tempEventId = crypto.randomUUID();
        const { data: uploadData, error: uploadError } =
          await eventService.uploadEventImage(imageFile, tempEventId);

        if (uploadError) {
          setError("Failed to upload image: " + uploadError.message);
          setLoading(false);
          setImageUploading(false);
          return;
        }
        if (uploadData) {
          eventData.image_url = uploadData.url;
          eventData.image_path = uploadData.path;
        }
        setImageUploading(false);
      }

      // Create the event
      const { data, error: createError } =
        await eventService.createEvent(eventData);

      if (createError) {
        setError("Failed to create event: " + createError.message);
        setLoading(false);
        return;
      }

      if (data) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/organiser/dashboard");
        }, 2000);
      }
    } catch (err: any) {
      setError("An unexpected error occurred: " + err.message);
    }

    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/90 via-slate-900 to-gray-900/90 backdrop-blur-xl">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-24 pb-12">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => router.back()}
            className="p-3 bg-slate-800/50 hover:bg-slate-700 rounded-2xl backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl"
          >
            <ChevronLeft className="w-6 h-6 text-slate-300" />
          </button>
          <div>
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-200 via-blue-200 to-emerald-200 bg-clip-text text-transparent mb-2">
              Create Event
            </h1>
            <p className="text-xl text-slate-400">
              Professional event setup with enterprise-grade features
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-3xl backdrop-blur-sm shadow-2xl">
            <div className="flex items-center gap-4">
              <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
              <span className="text-lg text-slate-200 font-medium">
                {error}
              </span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-8 p-8 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-3xl backdrop-blur-sm shadow-3xl animate-pulse">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-emerald-200 mb-2">
                  Event Created Successfully!
                </h3>
                <p className="text-lg text-emerald-100">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800/50 rounded-4xl shadow-3xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-10 lg:p-12 space-y-8">
            {/* Hero Image Upload */}
            <div className="group">
              <label className="block text-lg font-bold text-slate-200 mb-6 flex items-center gap-3">
                <ImageIcon className="w-8 h-8 text-emerald-400" />
                Event Hero Image
              </label>
              <div className="relative">
                <div
                  className={`relative w-full h-80 rounded-3xl overflow-hidden border-4 border-dashed transition-all duration-500 cursor-pointer group-hover:border-emerald-500/50 hover:shadow-3xl hover:-translate-y-2 bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:border-emerald-400/30 ${
                    imagePreview ? "border-emerald-500/50 shadow-3xl" : ""
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-4 right-4 p-2 bg-slate-900/90 hover:bg-red-500/90 text-white rounded-2xl backdrop-blur-sm shadow-2xl transition-all duration-300 hover:scale-110"
                      ></button>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                      <Upload className="w-20 h-20 text-slate-500 mb-6 opacity-60" />
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-300">
                          Upload Event Image
                        </h3>
                        <p className="text-slate-500 text-lg">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                  {imageUploading && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="flex items-center gap-3 text-emerald-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="font-semibold">
                          Uploading image...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Core Info */}
              <div className="space-y-8">
                {/* Title */}
                <div className="group">
                  <label className="flex items-center gap-3 mb-4 text-lg font-bold text-slate-200">
                    <Tag className="w-7 h-7 text-blue-400" />
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-6 py-5 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/50 focus:border-blue-400/70 rounded-3xl text-xl font-bold text-slate-200 placeholder-slate-500 shadow-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                    placeholder="e.g., Annual Tech Conference 2026"
                  />
                </div>

                {/* Description */}
                <div className="group">
                  <label className="flex items-center gap-3 mb-4 text-lg font-bold text-slate-200">
                    <Users2 className="w-7 h-7 text-emerald-400" />
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-6 py-5 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/50 focus:border-emerald-400/70 rounded-3xl text-lg text-slate-200 placeholder-slate-500 shadow-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 resize-vertical transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 font-normal"
                    placeholder="Tell attendees about your event..."
                  />
                </div>

                {/* Category */}
                <div className="group">
                  <label className="flex items-center gap-3 mb-4 text-lg font-bold text-slate-200">
                    <Ticket className="w-7 h-7 text-purple-400" />
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-6 py-5 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/50 focus:border-purple-400/70 rounded-3xl text-lg font-semibold text-slate-200 shadow-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 appearance-none bg-no-repeat bg-[right_1rem_center/1.5rem_no-repeat] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDUuMDI1VjE4Ljk3NUwxOC45NzUgMTIuMGwxLjk5OSAxLjk5OUwxMiAyMi45NzVWNy4wMjVMMy4wMjUgMTIuMGwxLjk5OS0xLjk5OUwxMiA1LjAyNVoiIGZpbGw9IiM5Q0E4QjIiLz4KPC9zdmc+Cg==')] hover:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDUuMDI1VjE4Ljk3NUwxOC45NzUgMTIuMGwxLjk5OSAxLjk5OUwxMiAyMi45NzVWNy4wMjVMMy4wMjUgMTIuMGwxLjk5OS0xLjk5OUwxMiA1LjAyNVoiIGZpbGw9IiM4MEY1RkQiLz4KPC9zdmc+Cg==')]"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column - Logistics */}
              <div className="space-y-8">
                {/* Dates */}
                <div className="space-y-6">
                  <label className="flex items-center gap-3 text-lg font-bold text-slate-200">
                    <Clock className="w-7 h-7 text-blue-400" />
                    Event Timing
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-400 mb-2">
                        Start Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="event_date"
                        required
                        value={formData.event_date}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/50 focus:border-blue-400/70 rounded-2xl text-lg font-semibold text-slate-200 shadow-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-500 hover:shadow-2xl"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-400 mb-2">
                        End Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full px-5 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/50 focus:border-blue-400/70 rounded-2xl text-lg font-semibold text-slate-200 shadow-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-500 hover:shadow-2xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <label className="flex items-center gap-3 text-lg font-bold text-slate-200">
                    <MapPin className="w-7 h-7 text-emerald-400" />
                    Location Details *
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/50 focus:border-emerald-400/70 rounded-2xl text-lg font-semibold text-slate-200 placeholder-slate-500 shadow-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-500 hover:shadow-2xl"
                      placeholder="City, State"
                    />
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/50 focus:border-emerald-400/70 rounded-2xl text-lg font-semibold text-slate-200 placeholder-slate-500 shadow-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-500 hover:shadow-2xl"
                      placeholder="Venue name"
                    />
                  </div>
                </div>

                {/* Capacity & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      min="0"
                      value={formData.capacity}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-purple-500/50 focus:border-purple-400/70 rounded-2xl text-lg font-semibold text-slate-200 shadow-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-500 hover:shadow-2xl"
                      placeholder="Unlimited"
                    />
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/50 focus:border-emerald-400/70 rounded-2xl text-lg font-semibold text-slate-200 shadow-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-500 hover:shadow-2xl"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-6 p-8 bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-slate-700/50">
              <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
                <ShieldCheck className="w-9 h-9" />
                Advanced Settings
              </h3>

              {/* RSVP */}
              <div className="flex items-center gap-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                <input
                  type="checkbox"
                  id="rsvp_enabled"
                  name="rsvp_enabled"
                  checked={formData.rsvp_enabled}
                  onChange={handleChange}
                  className="w-6 h-6 text-blue-500 bg-slate-700/50 border-slate-600/50 focus:ring-blue-500/50 rounded-xl focus:ring-2 transition-all duration-300 hover:scale-110"
                />
                <label
                  htmlFor="rsvp_enabled"
                  className="text-xl font-bold text-slate-200 cursor-pointer select-none flex-1"
                >
                  Enable RSVP System
                </label>
                {formData.rsvp_enabled && (
                  <div className="ml-auto group">
                    <label className="block text-sm font-semibold text-slate-400 mb-1">
                      RSVP Deadline
                    </label>
                    <input
                      type="datetime-local"
                      name="rsvp_deadline"
                      value={formData.rsvp_deadline}
                      onChange={handleChange}
                      className="px-4 py-2.5 bg-slate-900/50 backdrop-blur-xl border border-slate-600/50 hover:border-blue-500/50 focus:border-blue-400/70 rounded-xl text-lg font-semibold text-slate-200 shadow-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-500 w-72"
                    />
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div>
                  <label className="flex items-center gap-3 text-xl font-bold text-slate-200 mb-2">
                    <Zap className="w-8 h-8 text-purple-400" />
                    Publish Status *
                  </label>
                  <p className="text-sm text-slate-500">
                    Draft: Private | Published: Public
                  </p>
                </div>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="px-6 py-4 bg-slate-900/50 backdrop-blur-xl border border-slate-600/50 hover:border-purple-500/50 focus:border-purple-400/70 rounded-2xl text-xl font-bold text-slate-200 shadow-2xl focus:shadow-3xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-500 appearance-none bg-no-repeat bg-[right_1.5rem_center/2rem_no-repeat]"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Published (Public)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6 pt-8">
              <button
                type="button"
                onClick={() => router.push("/organiser/dashboard")}
                className="flex-1 group relative px-10 py-7 bg-gradient-to-r from-slate-800/50 to-slate-900/50 hover:from-slate-700 hover:to-slate-800 text-slate-200 hover:text-white font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 backdrop-blur-xl flex items-center justify-center gap-3 text-xl"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
                Cancel & Return
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 group relative px-12 py-7 bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-blue-700 text-white font-black rounded-3xl shadow-3xl hover:shadow-4xl hover:-translate-y-3 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transition-all duration-700 backdrop-blur-xl flex items-center justify-center gap-4 text-xl overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-7 h-7 animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-7 h-7 group-hover:scale-110 transition-transform" />
                    Create Event
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 -skew-x-12 -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-1000" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

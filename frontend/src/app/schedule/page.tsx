"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCreateBooking, useCmsContent } from "@/hooks/useApi";

const DEFAULT_TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "01:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:30 PM",
];

export default function SchedulePage() {
  const { data: rawTimeSlots } = useCmsContent<string[]>("bookingSlots");
  const timeSlots =
    Array.isArray(rawTimeSlots) && rawTimeSlots.length > 0
      ? rawTimeSlots
      : DEFAULT_TIME_SLOTS;
  const { data: bookingSettings } = useCmsContent<any>("bookingSettings");

  const now = new Date();
  const [viewYear, setViewYear] = useState<number>(now.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(now.getDate());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [booked, setBooked] = useState(false);

  const createBookingMutation = useCreateBooking();
  const isBooking = createBookingMutation.isPending;

  const currentViewDate = new Date(viewYear, viewMonth, 1);
  const currentMonthName = currentViewDate.toLocaleString("default", { month: "long" });
  const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Convert JS Sunday-first day (0=Sun..6=Sat) to Monday-first (0=Mon..6=Sun)
  const firstDayOfWeek = (currentViewDate.getDay() + 6) % 7;

  React.useEffect(() => {
    if (!selectedTime && timeSlots.length > 0) {
      setSelectedTime(timeSlots[0]);
    }
  }, [timeSlots, selectedTime]);

  const handlePrevMonth = () => {
    const isCurrentOrPastMonth =
      viewYear < now.getFullYear() ||
      (viewYear === now.getFullYear() && viewMonth <= now.getMonth());

    if (isCurrentOrPastMonth) return;

    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email");
      return;
    }

    createBookingMutation.mutate(
      {
        name,
        email,
        date: `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`,
        timeSlot: selectedTime,
        topic: bookingSettings?.consultationTitle || "60 Minute Strategy & AI Consultation",
        company: "Direct Booking",
      },
      {
        onSuccess: () => {
          setBooked(true);
          toast.success("Consultation booked successfully! Invitation sent to your email.");
        },
        onError: (err: any) => {
          console.error("Booking error:", err);
          toast.error(err.message || "Failed to book consultation. Please try again.");
        },
      }
    );
  };

  const isMonthPast =
    viewYear < now.getFullYear() ||
    (viewYear === now.getFullYear() && viewMonth < now.getMonth());
  const isCurrentMonth =
    viewYear === now.getFullYear() && viewMonth === now.getMonth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pt-20">
      {/* Sticky Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="w-full py-4 px-6 bg-white/70 backdrop-blur-md border-b border-gray-100 flex items-center justify-start sticky top-[80px] z-30"
      >
        <div className="max-w-[1200px] mx-auto w-full flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#78350f] transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-bold max-w-[200px] truncate" aria-current="page">
              Book Consultation
            </span>
          </div>
        </div>
      </nav>

      {/* Back to Home Button */}
      <div className="pt-6 pb-4 px-4 max-w-[1000px] mx-auto w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200 text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Booking Container */}
      <section className="pb-20 md:pb-32 px-4 flex items-center justify-center">
        <div className="relative w-full max-w-[1000px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex flex-col md:flex-row overflow-hidden min-h-[580px]">
          {/* Left Column */}
          <div className="w-full md:w-[40%] p-8 md:p-10 border-r border-gray-100 flex flex-col bg-[#faf9fe]">
            <div className="space-y-4">
              <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider">
                {bookingSettings?.companyName || "Brain Bari Technologies"}
              </h3>
              <h1 className="text-gray-900 text-3xl font-extrabold font-sans leading-tight">
                {bookingSettings?.consultationTitle || "60 Minute Consultation"}
              </h1>
              <div className="space-y-4 pt-6 text-gray-600 font-medium text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>{bookingSettings?.duration || "1 Hour Duration"}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mt-0.5 shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <span className="leading-tight">
                    {bookingSettings?.detailsNote || "Web conferencing details provided upon booking confirmation."}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 flex items-center gap-4 text-gray-400 text-xs font-semibold">
              <span>{bookingSettings?.copyrightText || `© Brain Bari ${viewYear}`}</span>
            </div>
          </div>

          {/* Right Column: Calendar & Time */}
          <div className="w-full md:w-[60%] p-8 md:p-10 bg-white flex flex-col justify-center">
            {booked ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Consultation Scheduled!</h3>
                <p className="text-gray-600 text-sm max-w-sm mx-auto">
                  We look forward to meeting with you on <strong>{currentMonthName} {selectedDay}, {viewYear}</strong> at <strong>{selectedTime}</strong>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setBooked(false)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-500/25 transition-all"
                  >
                    Book Another Call
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 font-sans">
                    Select Date &amp; Time
                  </h2>
                  <div className="border border-gray-100 rounded-xl p-4 shadow-sm bg-gray-50/30">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-900 font-bold text-sm">
                        {currentMonthName} {viewYear}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          disabled={isCurrentMonth || isMonthPast}
                          className="p-1.5 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-gray-600 transition-colors"
                          aria-label="Previous month"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                          aria-label="Next month"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                        <div key={d} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider py-1">
                          {d}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                      {/* Blank offset cells for start of month */}
                      {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                        <div key={`blank-${idx}`} className="aspect-square"></div>
                      ))}

                      {/* Real days of current view month */}
                      {Array.from({ length: totalDaysInMonth }, (_, i) => i + 1).map((day) => {
                        const isPast =
                          isMonthPast ||
                          (isCurrentMonth && day < now.getDate());
                        const isSelected = selectedDay === day;
                        return (
                          <button
                            key={day}
                            disabled={isPast}
                            onClick={() => setSelectedDay(day)}
                            className={`aspect-square rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                              isPast
                                ? "text-gray-300 cursor-not-allowed"
                                : isSelected
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105"
                                : "text-gray-800 hover:bg-gray-200 cursor-pointer"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Available Times */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Available Time Slots ({currentMonthName} {selectedDay})
                  </h4>
                  {timeSlots.length === 0 ? (
                    <div className="py-4 text-center text-xs text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
                      No consultation slots available.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            selectedTime === time
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "border-gray-200 hover:border-blue-500 text-gray-700 bg-white"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Info & Submit Form */}
                <form onSubmit={handleBooking} className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isBooking}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isBooking ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Confirming Booking...</span>
                      </>
                    ) : (
                      <span>Confirm Booking for {selectedTime}</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

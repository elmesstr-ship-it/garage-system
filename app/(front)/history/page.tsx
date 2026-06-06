"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Car,
  Clock,
  CheckCircle,
  MapPin,
  Loader2,
  CalendarDays,
  Timer,
  AlertCircle,
} from "lucide-react";
import {
  collection,
  onSnapshot,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "@/lib/firebase";

type Booking = {
  id: string;
  userId?: string;
  slot?: string;
  slotId?: string;
  slotNumber?: string;
  plateNumber?: string;
  carNumber?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  status?: string;
  date?: string;
  duration?: string;
  durationMinutes?: number;
  createdAt?: Timestamp;
  reservedAt?: Timestamp;
  arrivedAt?: Timestamp;
  updatedAt?: Timestamp;
  endTime?: Timestamp;
  completedAt?: Timestamp;
};

function toDate(value?: string | Timestamp) {
  if (!value) return null;

  if (value instanceof Timestamp) {
    return value.toDate();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getBookingDate(booking: Booking) {
  return (
    booking.completedAt ||
    booking.endTime ||
    booking.updatedAt ||
    booking.arrivedAt ||
    booking.reservedAt ||
    booking.createdAt ||
    booking.date
  );
}

function formatDate(booking: Booking) {
  const date = toDate(getBookingDate(booking));

  if (!date) return "Not available";

  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getSlot(booking: Booking) {
  return booking.slotId || booking.slotNumber || booking.slot || "Unknown";
}

function getPlate(booking: Booking) {
  return booking.plateNumber || booking.carNumber || "Not added";
}

function getVehicle(booking: Booking) {
  const vehicle = `${booking.vehicleBrand || ""} ${
    booking.vehicleModel || ""
  }`.trim();

  return vehicle || "Vehicle details not added";
}

function getDuration(booking: Booking) {
  if (booking.duration) return booking.duration;

  if (typeof booking.durationMinutes === "number") {
    if (booking.durationMinutes < 60) {
      return `${booking.durationMinutes} min`;
    }

    const hours = Math.ceil(booking.durationMinutes / 60);
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  const start = toDate(
    booking.arrivedAt || booking.reservedAt || booking.createdAt
  );
  const end = toDate(booking.completedAt || booking.endTime || booking.updatedAt);

  if (!start || !end) return "Duration not set";

  const diff = end.getTime() - start.getTime();
  const minutes = Math.ceil(diff / (1000 * 60));

  if (minutes <= 0) return "Duration not set";
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours > 1 ? "s" : ""}`;
}

function getStatusStyle(status?: string) {
  const value = status?.toLowerCase().trim();

  if (
    value === "completed" ||
    value === "checked_out" ||
    value === "paid" ||
    value === "success" ||
    value === "finished" ||
    value === "left"
  ) {
    return "border-green-500/20 bg-green-500/10 text-green-400";
  }

  if (value === "cancelled") {
    return "border-red-500/20 bg-red-500/10 text-red-400";
  }

  if (value === "reserved" || value === "pending") {
    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
  }

  return "border-blue-500/20 bg-blue-500/10 text-blue-400";
}

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReady, setUserReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubBookings: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUserReady(true);
      setLoading(true);
      setError("");

      if (unsubBookings) {
        unsubBookings();
        unsubBookings = null;
      }

      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );

      unsubBookings = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Booking[];

          data.sort((a, b) => {
            const aTime = toDate(getBookingDate(a))?.getTime() || 0;
            const bTime = toDate(getBookingDate(b))?.getTime() || 0;
            return bTime - aTime;
          });

          setBookings(data);
          setLoading(false);
        },
        (err) => {
          console.error("HISTORY ERROR:", err);
          setError("Failed to load parking history.");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubAuth();

      if (unsubBookings) {
        unsubBookings();
      }
    };
  }, []);

const stats = useMemo(() => {
  const completedStatuses = [
    "completed",
    "checked_out",
    "paid",
    "success",
    "finished",
    "left",
  ];

  const completed = bookings.filter((booking) => {
    const status = booking.status?.toLowerCase().trim();
    return completedStatuses.includes(status || "");
  }).length;

  const slotsUsed = new Set(bookings.map((booking) => getSlot(booking))).size;

  return [
    { value: bookings.length, label: "Total Bookings" },
    {
      value:
        bookings.length > 0
          ? `${Math.round((completed / bookings.length) * 100)}%`
          : "0%",
      label: "Completed",
    },
    { value: slotsUsed, label: "Slots Used" },
  ];
}, [bookings]);

  return (
    <main
      className="min-h-screen px-4 py-12 text-white sm:px-6 sm:py-16"
      style={{ background: "#060d1f" }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <section className="relative z-10 mx-auto max-w-5xl space-y-8 sm:space-y-10">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-blue-300">
              Activity Log
            </span>
          </div>

          <h1
            className="text-4xl font-black text-white sm:text-5xl md:text-6xl"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Parking{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #60a5fa, #3b82f6)",
              }}
            >
              History
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Review your reservations, used slots, parking duration, and vehicle
            details in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/[0.07] p-4 text-center backdrop-blur-md"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <p
                className="text-2xl font-black text-blue-400 sm:text-3xl"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {value}
              </p>

              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                {label}
              </p>
            </div>
          ))}
        </div>

        {loading || !userReady ? (
          <div
            className="flex items-center justify-center gap-3 rounded-2xl border border-white/[0.07] p-10 text-slate-400 backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <Loader2 size={20} className="animate-spin text-blue-400" />
            Loading history...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-10 text-center text-red-400">
            <AlertCircle size={20} />
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div
            className="rounded-2xl border border-white/[0.07] p-8 text-center backdrop-blur-md sm:p-10"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
              <CalendarDays size={24} className="text-blue-400" />
            </div>

            <h2 className="text-lg font-bold text-white">
              No parking history yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Once you make a reservation, it will appear here with the slot,
              plate number, time, and status.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <div
                key={booking.id}
                className="group flex flex-col gap-5 rounded-2xl border border-white/[0.07] p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 sm:p-6 md:flex-row md:items-center"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <div className="flex shrink-0 items-center gap-4">
                  <span className="w-5 text-right font-mono text-sm text-slate-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 transition-colors group-hover:bg-blue-500/20">
                    <Car size={22} className="text-blue-400" />
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <h2
                    className="truncate text-lg font-black text-white"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Smart Garage - Slot {getSlot(booking)}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {getVehicle(booking)}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-blue-400" />
                      {formatDate(booking)}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-blue-400" />
                      Plate · {getPlate(booking)}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Timer size={14} className="text-blue-400" />
                      {getDuration(booking)}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${getStatusStyle(
                    booking.status || "active"
                  )}`}
                >
                  <CheckCircle size={13} />
                  {booking.status || "active"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
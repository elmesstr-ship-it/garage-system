"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Car,
  CheckCircle,
  Clock,
  Loader2,
  ParkingCircle,
  Search,
  XCircle,
} from "lucide-react";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";

type Booking = {
  id: string;
  userName?: string;
  userEmail?: string;
  plateNumber?: string;
  carNumber?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  carName?: string;
  slotId?: string;
  slotNumber?: string;
  slot?: string;
  status?: string;
  startTime?: string | Timestamp;
  endTime?: string | Timestamp;
  createdAt?: Timestamp;
  reservedAt?: Timestamp;
  arrivedAt?: Timestamp;
};

function toDate(value?: string | Timestamp) {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value?: string | Timestamp) {
  const date = toDate(value);
  return date ? date.toLocaleString() : "-";
}

function getBookingTime(booking: Booking) {
  return booking.createdAt || booking.reservedAt || booking.arrivedAt || booking.startTime;
}

function getStatusStyle(status?: string) {
  const value = status?.toLowerCase();

  if (value === "active" || value === "arrived") {
    return "bg-green-500/15 text-green-300 border-green-400/20";
  }

  if (value === "completed") {
    return "bg-blue-500/15 text-blue-300 border-blue-400/20";
  }

  if (value === "cancelled") {
    return "bg-red-500/15 text-red-300 border-red-400/20";
  }

  if (value === "pending" || value === "reserved") {
    return "bg-yellow-500/15 text-yellow-300 border-yellow-400/20";
  }

  return "bg-slate-500/15 text-slate-300 border-slate-400/20";
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];

        data.sort((a, b) => {
          const aTime = toDate(getBookingTime(a))?.getTime() || 0;
          const bTime = toDate(getBookingTime(b))?.getTime() || 0;
          return bTime - aTime;
        });

        setBookings(data);
        setLoading(false);
      },
      (error) => {
        console.error("BOOKINGS ERROR:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredBookings = useMemo(() => {
    const value = search.toLowerCase().trim();
    if (!value) return bookings;

    return bookings.filter((booking) => {
      const car =
        booking.plateNumber ||
        booking.carNumber ||
        booking.carName ||
        `${booking.vehicleBrand || ""} ${booking.vehicleModel || ""}`;

      const slot = booking.slotId || booking.slotNumber || booking.slot || "";
      const user = booking.userName || "";
      const email = booking.userEmail || "";
      const status = booking.status || "";

      return (
        car.toLowerCase().includes(value) ||
        slot.toLowerCase().includes(value) ||
        user.toLowerCase().includes(value) ||
        email.toLowerCase().includes(value) ||
        status.toLowerCase().includes(value)
      );
    });
  }, [bookings, search]);

  const activeCount = bookings.filter((b) => {
    const status = b.status?.toLowerCase();
    return status === "active" || status === "arrived";
  }).length;

  const completedCount = bookings.filter(
    (b) => b.status?.toLowerCase() === "completed"
  ).length;

  const pendingCount = bookings.filter((b) => {
    const status = b.status?.toLowerCase();
    return status === "pending" || status === "reserved";
  }).length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-xl">
          <Loader2 className="mx-auto animate-spin text-blue-400" size={38} />
          <h2 className="mt-4 text-xl font-bold text-white">
            Loading Bookings
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Reading bookings from Firestore
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Admin Bookings
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Bookings Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage and monitor all garage bookings from Firestore.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={19}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/40 focus:bg-white/[0.08]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<ParkingCircle className="text-blue-400" size={30} />} title="Total Bookings" value={bookings.length} />
        <StatCard icon={<CheckCircle className="text-green-400" size={30} />} title="Active" value={activeCount} />
        <StatCard icon={<CalendarClock className="text-yellow-400" size={30} />} title="Pending / Reserved" value={pendingCount} />
        <StatCard icon={<XCircle className="text-purple-400" size={30} />} title="Completed" value={completedCount} />
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.04] p-12 text-center">
          <CalendarClock className="mx-auto text-slate-500" size={48} />
          <h2 className="mt-4 text-xl font-bold text-white">
            No bookings found
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            No matching bookings are available in bookings collection.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-xl lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/10 text-slate-300">
                  <tr>
                    <th className="p-4 text-left">Booking ID</th>
                    <th className="p-4 text-left">Vehicle</th>
                    <th className="p-4 text-left">Plate</th>
                    <th className="p-4 text-left">Slot</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">User</th>
                    <th className="p-4 text-left">Start</th>
                    <th className="p-4 text-left">End</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((b) => {
                    const vehicle =
                      b.carName ||
                      `${b.vehicleBrand || ""} ${b.vehicleModel || ""}`.trim() ||
                      "Unknown";

                    const plate = b.plateNumber || b.carNumber || "-";
                    const slot = b.slotId || b.slotNumber || b.slot || "Unknown";
                    const userName = b.userName || "Unknown";
                    const userEmail = b.userEmail || "-";

                    return (
                      <tr
                        key={b.id}
                        className="border-t border-white/10 transition hover:bg-white/10"
                      >
                        <td className="p-4 font-medium text-slate-300">
                          {b.id.slice(0, 8)}...
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2 font-semibold text-white">
                            <Car size={18} className="text-blue-400" />
                            {vehicle}
                          </div>
                        </td>

                        <td className="p-4 text-slate-300">{plate}</td>
                        <td className="p-4 text-slate-300">{slot}</td>

                        <td className="p-4">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                              b.status
                            )}`}
                          >
                            {b.status || "unknown"}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-white">
                              {userName}
                            </span>
                            <span className="text-xs text-slate-500">
                              {userEmail}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-slate-400">
                          {formatDate(getBookingTime(b))}
                        </td>

                        <td className="p-4 text-slate-400">
                          {formatDate(b.endTime)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 lg:hidden">
            {filteredBookings.map((b) => {
              const vehicle =
                b.carName ||
                `${b.vehicleBrand || ""} ${b.vehicleModel || ""}`.trim() ||
                "Unknown";

              const plate = b.plateNumber || b.carNumber || "-";
              const slot = b.slotId || b.slotNumber || b.slot || "Unknown";

              return (
                <div
                  key={b.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500">Booking ID</p>
                      <h3 className="mt-1 font-bold text-white">
                        {b.id.slice(0, 10)}...
                      </h3>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                        b.status
                      )}`}
                    >
                      {b.status || "unknown"}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Info label="Vehicle" value={vehicle} />
                    <Info label="Plate" value={plate} />
                    <Info label="Slot" value={slot} />
                    <Info label="User" value={b.userName || "Unknown"} />
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-400">
                    <p className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-400" />
                      Start: {formatDate(getBookingTime(b))}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={16} className="text-yellow-400" />
                      End: {formatDate(b.endTime)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl">
      {icon}
      <p className="mt-4 text-sm text-slate-400">{title}</p>
      <h2 className="mt-1 text-3xl font-extrabold text-white">{value}</h2>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}
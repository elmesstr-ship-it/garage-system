"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Car,
  ParkingCircle,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Plus,
} from "lucide-react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type SlotStatus = "available" | "occupied" | "reserved";

type ParkingSlot = {
  id: string;
  slotId?: string;
  slotNumber?: string;
  name?: string;
  status?: SlotStatus | string;
  car?: string | null;
  vehicle?: string | null;
  plateNumber?: string | null;
  floor?: string;
};

type Booking = {
  id: string;
  slotId?: string;
  slot?: string;
  slotNumber?: string;
  userName?: string;
  name?: string;
  carName?: string;
  plateNumber?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  status?: string;
  createdAt?: Timestamp;
  reservedAt?: Timestamp;
  arrivedAt?: Timestamp;
};

type UserData = {
  id: string;
  role?: string;
};

function getBookingDate(booking: Booking) {
  return booking.createdAt || booking.reservedAt || booking.arrivedAt;
}

export default function DashboardPage() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubSlots = onSnapshot(
      collection(db, "parkingSlots"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ParkingSlot[];

        setSlots(data);
        setLoading(false);
      },
      (error) => {
        console.error("PARKING SLOTS ERROR:", error);
        setLoading(false);
      }
    );

    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserData[];

        setUsers(data);
      },
      (error) => {
        console.error("USERS ERROR:", error);
      }
    );

    const bookingsQuery = query(
      collection(db, "bookings"),
      orderBy("createdAt", "desc")
    );

    const unsubBookings = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];

        setBookings(data);
      },
      (error) => {
        console.error("BOOKINGS ERROR:", error);
      }
    );

    return () => {
      unsubSlots();
      unsubUsers();
      unsubBookings();
    };
  }, []);

  const totalSlots = slots.length;

  const availableSlots = slots.filter(
    (slot) => slot.status?.toLowerCase() === "available"
  ).length;

  const occupiedSlots = slots.filter(
    (slot) => slot.status?.toLowerCase() === "occupied"
  ).length;

  const reservedSlots = slots.filter(
    (slot) => slot.status?.toLowerCase() === "reserved"
  ).length;

  const occupancyRate = useMemo(() => {
    if (totalSlots === 0) return 0;
    return Math.round(((occupiedSlots + reservedSlots) / totalSlots) * 100);
  }, [totalSlots, occupiedSlots, reservedSlots]);

  const stats = [
    {
      title: "Total Slots",
      value: totalSlots,
      icon: ParkingCircle,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Available",
      value: availableSlots,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Occupied",
      value: occupiedSlots,
      icon: Car,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Users",
      value: users.length,
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center">
          <Loader2 className="mx-auto animate-spin text-blue-400" size={38} />
          <h2 className="mt-4 text-xl font-bold text-white">
            Loading Dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Reading garage data from Firestore
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
            Admin Overview
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Smart Garage Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            Monitor parking slots, users, bookings, and garage performance live.
          </p>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 lg:w-auto">
          <Plus size={20} />
          Add Parking Slot
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}
              >
                <Icon className={item.color} size={30} />
              </div>

              <p className="mt-5 text-sm text-slate-400">{item.title}</p>
              <h2 className="mt-1 text-4xl font-extrabold text-white">
                {item.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl backdrop-blur-xl sm:p-7 xl:col-span-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Parking Spots</h2>
              <p className="text-sm text-slate-400">
                Live status from parkingSlots collection
              </p>
            </div>

            <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              {totalSlots} Slots
            </span>
          </div>

          {slots.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-white/10 p-10 text-center">
              <ParkingCircle className="mx-auto text-slate-500" size={42} />
              <h3 className="mt-4 text-xl font-bold text-white">
                No parking slots found
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Add slots inside Firestore collection named parkingSlots.
              </p>
            </div>
          ) : (
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {slots.map((slot) => {
                const slotName =
                  slot.slotId || slot.slotNumber || slot.name || slot.id;

                const status = slot.status || "available";
                const normalizedStatus = status.toLowerCase();

                const occupied = normalizedStatus === "occupied";
                const reserved = normalizedStatus === "reserved";

                return (
                  <div
                    key={slot.id}
                    className={`rounded-3xl border p-5 transition hover:-translate-y-1 ${
                      occupied
                        ? "border-yellow-400/30 bg-yellow-500/15 text-yellow-300"
                        : reserved
                        ? "border-blue-400/30 bg-blue-500/15 text-blue-300"
                        : "border-green-400/30 bg-green-500/15 text-green-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-4xl font-extrabold">{slotName}</h3>
                      <Car size={34} />
                    </div>

                    <p className="mt-6 text-lg font-bold capitalize">
                      {status}
                    </p>

                    <p className="mt-2 text-sm opacity-80">
                      {occupied || reserved
                        ? `Vehicle: ${
                            slot.plateNumber ||
                            slot.car ||
                            slot.vehicle ||
                            "Unknown"
                          }`
                        : "Ready for booking"}
                    </p>

                    {slot.floor && (
                      <p className="mt-3 text-xs opacity-70">
                        Floor: {slot.floor}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl backdrop-blur-xl sm:p-7">
          <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
          <p className="mt-1 text-sm text-slate-400">Latest bookings</p>

          <div className="mt-6 space-y-3">
            {bookings.length === 0 ? (
              <div className="rounded-2xl bg-white/10 p-4 text-sm text-slate-400">
                No bookings yet.
              </div>
            ) : (
              bookings.slice(0, 5).map((booking) => {
                const slot =
                  booking.slotId || booking.slot || booking.slotNumber || "Unknown";

                const user = booking.userName || booking.name || "User";

                const vehicle =
                  booking.plateNumber ||
                  `${booking.vehicleBrand || ""} ${
                    booking.vehicleModel || ""
                  }`.trim();

                return (
                  <div
                    key={booking.id}
                    className="flex items-start gap-3 rounded-2xl bg-white/10 p-4"
                  >
                    <div className="mt-1 rounded-xl bg-blue-500/10 p-2">
                      <Clock className="text-blue-400" size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Slot {slot} booked
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {user}
                        {vehicle ? ` - ${vehicle}` : ""}
                      </p>
                      <p className="mt-1 text-xs capitalize text-slate-500">
                        {booking.status || "active"}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
            <TrendingUp className="text-blue-400" size={32} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white">
            Occupancy Rate
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Current garage occupancy is {occupancyRate}% because{" "}
            {occupiedSlots + reservedSlots} out of {totalSlots} slots are not
            available.
          </p>

          <div className="mt-7 h-4 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10">
            <AlertTriangle className="text-yellow-400" size={32} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white">Alerts</h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {totalSlots === 0
              ? "No slots found in database. Please add parking slots to Firestore."
              : availableSlots === 0
              ? "Garage is currently full. No available parking slots."
              : "No critical alerts. Garage slots are monitored successfully."}
          </p>
        </div>
      </div>
    </section>
  );
}
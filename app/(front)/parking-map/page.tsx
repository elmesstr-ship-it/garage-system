"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Car,
  MapPin,
  Loader2,
  CircleCheck,
  CircleX,
  Clock,
  Activity,
  Navigation,
  Sparkles,
} from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type SlotStatus = "available" | "occupied" | "reserved";

type ParkingSlot = {
  id: string;
  status: SlotStatus;
  floor?: string;
  section?: string;
};

function getStatusClass(status: SlotStatus) {
  if (status === "available") {
    return {
      card: "border-green-500/40 bg-green-500/10 text-green-400 shadow-green-500/10",
      icon: CircleCheck,
      label: "Available",
    };
  }

  if (status === "occupied") {
    return {
      card: "border-red-500/40 bg-red-500/10 text-red-400 shadow-red-500/10",
      icon: CircleX,
      label: "Occupied",
    };
  }

  return {
    card: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400 shadow-yellow-500/10",
    icon: Clock,
    label: "Reserved",
  };
}

export default function ParkingMapPage() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "parkingSlots"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const slot = doc.data();

          return {
            id: doc.id,
            status: slot.status || "available",
            floor: slot.floor || "Ground Floor",
            section: slot.section || "A",
          } as ParkingSlot;
        });

        data.sort((a, b) => a.id.localeCompare(b.id));

        setSlots(data);
        setLoading(false);
      },
      (error) => {
        console.error("PARKING MAP ERROR:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    const available = slots.filter((slot) => slot.status === "available").length;
    const occupied = slots.filter((slot) => slot.status === "occupied").length;
    const reserved = slots.filter((slot) => slot.status === "reserved").length;

    return {
      total: slots.length,
      available,
      occupied,
      reserved,
    };
  }, [slots]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060d1f] px-6 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <section className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-300">
            <Sparkles size={16} />
            Real-Time Garage Map
          </div>

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-blue-500/30 bg-blue-600/20 text-blue-300 shadow-2xl shadow-blue-600/20">
            <MapPin size={40} />
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Live Parking Map
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            Check available, occupied and reserved parking slots in real time
            before making your booking.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">Total Slots</p>
            <h2 className="mt-2 text-3xl font-black">{stats.total}</h2>
          </div>

          <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-5 text-green-400">
            <p className="text-sm">Available</p>
            <h2 className="mt-2 text-3xl font-black">{stats.available}</h2>
          </div>

          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
            <p className="text-sm">Occupied</p>
            <h2 className="mt-2 text-3xl font-black">{stats.occupied}</h2>
          </div>

          <div className="rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-yellow-400">
            <p className="text-sm">Reserved</p>
            <h2 className="mt-2 text-3xl font-black">{stats.reserved}</h2>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
          <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-blue-500/30 bg-blue-500/10 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <Navigation size={24} />
              </div>

              <div>
                <h2 className="font-black text-blue-100">Garage Entrance</h2>
                <p className="text-sm text-slate-400">
                  Choose an available slot from the live map.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-bold text-green-400">
              <Activity size={16} />
              Live Updating
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-slate-400">
              <Loader2 className="mb-4 animate-spin text-blue-400" size={36} />
              Loading parking slots...
            </div>
          ) : slots.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/20 text-center">
              <Car size={42} className="mb-4 text-slate-500" />
              <h3 className="text-xl font-bold">No parking slots found</h3>
              <p className="mt-2 max-w-md text-slate-400">
                Add slots inside the parkingSlots collection in Firestore to
                display them here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {slots.map((slot) => {
                const status = getStatusClass(slot.status);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={slot.id}
                    className={`group relative flex min-h-40 flex-col justify-between rounded-3xl border p-5 shadow-xl transition duration-300 hover:-translate-y-1 ${status.card}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                          Slot
                        </p>
                        <h3 className="mt-1 text-3xl font-black">{slot.id}</h3>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/20">
                        <Car size={26} />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs opacity-70">
                          {slot.floor || "Ground Floor"}
                        </p>
                        <p className="text-xs opacity-70">
                          Section {slot.section || "A"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-full bg-black/20 px-3 py-2 text-xs font-bold">
                        <StatusIcon size={14} />
                        {status.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Car,
  Search,
  Plus,
  CircleCheck,
  Clock,
  Loader2,
  ParkingCircle,
  UserCircle2,
} from "lucide-react";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";

type VehicleBooking = {
  id: string;
  plateNumber?: string;
  carNumber?: string;
  userName?: string;
  ownerName?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  carName?: string;
  slotId?: string;
  slotNumber?: string;
  slot?: string;
  status?: string;
  createdAt?: Timestamp;
  reservedAt?: Timestamp;
  arrivedAt?: Timestamp;
};

function statusStyle(status?: string) {
  const value = status?.toLowerCase();

  if (
    value === "parked" ||
    value === "active" ||
    value === "occupied" ||
    value === "arrived" ||
    value === "reserved"
  ) {
    return "bg-green-500/15 text-green-300 border-green-400/20";
  }

  if (value === "left" || value === "completed") {
    return "bg-yellow-500/15 text-yellow-300 border-yellow-400/20";
  }

  if (value === "cancelled") {
    return "bg-red-500/15 text-red-300 border-red-400/20";
  }

  return "bg-blue-500/15 text-blue-300 border-blue-400/20";
}

function StatusIcon({ status }: { status?: string }) {
  const value = status?.toLowerCase();

  if (
    value === "parked" ||
    value === "active" ||
    value === "occupied" ||
    value === "arrived" ||
    value === "reserved"
  ) {
    return <CircleCheck size={16} />;
  }

  return <Clock size={16} />;
}

function getDateValue(vehicle: VehicleBooking) {
  return (
    vehicle.arrivedAt?.toMillis?.() ||
    vehicle.reservedAt?.toMillis?.() ||
    vehicle.createdAt?.toMillis?.() ||
    0
  );
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as VehicleBooking[];

        data.sort((a, b) => getDateValue(b) - getDateValue(a));

        setVehicles(data);
        setLoading(false);
      },
      (error) => {
        console.error("VEHICLES FROM BOOKINGS ERROR:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredVehicles = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return vehicles;

    return vehicles.filter((vehicle) => {
      const plate = vehicle.plateNumber || vehicle.carNumber || "";
      const owner = vehicle.userName || vehicle.ownerName || "";
      const model =
        vehicle.carName ||
        `${vehicle.vehicleBrand || ""} ${vehicle.vehicleModel || ""}`;
      const slot = vehicle.slotId || vehicle.slotNumber || vehicle.slot || "";
      const status = vehicle.status || "";

      return (
        plate.toLowerCase().includes(value) ||
        owner.toLowerCase().includes(value) ||
        model.toLowerCase().includes(value) ||
        slot.toLowerCase().includes(value) ||
        status.toLowerCase().includes(value)
      );
    });
  }, [vehicles, search]);

  const parkedCount = vehicles.filter((vehicle) => {
    const status = vehicle.status?.toLowerCase();

    return (
      status === "parked" ||
      status === "active" ||
      status === "occupied" ||
      status === "arrived" ||
      status === "reserved"
    );
  }).length;

  const leftCount = vehicles.filter((vehicle) => {
    const status = vehicle.status?.toLowerCase();
    return status === "left" || status === "completed";
  }).length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-xl">
          <Loader2 className="mx-auto animate-spin text-blue-400" size={38} />

          <h2 className="mt-4 text-xl font-bold text-white">
            Loading Vehicles
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Reading vehicles from bookings collection
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
            Admin Vehicles
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Vehicles
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            Manage vehicles using the Smart Garage from bookings collection.
          </p>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 lg:w-auto">
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={<Car className="text-blue-400" size={32} />}
          title="Total Vehicles"
          value={vehicles.length}
          bg="bg-blue-500/10"
        />

        <StatCard
          icon={<ParkingCircle className="text-green-400" size={32} />}
          title="Currently Parked"
          value={parkedCount}
          bg="bg-green-500/10"
        />

        <StatCard
          icon={<Clock className="text-yellow-400" size={32} />}
          title="Left / Completed"
          value={leftCount}
          bg="bg-yellow-500/10"
        />
      </div>

      <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-xl backdrop-blur-xl">
        <Search className="text-slate-400" size={22} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by plate, owner, vehicle model, slot, or status..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.04] p-12 text-center">
          <Car className="mx-auto text-slate-500" size={48} />

          <h2 className="mt-4 text-xl font-bold text-white">
            No vehicles found
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            No matching vehicles are available in bookings collection.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-xl backdrop-blur-xl xl:block">
            <table className="w-full table-fixed text-sm">
              <thead className="bg-white/10 text-slate-400">
                <tr>
                  <th className="w-[24%] px-6 py-4 text-left font-semibold">
                    Plate Number
                  </th>
                  <th className="w-[24%] px-6 py-4 text-left font-semibold">
                    Owner
                  </th>
                  <th className="w-[24%] px-6 py-4 text-left font-semibold">
                    Vehicle
                  </th>
                  <th className="w-[12%] px-6 py-4 text-left font-semibold">
                    Slot
                  </th>
                  <th className="w-[16%] px-6 py-4 text-left font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filteredVehicles.map((vehicle) => {
                  const plate =
                    vehicle.plateNumber || vehicle.carNumber || "Unknown";

                  const owner =
                    vehicle.userName || vehicle.ownerName || "Unknown";

                  const model =
                    vehicle.carName ||
                    `${vehicle.vehicleBrand || ""} ${
                      vehicle.vehicleModel || ""
                    }`.trim() ||
                    "Unknown";

                  const slot =
                    vehicle.slotId || vehicle.slotNumber || vehicle.slot || "—";

                  const status = vehicle.status || "active";

                  return (
                    <tr key={vehicle.id} className="transition hover:bg-white/10">
                      <td className="px-6 py-5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20">
                            <Car className="text-blue-400" size={22} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-bold text-white">
                              {plate}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {vehicle.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex min-w-0 items-center gap-2 text-slate-300">
                          <UserCircle2
                            size={16}
                            className="shrink-0 text-blue-400"
                          />
                          <span className="truncate">{owner}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="block truncate text-slate-300">
                          {model}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-semibold text-slate-300">
                          {slot}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                            status
                          )}`}
                        >
                          <StatusIcon status={status} />
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 xl:hidden">
            {filteredVehicles.map((vehicle) => {
              const plate = vehicle.plateNumber || vehicle.carNumber || "Unknown";
              const owner = vehicle.userName || vehicle.ownerName || "Unknown";
              const model =
                vehicle.carName ||
                `${vehicle.vehicleBrand || ""} ${
                  vehicle.vehicleModel || ""
                }`.trim() ||
                "Unknown";
              const slot = vehicle.slotId || vehicle.slotNumber || vehicle.slot || "—";
              const status = vehicle.status || "active";

              return (
                <div
                  key={vehicle.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-2xl bg-blue-500/20 p-3">
                        <Car className="text-blue-400" size={24} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-white">
                          {plate}
                        </h3>
                        <p className="truncate text-xs text-slate-500">
                          {model}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                        status
                      )}`}
                    >
                      <StatusIcon status={status} />
                      {status}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Info label="Owner" value={owner} />
                    <Info label="Slot" value={slot} />
                    <Info label="Vehicle" value={model} />
                    <Info label="Plate" value={plate} />
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
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  bg: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${bg}`}>
        {icon}
      </div>

      <p className="mt-5 text-sm text-slate-400">{title}</p>

      <h2 className="mt-2 text-4xl font-extrabold text-white">{value}</h2>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 truncate font-semibold text-white">{value}</p>
    </div>
  );
}
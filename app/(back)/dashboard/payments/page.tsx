"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  CircleCheck,
  Clock3,
  XCircle,
  Wallet,
  Loader2,
  Search,
  Banknote,
} from "lucide-react";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const HOURLY_RATE = 20;

type Booking = {
  id: string;
  userName?: string;
  userEmail?: string;
  plateNumber?: string;
  carNumber?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  slotId?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  amount?: number | string;
  createdAt?: Timestamp;
  reservedAt?: Timestamp;
  arrivedAt?: Timestamp;
  endTime?: Timestamp;
  completedAt?: Timestamp;
};

function toDate(value?: Timestamp) {
  return value?.toDate ? value.toDate() : null;
}

function getStartDate(b: Booking) {
  return toDate(b.arrivedAt) || toDate(b.reservedAt) || toDate(b.createdAt);
}

function getEndDate(b: Booking) {
  return toDate(b.completedAt) || toDate(b.endTime) || new Date();
}

function getHours(b: Booking) {
  const start = getStartDate(b);
  const end = getEndDate(b);

  if (!start || !end) return 1;

  const diff = end.getTime() - start.getTime();
  const hours = Math.ceil(diff / (1000 * 60 * 60));

  return hours > 0 ? hours : 1;
}

function getAmount(b: Booking) {
  if (b.amount !== undefined && b.amount !== null) {
    const value =
      typeof b.amount === "number"
        ? b.amount
        : Number(String(b.amount).replace("EGP", "").replace("جنيه", ""));

    return Number.isNaN(value) ? 0 : value;
  }

  return getHours(b) * HOURLY_RATE;
}

function formatMoney(value: number) {
  return `${value.toFixed(0)} EGP`;
}

function formatDate(value?: Timestamp) {
  const date = toDate(value);
  return date ? date.toLocaleString() : "-";
}

function getPaymentStatus(b: Booking) {
  return b.paymentStatus || (b.status === "completed" ? "paid" : "pending");
}

function statusStyle(status?: string) {
  const value = status?.toLowerCase();

  if (value === "paid" || value === "success" || value === "completed") {
    return "bg-green-500/15 text-green-300 border-green-400/20";
  }

  if (value === "pending") {
    return "bg-yellow-500/15 text-yellow-300 border-yellow-400/20";
  }

  return "bg-red-500/15 text-red-300 border-red-400/20";
}

function StatusIcon({ status }: { status?: string }) {
  const value = status?.toLowerCase();

  if (value === "paid" || value === "success" || value === "completed") {
    return <CircleCheck size={16} />;
  }

  if (value === "pending") {
    return <Clock3 size={16} />;
  }

  return <XCircle size={16} />;
}

export default function PaymentsPage() {
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
          const aTime = getStartDate(a)?.getTime() || 0;
          const bTime = getStartDate(b)?.getTime() || 0;
          return bTime - aTime;
        });

        setBookings(data);
        setLoading(false);
      },
      (error) => {
        console.error("PAYMENTS BOOKINGS ERROR:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredBookings = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return bookings;

    return bookings.filter((b) => {
      const vehicle = `${b.vehicleBrand || ""} ${b.vehicleModel || ""}`;
      const status = getPaymentStatus(b);

      return (
        b.id.toLowerCase().includes(value) ||
        (b.userName || "").toLowerCase().includes(value) ||
        (b.userEmail || "").toLowerCase().includes(value) ||
        (b.plateNumber || b.carNumber || "").toLowerCase().includes(value) ||
        vehicle.toLowerCase().includes(value) ||
        status.toLowerCase().includes(value)
      );
    });
  }, [bookings, search]);

  const paidBookings = bookings.filter(
    (b) => getPaymentStatus(b).toLowerCase() === "paid"
  );

  const pendingBookings = bookings.filter(
    (b) => getPaymentStatus(b).toLowerCase() === "pending"
  );

  const totalRevenue = paidBookings.reduce(
    (total, booking) => total + getAmount(booking),
    0
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-xl">
          <Loader2 className="mx-auto animate-spin text-blue-400" size={38} />
          <h2 className="mt-4 text-xl font-bold text-white">
            Loading Payments
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Reading payment data from bookings
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
            Admin Payments
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Payments
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            Payments are calculated from bookings. Current price is{" "}
            {HOURLY_RATE} EGP per hour.
          </p>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 lg:w-auto">
          <Wallet size={20} />
          New Payment
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl">
          <Banknote className="text-green-400" size={36} />
          <p className="mt-5 text-sm text-slate-400">Total Revenue</p>
          <h2 className="mt-2 text-4xl font-extrabold text-white">
            {formatMoney(totalRevenue)}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl">
          <CircleCheck className="text-blue-400" size={36} />
          <p className="mt-5 text-sm text-slate-400">Paid Payments</p>
          <h2 className="mt-2 text-4xl font-extrabold text-white">
            {paidBookings.length}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl">
          <Clock3 className="text-yellow-400" size={36} />
          <p className="mt-5 text-sm text-slate-400">Pending Payments</p>
          <h2 className="mt-2 text-4xl font-extrabold text-white">
            {pendingBookings.length}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-xl backdrop-blur-xl">
        <Search className="text-slate-400" size={22} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by booking ID, user, plate, vehicle, or status..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>

      {filteredBookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.04] p-12 text-center">
          <Wallet className="mx-auto text-slate-500" size={48} />
          <h2 className="mt-4 text-xl font-bold text-white">
            No payments found
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            No matching booking payments found.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-xl backdrop-blur-xl xl:block">
            <div className="grid grid-cols-8 border-b border-white/10 bg-white/10 px-6 py-4 text-sm font-semibold text-slate-400">
              <span>Booking ID</span>
              <span>User</span>
              <span>Plate</span>
              <span>Hours</span>
              <span>Amount</span>
              <span>Method</span>
              <span>Date</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-white/10">
              {filteredBookings.map((booking) => {
                const status = getPaymentStatus(booking);

                return (
                  <div
                    key={booking.id}
                    className="grid grid-cols-8 items-center px-6 py-5 transition hover:bg-white/10"
                  >
                    <span className="font-bold text-blue-300">
                      {booking.id.slice(0, 12)}...
                    </span>

                    <span className="text-slate-300">
                      {booking.userName || "Unknown"}
                    </span>

                    <span className="text-slate-300">
                      {booking.plateNumber || booking.carNumber || "-"}
                    </span>

                    <span className="text-slate-300">
                      {getHours(booking)}h
                    </span>

                    <span className="font-semibold text-green-400">
                      {formatMoney(getAmount(booking))}
                    </span>

                    <span className="flex items-center gap-2 text-slate-300">
                      <CreditCard size={16} className="text-blue-400" />
                      {booking.paymentMethod || "Cash"}
                    </span>

                    <span className="text-slate-300">
                      {formatDate(
                        booking.completedAt ||
                          booking.endTime ||
                          booking.createdAt ||
                          booking.reservedAt
                      )}
                    </span>

                    <span
                      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold capitalize ${statusStyle(
                        status
                      )}`}
                    >
                      <StatusIcon status={status} />
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 xl:hidden">
            {filteredBookings.map((booking) => {
              const status = getPaymentStatus(booking);

              return (
                <div
                  key={booking.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500">Booking ID</p>
                      <h3 className="mt-1 font-bold text-blue-300">
                        {booking.id.slice(0, 14)}...
                      </h3>
                    </div>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                        status
                      )}`}
                    >
                      <StatusIcon status={status} />
                      {status}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Info label="User" value={booking.userName || "Unknown"} />
                    <Info
                      label="Plate"
                      value={booking.plateNumber || booking.carNumber || "-"}
                    />
                    <Info label="Duration" value={`${getHours(booking)} hour`} />
                    <Info
                      label="Amount"
                      value={formatMoney(getAmount(booking))}
                      green
                    />
                  </div>

                  <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                    <CreditCard size={15} className="text-blue-400" />
                    {booking.paymentMethod || "Cash"}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

function Info({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={`mt-1 font-semibold ${
          green ? "text-green-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
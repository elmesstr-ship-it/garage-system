"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Car,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  Printer,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Booking = {
  userEmail?: string;
  slotId: string;
  plateNumber: string;
  status: string;
  reservedAt?: Timestamp | null;
  arrivedAt?: Timestamp | null;
  checkedOutAt?: Timestamp | null;
  pricePerHour?: number;
  durationMinutes?: number;
  totalPrice?: number;
};

function formatDate(value?: Timestamp | null) {
  if (!value) return "—";

  return value.toDate().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDuration(minutes = 0) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} min`;
  return `${hours}h ${mins}m`;
}

function InvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const invoiceNumber = useMemo(() => {
    if (!bookingId) return "—";
    return `INV-${bookingId.slice(0, 8).toUpperCase()}`;
  }, [bookingId]);

  const pricePerHour = booking?.pricePerHour ?? 20;
  const durationMinutes = booking?.durationMinutes ?? 0;
  const totalPrice = booking?.totalPrice ?? 0;

  useEffect(() => {
    async function fetchInvoice() {
      if (!bookingId) {
        router.push("/parking-status");
        return;
      }

      try {
        const bookingRef = doc(db, "bookings", bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (!bookingSnap.exists()) {
          router.push("/parking-status");
          return;
        }

        setBooking(bookingSnap.data() as Booking);
      } catch (error) {
        console.error("INVOICE ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [bookingId, router]);

  if (loading) {
    return <InvoiceLoading />;
  }

  if (!booking) return null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060d1f] px-4 py-10 text-white sm:px-6 md:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => router.push("/parking-status")}
          className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white print:hidden"
        >
          <ArrowLeft size={16} />
          Back to parking slots
        </button>

        <div className="mb-8 text-center print:hidden">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-300">
            <Sparkles size={16} />
            Smart Garage Invoice
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Parking Receipt
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            A detailed invoice for your completed parking session, including
            duration, slot details and total payment.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_370px]">
          <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl print:border-slate-300 print:bg-white print:text-slate-900 sm:p-8">
            <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 print:border-slate-200 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 print:border-green-600 print:bg-green-50">
                  <ShieldCheck size={14} className="text-green-400 print:text-green-700" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-green-300 print:text-green-700">
                    Checked Out
                  </span>
                </div>

                <h2 className="text-4xl font-black sm:text-5xl">
                  Parking{" "}
                  <span className="bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent print:text-blue-700">
                    Invoice
                  </span>
                </h2>

                <p className="mt-3 text-sm text-slate-400 print:text-slate-600">
                  Invoice Number:{" "}
                  <span className="font-semibold text-white print:text-slate-900">
                    {invoiceNumber}
                  </span>
                </p>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400 print:border-blue-200 print:bg-blue-50 print:text-blue-700">
                <ReceiptText size={30} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<Car size={20} />}
                label="Slot Number"
                value={booking.slotId || "—"}
              />

              <InfoCard
                icon={<FileText size={20} />}
                label="Plate Number"
                value={booking.plateNumber || "—"}
              />

              <InfoCard
                icon={<Clock size={20} />}
                label="Parking Duration"
                value={formatDuration(durationMinutes)}
              />

              <InfoCard
                icon={<CreditCard size={20} />}
                label="Price Per Hour"
                value={`${pricePerHour} EGP`}
              />
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5 print:border-slate-200 print:bg-slate-50">
              <h2 className="mb-4 text-lg font-black">Timeline</h2>

              <div className="space-y-4">
                <TimelineItem
                  title="Reserved At"
                  value={formatDate(booking.reservedAt)}
                />
                <TimelineItem
                  title="Arrived At"
                  value={formatDate(booking.arrivedAt)}
                />
                <TimelineItem
                  title="Checked Out At"
                  value={formatDate(booking.checkedOutAt)}
                />
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-blue-500/20 bg-blue-500/10 p-6 shadow-2xl backdrop-blur-xl print:border-slate-300 print:bg-white print:text-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300 print:bg-blue-50 print:text-blue-700">
                <CreditCard size={24} />
              </div>

              <div>
                <p className="text-sm text-blue-200/70 print:text-slate-600">
                  Total Amount
                </p>
                <h2 className="text-4xl font-black text-white print:text-slate-900">
                  {totalPrice} EGP
                </h2>
              </div>
            </div>

            <div className="my-6 border-t border-blue-300/20 print:border-slate-200" />

            <div className="space-y-3 text-sm">
              <Row label="Status" value={booking.status?.replace("_", " ") || "—"} />
              <Row label="Customer" value={booking.userEmail || "—"} />
              <Row label="Duration" value={formatDuration(durationMinutes)} />
              <Row label="Rate" value={`${pricePerHour} EGP / hour`} />
            </div>

            <div className="mt-6 rounded-3xl border border-green-500/20 bg-green-500/10 p-4 print:border-green-200 print:bg-green-50">
              <div className="flex items-center gap-2 text-green-300 print:text-green-700">
                <BadgeCheck size={18} />
                <p className="text-sm font-bold">Payment Summary</p>
              </div>
              <p className="mt-2 text-xs leading-6 text-slate-400 print:text-slate-600">
                This invoice is generated automatically after checkout from the
                Smart Garage system.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-black text-[#060d1f] transition hover:bg-blue-50 print:hidden"
            >
              <Printer size={18} />
              Print Invoice
            </button>

            <button
              type="button"
              onClick={() => router.push("/parking-status")}
              className="mt-3 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-white transition hover:bg-white/10 print:hidden"
            >
              New Booking
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<InvoiceLoading />}>
      <InvoiceContent />
    </Suspense>
  );
}

function InvoiceLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#060d1f] text-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-9 w-9 animate-spin text-blue-400" />
        <p className="text-sm text-slate-400">Loading invoice...</p>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 print:border-slate-200 print:bg-slate-50">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 print:bg-blue-50 print:text-blue-700">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-white print:text-slate-900">
        {value}
      </p>
    </div>
  );
}

function TimelineItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.03] px-4 py-3 print:bg-white">
      <p className="text-sm text-slate-400 print:text-slate-600">{title}</p>
      <p className="text-right text-sm font-semibold text-white print:text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-blue-100/60 print:text-slate-600">{label}</span>
      <span className="max-w-[190px] truncate text-right font-semibold capitalize text-white print:text-slate-900">
        {value}
      </span>
    </div>
  );
}
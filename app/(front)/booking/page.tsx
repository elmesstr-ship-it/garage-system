"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarCheck,
  Car,
  Clock,
  CreditCard,
  Loader2,
  ShieldCheck,
  Timer,
} from "lucide-react";
import {
  collection,
  doc,
  getDoc,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

const RESERVATION_MINUTES = 15;
const PRICE_PER_HOUR = 20;

type SlotStatus = "available" | "reserved" | "occupied";

type Slot = {
  id: string;
  status: SlotStatus;
  floor?: string;
  slotNumber?: number;
};

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slotId = searchParams.get("slotId");

  const [user, setUser] = useState<User | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [plateNumber, setPlateNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const canBook = useMemo(() => {
    return Boolean(
      user && slotId && slot?.status === "available" && plateNumber.trim()
    );
  }, [user, slotId, slot?.status, plateNumber]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);

      if (!slotId) {
        router.push("/parking-status");
        return;
      }

      try {
        const slotRef = doc(db, "parkingSlots", slotId);
        const slotSnap = await getDoc(slotRef);

        if (!slotSnap.exists()) {
          router.push("/parking-status");
          return;
        }

        setSlot({
          id: slotSnap.id,
          ...slotSnap.data(),
        } as Slot);
      } catch (error) {
        console.error("BOOKING PAGE ERROR:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router, slotId]);

  async function handleBooking() {
    if (!user || !slotId || !slot) return;

    if (slot.status !== "available") {
      alert("This slot is not available");
      return;
    }

    if (!plateNumber.trim()) {
      alert("Please enter your plate number");
      return;
    }

    try {
      setBooking(true);

      const slotRef = doc(db, "parkingSlots", slotId);
      const bookingRef = doc(collection(db, "bookings"));
      const activeBookingRef = doc(db, "activeBookings", user.uid);

      const now = Timestamp.now();
      const expiresAt = Timestamp.fromDate(
        new Date(now.toDate().getTime() + RESERVATION_MINUTES * 60 * 1000)
      );

      await runTransaction(db, async (transaction) => {
        const freshSlotSnap = await transaction.get(slotRef);
        const activeBookingSnap = await transaction.get(activeBookingRef);

        if (activeBookingSnap.exists()) {
          throw new Error(
            "You already have an active booking. Please checkout or cancel it first."
          );
        }

        if (!freshSlotSnap.exists()) {
          throw new Error("Slot not found");
        }

        const freshSlot = freshSlotSnap.data() as Slot;

        if (freshSlot.status !== "available") {
          throw new Error("Slot is no longer available");
        }

        transaction.set(bookingRef, {
          userId: user.uid,
          userEmail: user.email,
          slotId,
          plateNumber: plateNumber.trim().toUpperCase(),

          status: "reserved",

          reservedAt: now,
          expiresAt,
          arrivedAt: null,
          checkedOutAt: null,
          cancelledAt: null,

          pricePerHour: PRICE_PER_HOUR,
          durationMinutes: 0,
          totalPrice: 0,

          createdAt: now,
          updatedAt: now,
        });

        transaction.update(slotRef, {
          status: "reserved",
          reservedBy: user.uid,
          currentBookingId: bookingRef.id,

          reservedAt: now,
          expiresAt,
          arrivedAt: null,
          pricePerHour: PRICE_PER_HOUR,

          updatedAt: now,
        });

        transaction.set(activeBookingRef, {
          userId: user.uid,
          bookingId: bookingRef.id,
          slotId,
          status: "reserved",
          createdAt: now,
          updatedAt: now,
        });
      });

      router.push("/parking-status");
    } catch (error: unknown) {
      console.error("BOOKING ERROR:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Booking failed. The slot may already be reserved.";

      alert(message);
    } finally {
      setBooking(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060d1f] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-9 w-9 animate-spin text-blue-400" />
          <p className="text-sm text-slate-400">Loading booking details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060d1f] px-4 py-10 text-white sm:px-6 md:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <section className="relative z-10 mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <button
            type="button"
            onClick={() => router.push("/parking-status")}
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to parking slots
          </button>

          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
              <span className="text-xs font-medium uppercase tracking-widest text-blue-300">
                Secure Reservation
              </span>
            </div>

            <h1
              className="text-3xl font-black sm:text-5xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Book Your{" "}
              <span className="bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent">
                Parking Slot
              </span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              Your slot will be reserved for 15 minutes. If you do not confirm
              arrival, the reservation will be cancelled automatically.
            </p>
          </div>

          <div className="mb-7 rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5">
            <p className="text-xs uppercase tracking-widest text-blue-300">
              Selected Slot
            </p>

            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <h2
                  className="text-5xl font-black text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {slot?.id || slotId}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {slot?.floor || "Ground Floor"}
                </p>
              </div>

              <span
                className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize ${
                  slot?.status === "available"
                    ? "border-green-500/30 bg-green-500/10 text-green-400"
                    : slot?.status === "reserved"
                    ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                }`}
              >
                {slot?.status}
              </span>
            </div>
          </div>

          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Vehicle Plate Number
          </label>

          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 transition focus-within:border-blue-500/50">
            <Car size={20} className="text-blue-400" />
            <input
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="Example: ABC-1234"
              className="w-full bg-transparent text-sm font-semibold uppercase tracking-wide text-white outline-none placeholder:font-normal placeholder:normal-case placeholder:text-slate-600"
            />
          </div>

          <button
            type="button"
            onClick={handleBooking}
            disabled={booking || !canBook}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
          >
            {booking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Reserving Slot...
              </>
            ) : (
              <>
                <CalendarCheck size={18} />
                Confirm Booking
              </>
            )}
          </button>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl">
            <h2 className="text-lg font-black">Reservation Details</h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <Timer className="text-yellow-400" size={20} />
                  <span className="text-sm text-slate-300">Hold Timer</span>
                </div>
                <span className="font-black text-yellow-400">
                  {RESERVATION_MINUTES} min
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-green-400" size={20} />
                  <span className="text-sm text-slate-300">Price / Hour</span>
                </div>
                <span className="font-black text-green-400">
                  {PRICE_PER_HOUR} EGP
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <Clock className="text-red-400" size={20} />
                  <span className="text-sm text-slate-300">If Not Arrived</span>
                </div>
                <span className="font-black text-red-400">Cancelled</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-green-500/20 bg-green-500/10 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-400" size={24} />
              <h3 className="font-black text-green-300">How it works</h3>
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>1. Slot becomes reserved for 15 minutes.</p>
              <p>2. Press &quot;I&apos;m Here&quot; when you arrive.</p>
              <p>3. If you do not arrive, reservation is cancelled.</p>
              <p>4. Billing starts only after arrival.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#060d1f] text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-9 w-9 animate-spin text-blue-400" />
            <p className="text-sm text-slate-400">Loading booking page...</p>
          </div>
        </main>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
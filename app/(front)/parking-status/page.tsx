"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  Loader2,
  Timer,
  CreditCard,
} from "lucide-react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

type SlotStatus = "available" | "occupied" | "reserved";

type ParkingSlot = {
  id: string;
  status: SlotStatus;
  floor: string;
  slotNumber?: number;
  reservedBy?: string | null;
  currentBookingId?: string | null;
  reservedAt?: Timestamp | null;
  expiresAt?: Timestamp | null;
  arrivedAt?: Timestamp | null;
  pricePerHour?: number;
};

const PRICE_PER_HOUR = 20;

const defaultSlots: ParkingSlot[] = [
  { id: "A01", status: "available", floor: "Ground Floor", slotNumber: 1 },
  { id: "A02", status: "available", floor: "Ground Floor", slotNumber: 2 },
  { id: "A03", status: "available", floor: "Ground Floor", slotNumber: 3 },
  { id: "A04", status: "available", floor: "Ground Floor", slotNumber: 4 },
];

function toDate(value?: Timestamp | null) {
  if (!value) return null;
  return value.toDate();
}

function formatTime(ms: number) {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.floor(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function calcDurationMinutes(startDate: Date, endDate: Date) {
  return Math.max(
    1,
    Math.ceil((endDate.getTime() - startDate.getTime()) / 60000)
  );
}

function calcTotalPrice(durationMinutes: number, pricePerHour: number) {
  return Math.ceil((durationMinutes / 60) * pricePerHour);
}

export default function ParkingStatusPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [now, setNow] = useState(new Date());
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);
  const [arrivingId, setArrivingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const processingExpired = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const q = query(collection(db, "parkingSlots"), orderBy("slotNumber", "asc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as ParkingSlot[];

        setSlots(data);
        setLoading(false);
      },
      (error) => {
        console.warn("PARKING SLOTS ERROR:", error);
        setSlots(defaultSlots);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    slots.forEach((slot) => {
      const expiresAt = toDate(slot.expiresAt);

      if (
        slot.status === "reserved" &&
        slot.currentBookingId &&
        slot.reservedBy &&
        expiresAt &&
        now.getTime() >= expiresAt.getTime() &&
        !processingExpired.current.has(slot.id)
      ) {
        cancelExpiredReservation(slot);
      }
    });
  }, [slots, now]);

  async function seedSlots() {
    try {
      setSeeding(true);

      await Promise.all(
        defaultSlots.map((slot) =>
          setDoc(doc(db, "parkingSlots", slot.id), {
            status: slot.status,
            floor: slot.floor,
            slotNumber: slot.slotNumber,
            reservedBy: null,
            currentBookingId: null,
            reservedAt: null,
            expiresAt: null,
            arrivedAt: null,
            pricePerHour: PRICE_PER_HOUR,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        )
      );
    } catch (error) {
      console.error("SEED SLOTS ERROR:", error);
    } finally {
      setSeeding(false);
    }
  }

  function handleBookNow(slot: ParkingSlot) {
    if (!user) {
      router.push("/login");
      return;
    }

    localStorage.setItem("selectedSlotId", slot.id);
    router.push(`/booking?slotId=${encodeURIComponent(slot.id)}`);
  }

  async function handleArrival(slot: ParkingSlot) {
    if (!user || !slot.currentBookingId || slot.reservedBy !== user.uid) return;

    try {
      setArrivingId(slot.id);

      const arrivedAt = Timestamp.now();

      await updateDoc(doc(db, "parkingSlots", slot.id), {
        status: "occupied",
        arrivedAt,
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "bookings", slot.currentBookingId), {
        status: "arrived",
        arrivedAt,
        updatedAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "activeBookings", user.uid),
        {
          userId: user.uid,
          bookingId: slot.currentBookingId,
          slotId: slot.id,
          status: "arrived",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("ARRIVAL ERROR:", error);
      alert("Arrival failed. Check console.");
    } finally {
      setArrivingId(null);
    }
  }

  async function cancelReservation(slot: ParkingSlot) {
    if (!user || !slot.currentBookingId || slot.reservedBy !== user.uid) return;

    try {
      setCancellingId(slot.id);

      const cancelledAt = Timestamp.now();

      await updateDoc(doc(db, "bookings", slot.currentBookingId), {
        status: "cancelled",
        cancelledAt,
        cancelReason: "Cancelled by user",
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "parkingSlots", slot.id), {
        status: "available",
        reservedBy: null,
        currentBookingId: null,
        reservedAt: null,
        expiresAt: null,
        arrivedAt: null,
        updatedAt: serverTimestamp(),
      });

      await deleteDoc(doc(db, "activeBookings", user.uid));
    } catch (error) {
      console.error("CANCEL RESERVATION ERROR:", error);
      alert("Cancel failed. Check console.");
    } finally {
      setCancellingId(null);
    }
  }

  async function cancelExpiredReservation(slot: ParkingSlot) {
    if (!slot.currentBookingId || !slot.reservedBy) return;

    try {
      processingExpired.current.add(slot.id);

      const cancelledAt = Timestamp.now();

      await updateDoc(doc(db, "bookings", slot.currentBookingId), {
        status: "cancelled",
        cancelledAt,
        cancelReason: "Reservation expired",
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "parkingSlots", slot.id), {
        status: "available",
        reservedBy: null,
        currentBookingId: null,
        reservedAt: null,
        expiresAt: null,
        arrivedAt: null,
        updatedAt: serverTimestamp(),
      });

      await deleteDoc(doc(db, "activeBookings", slot.reservedBy));
    } catch (error) {
      console.error("CANCEL EXPIRED RESERVATION ERROR:", error);
    } finally {
      processingExpired.current.delete(slot.id);
    }
  }

  async function handleCheckout(slot: ParkingSlot) {
    if (!user || !slot.currentBookingId || slot.reservedBy !== user.uid) return;

    try {
      setCheckingOutId(slot.id);

      const bookingRef = doc(db, "bookings", slot.currentBookingId);
      const bookingSnap = await getDoc(bookingRef);

      if (!bookingSnap.exists()) {
        alert("Booking not found");
        return;
      }

      const bookingData = bookingSnap.data();
      const checkoutTime = Timestamp.now();

      const arrivedDate =
        toDate(slot.arrivedAt) ||
        toDate(bookingData.arrivedAt as Timestamp | null) ||
        new Date();

      const durationMinutes = calcDurationMinutes(
        arrivedDate,
        checkoutTime.toDate()
      );

      const pricePerHour = bookingData.pricePerHour || PRICE_PER_HOUR;
      const totalPrice = calcTotalPrice(durationMinutes, pricePerHour);

      await updateDoc(bookingRef, {
        status: "checked_out",
        checkedOutAt: checkoutTime,
        durationMinutes,
        totalPrice,
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "parkingSlots", slot.id), {
        status: "available",
        reservedBy: null,
        currentBookingId: null,
        reservedAt: null,
        expiresAt: null,
        arrivedAt: null,
        updatedAt: serverTimestamp(),
      });

      await deleteDoc(doc(db, "activeBookings", user.uid));

      router.push(`/invoice?bookingId=${slot.currentBookingId}`);
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);
      alert("Checkout failed. Check console.");
    } finally {
      setCheckingOutId(null);
    }
  }

  const stats = useMemo(() => {
    return {
      available: slots.filter((slot) => slot.status === "available").length,
      reserved: slots.filter((slot) => slot.status === "reserved").length,
      occupied: slots.filter((slot) => slot.status === "occupied").length,
    };
  }, [slots]);

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

      <section className="relative z-10 mx-auto max-w-6xl space-y-10">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-blue-300">
              Live Parking Status
            </span>
          </div>

          <h1
            className="text-3xl font-black text-white sm:text-4xl md:text-6xl"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Parking{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #60a5fa, #3b82f6)",
              }}
            >
              Availability
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Reserve a slot for 15 minutes. Press “I'm Here” when you arrive.
            If the timer ends, the reservation is cancelled automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { value: stats.available, label: "Available", color: "text-green-400" },
            { value: stats.reserved, label: "Reserved", color: "text-yellow-400" },
            { value: stats.occupied, label: "Occupied", color: "text-red-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 text-center backdrop-blur-xl"
            >
              <p
                className={`text-3xl font-black ${stat.color}`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
                {stat.label} Slots
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-white/[0.07] bg-white/[0.04] p-4 backdrop-blur-xl sm:p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2
                className="text-2xl font-black text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Garage Slots
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Only the booking owner can arrive, cancel, or checkout.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="text-green-400">● Available</span>
              <span className="text-yellow-400">● Reserved</span>
              <span className="text-red-400">● Occupied</span>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : slots.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-8 text-center">
              <p className="text-lg font-bold text-white">
                No parking slots found
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Click below to create the default garage slots.
              </p>

              <button
                type="button"
                onClick={seedSlots}
                disabled={seeding}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {seeding && <Loader2 className="h-4 w-4 animate-spin" />}
                {seeding ? "Creating..." : "Create Default Slots"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {slots.map((slot, i) => {
                const isAvailable = slot.status === "available";
                const isReserved = slot.status === "reserved";
                const isOccupied = slot.status === "occupied";
                const isOwner = Boolean(user?.uid && slot.reservedBy === user.uid);

                const expiresAt = toDate(slot.expiresAt);
                const arrivedAt = toDate(slot.arrivedAt);

                const reservationLeft =
                  expiresAt && isReserved
                    ? expiresAt.getTime() - now.getTime()
                    : 0;

                const parkingMinutes =
                  arrivedAt && isOccupied
                    ? calcDurationMinutes(arrivedAt, now)
                    : 0;

                const livePrice =
                  isOccupied && arrivedAt
                    ? calcTotalPrice(
                        parkingMinutes,
                        slot.pricePerHour || PRICE_PER_HOUR
                      )
                    : 0;

                return (
                  <div
                    key={slot.id}
                    className="group flex flex-col gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="w-5 text-right font-mono text-sm text-slate-700">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            isAvailable
                              ? "bg-green-500/10"
                              : isReserved
                              ? "bg-yellow-500/10"
                              : "bg-red-500/10"
                          }`}
                        >
                          {isAvailable ? (
                            <CheckCircle size={22} className="text-green-400" />
                          ) : isReserved ? (
                            <Clock size={22} className="text-yellow-400" />
                          ) : (
                            <XCircle size={22} className="text-red-400" />
                          )}
                        </div>

                        <div>
                          <h3
                            className="text-xl font-black text-white"
                            style={{ fontFamily: "'Syne', sans-serif" }}
                          >
                            Slot {slot.id}
                          </h3>

                          <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                            <Car size={14} className="text-blue-400" />
                            {slot.floor || "Ground Floor"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${
                          isAvailable
                            ? "border-green-500/20 bg-green-500/10 text-green-400"
                            : isReserved
                            ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                            : "border-red-500/20 bg-red-500/10 text-red-400"
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>

                    {isReserved && (
                      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-yellow-300">
                            <Timer size={17} />
                            Reservation Timer
                          </div>
                          <span className="font-mono text-lg font-black text-yellow-300">
                            {formatTime(reservationLeft)}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-slate-400">
                          Press “I'm Here” before the timer ends. Otherwise, the
                          reservation will be cancelled.
                        </p>
                      </div>
                    )}

                    {isOccupied && (
                      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-red-300">
                            <Clock size={17} />
                            Parking Duration
                          </div>
                          <span className="font-mono text-lg font-black text-red-300">
                            {parkingMinutes} min
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
                          <div className="flex items-center gap-2 text-sm text-green-300">
                            <CreditCard size={16} />
                            Live Cost
                          </div>
                          <span className="font-black text-green-300">
                            {livePrice} EGP
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row">
                      {isAvailable && (
                        <button
                          type="button"
                          onClick={() => handleBookNow(slot)}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Book Now
                          <ArrowRight size={15} />
                        </button>
                      )}

                      {isReserved && isOwner && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleArrival(slot)}
                            disabled={arrivingId === slot.id}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {arrivingId === slot.id && (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            {arrivingId === slot.id ? "Confirming..." : "I'm Here"}
                          </button>

                          <button
                            type="button"
                            onClick={() => cancelReservation(slot)}
                            disabled={cancellingId === slot.id}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {cancellingId === slot.id && (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            {cancellingId === slot.id
                              ? "Cancelling..."
                              : "Cancel Reservation"}
                          </button>
                        </>
                      )}

                      {isReserved && !isOwner && (
                        <button
                          type="button"
                          disabled
                          className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-300"
                        >
                          Reserved By Another User
                        </button>
                      )}

                      {isOccupied && isOwner && (
                        <button
                          type="button"
                          onClick={() => handleCheckout(slot)}
                          disabled={checkingOutId === slot.id}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {checkingOutId === slot.id && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          {checkingOutId === slot.id
                            ? "Checking Out..."
                            : "Checkout & Invoice"}
                        </button>
                      )}

                      {isOccupied && !isOwner && (
                        <button
                          type="button"
                          disabled
                          className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300"
                        >
                          Occupied By Another User
                        </button>
                      )}
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
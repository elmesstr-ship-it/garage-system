"use client";

import SliderCard from "@/components/SliderCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Car,
  CheckCircle,
  Clock,
  History,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const cachedUser = localStorage.getItem("smart-user");

    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        localStorage.removeItem("smart-user");
      }
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        localStorage.removeItem("smart-user");
        return;
      }

      const fallbackUser = {
        uid: firebaseUser.uid,
        name: firebaseUser.email?.split("@")[0] || "User",
        email: firebaseUser.email,
        role: "user",
      };

      setUser(fallbackUser);

      try {
        const snap: any = await Promise.race([
          getDoc(doc(db, "users", firebaseUser.uid)),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Firestore timeout")), 3000)
          ),
        ]);

        const userData = snap.exists()
          ? { uid: firebaseUser.uid, ...snap.data() }
          : fallbackUser;

        setUser(userData);
        localStorage.setItem("smart-user", JSON.stringify(userData));
      } catch (error) {
        console.warn("HOME USER FALLBACK:", error);
        setUser(fallbackUser);
        localStorage.setItem("smart-user", JSON.stringify(fallbackUser));
      }
    });

    return () => unsub();
  }, []);

  if (user) {
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

        <section className="relative z-10 mx-auto max-w-6xl space-y-8 md:space-y-10">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
              <span className="text-xs font-medium uppercase tracking-widest text-blue-300">
                Welcome Back
              </span>
            </div>

            <h1
              className="text-3xl font-black text-white sm:text-4xl md:text-6xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Hello{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #60a5fa, #3b82f6)",
                }}
              >
                {user?.name || "User"}
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Follow the smart parking sequence to check availability, reserve
              your slot, confirm arrival, and track your history.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: "24/7", label: "Monitoring" },
              { value: "4+", label: "Parking Slots" },
              { value: "15 Min", label: "Reservation Hold" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 text-center backdrop-blur-xl"
              >
                <p
                  className="text-2xl font-black text-blue-400 md:text-3xl"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.04] p-4 backdrop-blur-xl sm:p-6 md:p-8">
            <div className="mb-8 text-center">
              <h2
                className="text-2xl font-black text-white md:text-3xl"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Parking Sequence
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Start from parking status and complete your reservation flow.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  step: "01",
                  icon: MapPin,
                  title: "Check Parking Status",
                  text: "View available, reserved, and occupied slots before booking.",
                  href: "/parking-status",
                  button: "View Slots",
                },
                {
                  step: "02",
                  icon: Car,
                  title: "Book Available Slot",
                  text: "Choose an available slot and enter your vehicle plate number.",
                  href: "/booking",
                  button: "Book Now",
                },
                {
                  step: "03",
                  icon: Clock,
                  title: "Confirm Arrival",
                  text: "Arrive within 15 minutes and confirm that you reached the garage.",
                  href: "/booking",
                  button: "Continue",
                },
                {
                  step: "04",
                  icon: History,
                  title: "View Booking History",
                  text: "Track your completed reservations and previous parking activity.",
                  href: "/history",
                  button: "Open History",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.step}
                    className="group rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 sm:p-6"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <span className="font-mono text-sm text-slate-700">
                        {item.step}
                      </span>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-500/20">
                        <Icon size={22} />
                      </div>
                    </div>

                    <h3
                      className="text-lg font-black text-white sm:text-xl"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {item.text}
                    </p>

                    <Link
                      href={item.href}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                    >
                      {item.button}
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-5 backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  <CheckCircle size={22} />
                </div>

                <div>
                  <h3
                    className="text-lg font-black text-white sm:text-xl"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Ready to park today?
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Start by checking the current slot availability.
                  </p>
                </div>
              </div>

              <Link
                href="/parking-status"
                className="w-full rounded-xl bg-green-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700 md:w-auto"
              >
                Start Parking Flow
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="flex w-full flex-col overflow-hidden bg-[#060d1f]">
      <section
        className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/black-sport-car-dark-background-3d-render_68747-359.avif')",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#060d1f]/80 via-[#060d1f]/50 to-[#060d1f]/90" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#060d1f]/60 via-transparent to-[#060d1f]/60" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-blue-300">
              Smart Garage System
            </span>
          </div>

          <h1
            className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-7xl"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Welcome{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #60a5fa, #3b82f6, #1d4ed8)",
              }}
            >
              Guest
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base md:text-lg">
            Modern Parking Management System for real-time slot booking, secure
            access, and smart vehicle tracking.
          </p>

          <div className="relative z-20 mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="group relative w-full overflow-hidden rounded-xl px-7 py-3 text-center font-semibold text-white transition-all duration-300 hover:scale-105 sm:w-auto"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              }}
            >
              <span className="relative z-10">Get Started</span>
              <div className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>

            <Link
              href="/about"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-7 py-3 text-center font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/10 sm:w-auto"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-3 sm:mt-16 sm:flex sm:flex-wrap sm:justify-center sm:gap-8">
            {[
              { value: "24/7", label: "Monitoring" },
              { value: "4+", label: "Parking Slots" },
              { value: "15 Min", label: "Reservation Hold" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-xl font-black text-blue-400 sm:text-2xl"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-slate-500 sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060d1f] to-transparent" />
      </section>

      <section className="relative z-10 w-full bg-[#060d1f] px-4 py-14 sm:py-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-blue-400">
              Features
            </p>
            <h2
              className="text-3xl font-black text-white md:text-4xl"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Everything You Need
            </h2>
          </div>

          <div className="relative z-20">
            <SliderCard />
          </div>
        </div>
      </section>
    </div>
  );
}
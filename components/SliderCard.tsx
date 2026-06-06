"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaLocationDot } from "react-icons/fa6";
import { FaCarSide, FaBusinessTime, FaArrowRight } from "react-icons/fa";
import { MdOutlinePhoneIphone } from "react-icons/md";

const aboutData = [
  {
    icone: FaCarSide,
    title: "Gate",
    disc: "Welcome to Smart Garage. Find parking spaces faster and easier.",
    subMain: "Get Started",
    subDisc: "Park quickly and drive stress-free!",
  },
  {
    icone: FaLocationDot,
    title: "Find A Spot",
    disc: "Locate empty parking spots in seconds.",
    subMain: "Continue",
    subDisc: "Save time and enjoy convenience!",
  },
  {
    icone: FaBusinessTime,
    title: "Book In Advance",
    disc: "Reserve your parking spot before arrival.",
    subMain: "Continue",
    subDisc: "Your space is ready when you arrive!",
  },
  {
    icone: MdOutlinePhoneIphone,
    title: "Smart Control",
    disc: "Manage parking from one app easily.",
    subMain: "Parking Request",
    subDisc: "Everything is one tap away!",
  },
];

export default function SliderCard() {
  const router = useRouter();
  const [index, setIndex] = React.useState(0);

  const item = aboutData[index];
  const Icon = item.icone;

  function goNext() {
    if (index < aboutData.length - 1) {
      setIndex((prev) => prev + 1);
      return;
    }

    router.push("/booking");
  }

  function goPrev() {
    setIndex((prev) => Math.max(prev - 1, 0));
  }

  function goToSlide(i: number) {
    setIndex(i);
  }

  return (
    <div className="relative z-20 w-full touch-manipulation">
      <div className="rounded-3xl border border-white/[0.07] bg-white/[0.04] text-white shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="relative flex min-h-[360px] flex-col items-center justify-center gap-5 overflow-hidden px-5 py-10 text-center sm:px-6">
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative z-20 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-blue-300">
              Smart Garage
            </span>
          </div>

          <div className="relative z-20 rounded-full border border-blue-500/20 bg-blue-500/10 p-5 text-blue-400">
            <Icon className="text-4xl" />
          </div>

          <h1
            className="relative z-20 text-3xl font-black text-white md:text-5xl"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {item.title}
          </h1>

          <p className="relative z-20 max-w-xl text-sm text-slate-400 md:text-base">
            {item.disc}
          </p>

          <button
            type="button"
            onClick={goNext}
            onTouchStart={(e) => {
              e.preventDefault();
              goNext();
            }}
            className="relative z-50 mt-2 flex flex-col items-center gap-2 touch-manipulation select-none"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-95">
              <FaArrowRight />
            </span>

            <span className="text-base font-bold text-white transition hover:text-blue-400">
              {item.subMain}
            </span>
          </button>

          <div className="relative z-20 flex items-center gap-2 text-xs text-slate-500">
            <p>{item.subDisc}</p>
            <FaHeart className="text-red-500" />
          </div>
        </div>
      </div>

      <div className="relative z-50 mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goPrev}
          onTouchStart={(e) => {
            e.preventDefault();
            goPrev();
          }}
          disabled={index === 0}
          className="touch-manipulation rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {aboutData.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              onTouchStart={(e) => {
                e.preventDefault();
                goToSlide(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-3 rounded-full touch-manipulation transition-all ${
                index === i ? "w-8 bg-blue-500" : "w-3 bg-white/20"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          onTouchStart={(e) => {
            e.preventDefault();
            goNext();
          }}
          className="touch-manipulation rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  );
}
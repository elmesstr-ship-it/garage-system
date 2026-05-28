"use client";

import SliderCard from "@/components/SliderCard";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('/images/black-sport-car-dark-background-3d-render_68747-359.avif')",
        }}
      >
        {/* Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="font-[Lora] text-6xl md:text-8xl font-extrabold text-white drop-shadow-2xl tracking-wide">
            SMART{" "}
            <span className="text-blue-400">
              GARAGE
            </span>
          </h1>

          <p className="text-gray-300 mt-6 text-lg md:text-2xl font-light max-w-2xl mx-auto">
            Modern Parking Management System with AI-powered monitoring,
            security, and smart vehicle tracking.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center mt-10 flex-wrap">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:scale-105"
            >
              Get Started
            </Link>

            <Link
              href="/about"
              className="border border-white hover:bg-white hover:text-black transition-all duration-300 text-white px-8 py-3 rounded-2xl text-lg font-semibold hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Slider Section */}
      <section className="bg-slate-100 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-7xl">
          <SliderCard />
        </div>
      </section>
    </div>
  );
}
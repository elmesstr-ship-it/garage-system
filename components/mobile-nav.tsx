"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CarFront,
  Home,
  LayoutDashboard,
  CalendarCheck,
  Info,
  Phone,
  Menu,
  X,
} from "lucide-react";

const mobileNavLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Bookings", path: "/dashboard/bookings", icon: CalendarCheck },
  { name: "About", path: "/about", icon: Info },
  { name: "Contact", path: "/contact", icon: Phone },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function openMenu() {
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
  }

  function goTo(path: string) {
    setOpen(false);
    router.push(path);
  }

  return (
    <>
      <button
        type="button"
        onClick={openMenu}
        onPointerDown={(e) => {
          e.preventDefault();
          openMenu();
        }}
        className="relative z-[99999] flex h-11 w-11 touch-manipulation items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white hover:border-blue-500/40 hover:bg-blue-500/10 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[999999] md:hidden">
          <button
            type="button"
            onClick={closeMenu}
            onPointerDown={(e) => {
              e.preventDefault();
              closeMenu();
            }}
            className="absolute inset-0 touch-manipulation bg-black/70"
          />

          <div className="absolute left-0 top-0 z-[1000000] h-full w-[82%] max-w-[320px] border-r border-white/10 bg-[#060d1f] p-5 text-white shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10">
                  <CarFront className="h-6 w-6 text-blue-400" />
                </div>

                <div>
                  <h2 className="text-base font-bold">Smart Garage</h2>
                  <p className="text-xs text-slate-500">
                    Smart Parking System
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                onPointerDown={(e) => {
                  e.preventDefault();
                  closeMenu();
                }}
                className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {mobileNavLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.path;

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => goTo(item.path)}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      goTo(item.path);
                    }}
                    className={`flex touch-manipulation items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                      active
                        ? "border-blue-500/30 bg-blue-500/15 text-blue-300"
                        : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileNav;
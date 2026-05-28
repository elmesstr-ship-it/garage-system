"use client";

import {
  Car,
  CreditCard,
  Home,
  LogOut,
  Settings,
  TicketCheck,
  Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar({ user = false }: { user?: boolean }) {
  const pathName = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  const sideBarLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      label: "Vehicles",
      href: "/dashboard/vehicles",
      icon: Car,
      badgeCount: 6,
    },
    {
      label: "Bookings",
      href: "/dashboard/bookings",
      icon: TicketCheck,
    },
    {
      label: "Users",
      href: "/dashboard/users",
      icon: Users,
    },
    {
      label: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-slate-950/95 text-white md:block">
      <div className="flex h-full max-h-screen flex-col gap-6 p-5">
        <div className="rounded-3xl bg-blue-600/20 p-5">
          <h2 className="text-2xl font-extrabold">
            Smart Garage
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            Admin Control Panel
          </p>
        </div>

        <nav className="grid gap-2 text-sm font-medium">
          {sideBarLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathName === item.href ||
              pathName.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-300 transition-all hover:bg-white/10 hover:text-white",
                  isActive &&
                    "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                )}
              >
                <Icon className="h-5 w-5" />

                <span>{item.label}</span>

                {item.badgeCount && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500">
                    {item.badgeCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl bg-white/5 p-4">
          <p className="text-sm text-slate-400">
            Logged in as
          </p>

          <p className="mt-1 font-semibold">
            Admin
          </p>

          <Button
            onClick={handleLogout}
            size="sm"
            className="mt-4 w-full rounded-xl bg-red-600 hover:bg-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
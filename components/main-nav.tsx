"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarFront } from "lucide-react";

import { siteConfig } from "@/config/site";
import { docsConfig } from "@/config/docs";
import { cn } from "@/lib/utils";

type NavItem = {
  title?: string;
  href?: string;
};

function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex items-center">
      <Link
        href="/"
        className="mr-8 flex items-center gap-3 transition hover:opacity-90"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10">
          <CarFront className="h-5 w-5 text-blue-400" />
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-bold text-white">
            {siteConfig.name}
          </p>
          <p className="text-[11px] text-slate-500">
            Smart Parking System
          </p>
        </div>
      </Link>

      <nav className="flex items-center gap-2">
        {docsConfig.mainNav?.map((item: NavItem, i: number) => {
          const active = pathname === item.href;

          return (
            <Link
              key={i}
              href={item.href ?? "/"}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export { MainNav };
export default MainNav;
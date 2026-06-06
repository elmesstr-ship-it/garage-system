"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { docsConfig } from "@/config/docs";
import { Button } from "@/components/ui/button";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  type NavItem = {
  title?: string;
  href?: string;
};

const links = docsConfig.mainNav.filter((item: NavItem) => item.href);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen((prev) => !prev)}
        className="
          relative h-11 w-full justify-start rounded-2xl
          border border-white/15 bg-white/[0.06]
          px-4 pr-11 text-sm font-normal text-slate-200
          shadow-[0_0_24px_rgba(59,130,246,0.10)]
          transition
          hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white
          md:w-64 xl:w-80
        "
      >
        <span className="hidden lg:inline-flex">Search pages...</span>
        <span className="inline-flex lg:hidden">Search...</span>

        <Search className="absolute right-4 h-4 w-4 text-blue-300" />
      </Button>

      {open && (
        <div
          className="
            absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl
            border border-white/10 bg-[#101827] p-2 text-white
            shadow-[0_20px_60px_rgba(0,0,0,0.45)]
          "
        >
          <div className="mb-2 border-b border-white/10 px-3 pb-2 pt-1">
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
              Quick Navigation
            </p>
          </div>

          {links.length > 0 ? (
            links.map((item: NavItem) => (
              <button
                key={item.href}
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push(item.href as string);
                }}
                className="
                  flex w-full items-center gap-3 rounded-xl px-4 py-3
                  text-left text-sm text-slate-300 transition
                  hover:bg-blue-500/10 hover:text-blue-300
                "
              >
                <Search className="h-4 w-4 text-slate-500" />
                <span>{item.title}</span>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-slate-500">
              No pages found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { docsConfig } from "@/config/docs";
import { Button } from "@/components/ui/button";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const links = docsConfig.mainNav.filter((item) => item.href);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="relative h-10 w-full justify-start rounded-xl text-sm font-normal text-muted-foreground shadow-none md:w-56 xl:w-72"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="hidden lg:inline-flex">Search pages...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <Search className="absolute right-3 h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border bg-white p-2 shadow-2xl">
          {links.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(item.href as string);
              }}
              className="w-full rounded-xl px-4 py-3 text-left text-sm hover:bg-slate-100"
            >
              {item.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
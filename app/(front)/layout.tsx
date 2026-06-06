import { SiteHeader } from "@/components/SiteHeader";
import React from "react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#060d1f] text-white">
      <SiteHeader />

      <main className="relative z-0 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SiteHeader } from "../../components/SiteHeader";
import SideBar from "../../components/dashbaord/SideBar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("smart-user");

    if (!user) {
      router.push("/login");
      return;
    }

    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-slate-900 dark:bg-[#0b1020] dark:text-white">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-white/10 dark:bg-white/10">
          <h1 className="text-2xl font-bold">
            Checking access...
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Please wait
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-[#0b1020] dark:text-white">
      <SiteHeader />

      <div className="flex min-h-[calc(100vh-64px)] w-full">
        <SideBar />

        <main className="flex-1 overflow-x-hidden bg-slate-50 dark:bg-[#0b1020]">
          {children}
        </main>
      </div>
    </div>
  );
}
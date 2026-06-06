"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Loader2, Menu, ShieldCheck, X } from "lucide-react";

import { auth, db } from "@/lib/firebase";
import { SiteHeader } from "../../components/SiteHeader";
import SideBar from "../../components/dashbaord/SideBar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          router.replace("/login");
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.log("USER DOC NOT FOUND:", user.uid);
          router.replace("/");
          return;
        }

        const userData = userSnap.data();
        const role = String(userData.role || "").trim().toLowerCase();

        if (role !== "admin") {
          console.log("NOT ADMIN:", role);
          router.replace("/");
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error("ADMIN ACCESS ERROR:", error);
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060d1f] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400">
            <ShieldCheck size={34} />
          </div>

          <h1 className="text-2xl font-bold">Checking Admin Access</h1>

          <p className="mt-2 text-sm text-slate-400">
            Please wait while we verify your permissions
          </p>

          <Loader2 className="mx-auto mt-6 animate-spin text-blue-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060d1f] text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />

        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#060d1f]/90 px-4 py-3 backdrop-blur-xl md:hidden">
          <div>
            <h2 className="text-lg font-bold">Admin Dashboard</h2>
            <p className="text-xs text-slate-400">Garage System Panel</p>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/15"
          >
            <Menu size={22} />
          </button>
        </div>

        <div className="flex flex-1">
          <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-white/[0.035] backdrop-blur-xl md:block">
            <div className="sticky top-0 h-screen overflow-y-auto">
              <SideBar />
            </div>
          </aside>

          {sidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                onClick={() => setSidebarOpen(false)}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              />

              <aside className="absolute left-0 top-0 h-full w-80 max-w-[85%] border-r border-white/10 bg-[#081226] shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                  <div>
                    <h2 className="font-bold">Dashboard Menu</h2>
                    <p className="text-xs text-slate-400">Admin only</p>
                  </div>

                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-xl border border-white/10 bg-white/10 p-2 transition hover:bg-white/15"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div onClick={() => setSidebarOpen(false)}>
                  <SideBar />
                </div>
              </aside>
            </div>
          )}

          <main className="min-w-0 flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-2xl backdrop-blur-xl sm:p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
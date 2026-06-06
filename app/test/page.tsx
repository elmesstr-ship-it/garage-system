"use client";

import { db } from "@/lib/firebase";

export default function TestPage() {
  console.log(db);

  return (
    <main className="min-h-screen bg-[#060d1f] p-10 text-white">
      Firebase Connected ✅
    </main>
  );
}
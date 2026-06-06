"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Car,
  ShieldCheck,
  Phone,
  MapPin,
  Pencil,
  X,
  Loader2,
  Save,
  CalendarCheck,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";

type UserData = {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  vehicleType?: string;
};

type BookingHistory = {
  id: string;
  userId: string;
  status?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [visits, setVisits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "Egypt",
    vehicleType: "",
  });

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        const firestoreData = userSnap.exists() ? userSnap.data() : {};

        const finalUser: UserData = {
          id: currentUser.uid,
          name:
            (firestoreData.name as string) ||
            currentUser.displayName ||
            "Smart Garage User",
          email: currentUser.email || (firestoreData.email as string) || "",
          phone: (firestoreData.phone as string) || "",
          country: (firestoreData.country as string) || "Egypt",
          vehicleType: (firestoreData.vehicleType as string) || "",
        };

        setUser(finalUser);

        setForm({
          name: finalUser.name,
          phone: finalUser.phone || "",
          country: finalUser.country || "Egypt",
          vehicleType: finalUser.vehicleType || "",
        });

        await setDoc(
          userRef,
          {
            name: finalUser.name,
            email: finalUser.email,
            phone: finalUser.phone || "",
            country: finalUser.country || "Egypt",
            vehicleType: finalUser.vehicleType || "",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        const historyQuery = query(
          collection(db, "bookingHistory"),
          where("userId", "==", currentUser.uid)
        );

        const unsubHistory = onSnapshot(historyQuery, (snapshot) => {
          setVisits(snapshot.docs.length);
        });

        setLoading(false);

        return () => unsubHistory();
      } catch (error) {
        console.error("PROFILE ERROR:", error);
        toast.error("Failed to load profile");
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) return "?";

    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.name]);

  async function handleSaveProfile() {
    if (!auth.currentUser || !user) return;

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);

      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          name: form.name.trim(),
          email: user.email,
          phone: form.phone.trim(),
          country: form.country.trim() || "Egypt",
          vehicleType: form.vehicleType.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setUser({
        ...user,
        name: form.name.trim(),
        phone: form.phone.trim(),
        country: form.country.trim() || "Egypt",
        vehicleType: form.vehicleType.trim(),
      });

      toast.success("Profile updated successfully");
      setEditOpen(false);
    } catch (error) {
      console.error("SAVE PROFILE ERROR:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-4 text-white"
        style={{ background: "#060d1f" }}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-slate-400">
          <Loader2 className="animate-spin text-blue-400" size={20} />
          Loading profile...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-4 text-white"
        style={{ background: "#060d1f" }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <h1 className="text-2xl font-bold">You are not logged in</h1>
          <p className="mt-2 text-sm text-slate-400">
            Please login to view your profile.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-12 text-white sm:px-6 sm:py-16"
      style={{ background: "#060d1f" }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <section className="relative z-10 mx-auto max-w-5xl space-y-6">
        <div className="text-center sm:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            <span className="text-xs font-medium uppercase tracking-widest text-blue-300">
              My Profile
            </span>
          </div>

          <h1
            className="text-4xl font-black sm:text-5xl"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Account{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Overview
            </span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Manage your personal details, vehicle information, and parking
            activity.
          </p>
        </div>

        <div
          className="rounded-3xl border border-white/[0.07] p-6 backdrop-blur-md sm:p-8 md:p-10"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
            <div className="relative shrink-0">
              <div
                className="flex h-28 w-28 items-center justify-center rounded-3xl text-3xl font-black shadow-lg shadow-blue-500/20"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {initials}
              </div>

              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#060d1f] bg-green-500">
                <ShieldCheck size={14} className="text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <h2
                className="break-words text-3xl font-black text-white md:text-4xl"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {user.name}
              </h2>

              <div className="flex flex-col gap-2">
                {[
                  { icon: Mail, text: user.email },
                  { icon: Phone, text: user.phone || "Phone not added" },
                  { icon: MapPin, text: user.country || "Egypt" },
                ].map(({ icon: Icon, text }) => (
                  <p
                    key={text}
                    className="flex items-center justify-center gap-2 break-words text-sm text-slate-400 md:justify-start"
                  >
                    <Icon size={15} className="shrink-0 text-blue-400" />
                    {text}
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={() => setEditOpen(true)}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white"
            >
              <Pencil size={15} />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              icon: CalendarCheck,
              value: visits,
              label: "Parking Visits",
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              icon: ShieldCheck,
              value: "Verified",
              label: "Account Status",
              color: "text-green-400",
              bg: "bg-green-500/10",
            },
            {
              icon: Car,
              value: user.vehicleType || "Not Selected",
              label: "Main Vehicle",
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
          ].map(({ icon: Icon, value, label, color, bg }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.07] p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}
              >
                <Icon size={22} className={color} />
              </div>

              <h2
                className="text-2xl font-black text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {value}
              </h2>

              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-3xl border border-white/10 p-6 text-white shadow-2xl sm:p-7"
            style={{ background: "#0b1328" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Update your contact and vehicle details.
                </p>
              </div>

              <button
                onClick={() => setEditOpen(false)}
                className="rounded-xl border border-white/10 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Full name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <input
                value={user.email}
                disabled
                placeholder="Email"
                className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-500 outline-none"
              />

              <input
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Phone number"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <input
                value={form.country}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, country: e.target.value }))
                }
                placeholder="Country"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <select
                value={form.vehicleType}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    vehicleType: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option className="bg-[#0b1328]" value="">
                  Select vehicle type
                </option>
                <option className="bg-[#0b1328]" value="Car">
                  Car
                </option>
                <option className="bg-[#0b1328]" value="Motorcycle">
                  Motorcycle
                </option>
                <option className="bg-[#0b1328]" value="SUV">
                  SUV
                </option>
                <option className="bg-[#0b1328]" value="Van">
                  Van
                </option>
              </select>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
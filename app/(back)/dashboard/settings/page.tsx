"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Bell,
  ShieldCheck,
  Moon,
  UserCircle2,
  Save,
  Mail,
  Lock,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type UserSettings = {
  fullName: string;
  email: string;
  role: string;
  darkMode: boolean;
  emailNotifications: boolean;
  autoParkingUpdates: boolean;
};

export default function SettingsPage() {
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<UserSettings>({
    fullName: "",
    email: "",
    role: "admin",
    darkMode: true,
    emailNotifications: true,
    autoParkingUpdates: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      setUid(user.uid);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      const dbUser = userSnap.exists() ? userSnap.data() : {};

      setForm({
        fullName: dbUser.fullName || dbUser.name || user.displayName || "",
        email: dbUser.email || user.email || "",
        role: dbUser.role || "admin",
        darkMode: dbUser.settings?.darkMode ?? true,
        emailNotifications: dbUser.settings?.emailNotifications ?? true,
        autoParkingUpdates: dbUser.settings?.autoParkingUpdates ?? true,
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleSave() {
    if (!uid) return;

    try {
      setSaving(true);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: form.fullName,
        });
      }

      await setDoc(
        doc(db, "users", uid),
        {
          fullName: form.fullName,
          name: form.fullName,
          email: form.email,
          role: form.role,
          settings: {
            darkMode: form.darkMode,
            emailNotifications: form.emailNotifications,
            autoParkingUpdates: form.autoParkingUpdates,
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      alert("Settings saved successfully ✅");
    } catch (error) {
      console.error("SETTINGS SAVE ERROR:", error);
      alert("Failed to save settings ❌");
    } finally {
      setSaving(false);
    }
  }

  function toggleSetting(key: keyof UserSettings) {
    setForm((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-xl">
          <Loader2 className="mx-auto animate-spin text-blue-400" size={38} />
          <h2 className="mt-4 text-xl font-bold text-white">
            Loading Settings
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Reading admin settings from Firestore
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
          Admin Settings
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
          Manage your Smart Garage preferences and admin account settings.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoCard
          icon={<UserCircle2 className="text-blue-400" size={34} />}
          title="Profile"
          text="Update your admin account information."
        />

        <InfoCard
          icon={<Bell className="text-yellow-400" size={34} />}
          title="Notifications"
          text="Configure booking and payment alerts."
        />

        <InfoCard
          icon={<ShieldCheck className="text-green-400" size={34} />}
          title="Security"
          text="Manage authentication and admin access."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* General Settings */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl backdrop-blur-xl sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/10 p-3">
              <Settings className="text-blue-400" size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                General Settings
              </h2>
              <p className="text-sm text-slate-400">
                Synced with Firestore users collection
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Full Name
              </label>

              <input
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/40"
                placeholder="Admin name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <Mail size={18} className="text-blue-400" />

                <input
                  value={form.email}
                  disabled
                  className="w-full bg-transparent text-slate-300 outline-none disabled:cursor-not-allowed"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Email is linked to Firebase Auth.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Account Role
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-green-300">
                <ShieldCheck size={18} />
                <span className="font-semibold capitalize">{form.role}</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Password
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <Lock size={18} className="text-blue-400" />
                <input
                  type="password"
                  value="********"
                  disabled
                  className="w-full bg-transparent text-slate-400 outline-none"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Password changes should be handled from Firebase Auth reset email.
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl backdrop-blur-xl sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-500/10 p-3">
              <Moon className="text-purple-400" size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">Preferences</h2>
              <p className="text-sm text-slate-400">
                Saved inside users/{uid}/settings
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <ToggleCard
              title="Dark Mode"
              text="Enable dark dashboard appearance."
              enabled={form.darkMode}
              onClick={() => toggleSetting("darkMode")}
            />

            <ToggleCard
              title="Email Notifications"
              text="Receive booking and payment alerts."
              enabled={form.emailNotifications}
              onClick={() => toggleSetting("emailNotifications")}
            />

            <ToggleCard
              title="Auto Parking Updates"
              text="Automatically refresh garage activity."
              enabled={form.autoParkingUpdates}
              onClick={() => toggleSetting("autoParkingUpdates")}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
            <div className="flex items-center gap-2 text-blue-300">
              <CheckCircle size={18} />
              <span className="font-semibold">Firestore Connected</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Any saved changes will update the current admin document in database.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.08]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
        {icon}
      </div>

      <h2 className="mt-5 text-xl font-bold text-white">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function ToggleCard({
  title,
  text,
  enabled,
  onClick,
}: {
  title: string;
  text: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-white/[0.14]"
    >
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{text}</p>
      </div>

      <div
        className={`flex h-7 w-14 shrink-0 items-center rounded-full p-1 transition ${
          enabled ? "bg-blue-600" : "bg-slate-700"
        }`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white transition ${
            enabled ? "ml-auto" : "ml-0"
          }`}
        />
      </div>
    </button>
  );
}
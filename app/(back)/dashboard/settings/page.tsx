import {
  Settings,
  Bell,
  ShieldCheck,
  Moon,
  UserCircle2,
  Save,
  Mail,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#0b1020] px-10 py-8 text-white">
      <section className="w-full">
        <div>
          <h1 className="text-5xl font-extrabold">
            Settings
          </h1>

          <p className="mt-3 text-slate-400">
            Manage your Smart Garage preferences and account settings.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <UserCircle2 className="text-blue-400" size={38} />

            <h2 className="mt-5 text-2xl font-bold">
              Profile
            </h2>

            <p className="mt-2 text-slate-400">
              Update your account information and profile details.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <Bell className="text-yellow-400" size={38} />

            <h2 className="mt-5 text-2xl font-bold">
              Notifications
            </h2>

            <p className="mt-2 text-slate-400">
              Configure booking and payment notifications.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <ShieldCheck className="text-green-400" size={38} />

            <h2 className="mt-5 text-2xl font-bold">
              Security
            </h2>

            <p className="mt-2 text-slate-400">
              Manage password and authentication settings.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-xl">
            <div className="flex items-center gap-3">
              <Settings className="text-blue-400" size={30} />

              <h2 className="text-3xl font-bold">
                General Settings
              </h2>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Full Name
                </label>

                <input
                  defaultValue="Ahmed Mohamed"
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <Mail size={18} className="text-blue-400" />

                  <input
                    defaultValue="ahmed@gmail.com"
                    className="w-full bg-transparent outline-none"
                  />
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
                    defaultValue="12345678"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              <button className="mt-4 flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-xl">
            <div className="flex items-center gap-3">
              <Moon className="text-purple-400" size={30} />

              <h2 className="text-3xl font-bold">
                Preferences
              </h2>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between rounded-2xl bg-white/10 p-5">
                <div>
                  <h3 className="font-semibold">
                    Dark Mode
                  </h3>

                  <p className="text-sm text-slate-400">
                    Enable dark dashboard appearance.
                  </p>
                </div>

                <div className="h-7 w-14 rounded-full bg-blue-600 p-1">
                  <div className="ml-auto h-5 w-5 rounded-full bg-white" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/10 p-5">
                <div>
                  <h3 className="font-semibold">
                    Email Notifications
                  </h3>

                  <p className="text-sm text-slate-400">
                    Receive booking and payment alerts.
                  </p>
                </div>

                <div className="h-7 w-14 rounded-full bg-blue-600 p-1">
                  <div className="ml-auto h-5 w-5 rounded-full bg-white" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/10 p-5">
                <div>
                  <h3 className="font-semibold">
                    Auto Parking Updates
                  </h3>

                  <p className="text-sm text-slate-400">
                    Automatically refresh garage activity.
                  </p>
                </div>

                <div className="h-7 w-14 rounded-full bg-blue-600 p-1">
                  <div className="ml-auto h-5 w-5 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
import { Car, ShieldCheck, LayoutDashboard, Users, Zap, CheckCircle } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Car,
      title: "Smart Parking",
      text: "Real-time parking management for faster and easier vehicle access.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Access",
      text: "Organized user roles and safer garage operations.",
    },
    {
      icon: LayoutDashboard,
      title: "Admin Dashboard",
      text: "Clean control panel for admins, users, and service providers.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/30 px-4 py-2 text-blue-300 text-sm font-semibold">
              <Zap size={16} /> Smart Garage System
            </span>

            <h1 className="mt-6 text-5xl md:text-7xl font-extrabold leading-tight">
              About <span className="text-blue-400">RAKNAH</span>
            </h1>

            <p className="mt-6 text-slate-300 text-lg leading-8 max-w-xl">
              RAKNAH is a modern garage management platform designed to make
              parking smarter, faster, and more secure through digital
              monitoring, service provider integration, and powerful dashboards.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4 text-slate-200">
              <p className="flex items-center gap-2">
                <CheckCircle className="text-blue-400" size={20} />
                Easy parking control
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="text-blue-400" size={20} />
                Secure user access
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="text-blue-400" size={20} />
                Provider support
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="text-blue-400" size={20} />
                Modern dashboard
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="relative bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              <div className="grid gap-5">
                {features.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="bg-white/10 border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition"
                    >
                      <Icon className="text-blue-400 mb-4" size={34} />
                      <h2 className="text-2xl font-bold">{item.title}</h2>
                      <p className="text-slate-300 mt-2 leading-7">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-blue-600 p-8 text-center shadow-xl">
            <h3 className="text-4xl font-extrabold">24/7</h3>
            <p className="mt-2 text-blue-100">Garage Monitoring</p>
          </div>

          <div className="rounded-3xl bg-white/10 border border-white/10 p-8 text-center shadow-xl">
            <h3 className="text-4xl font-extrabold">3</h3>
            <p className="mt-2 text-slate-300">User Roles</p>
          </div>

          <div className="rounded-3xl bg-white/10 border border-white/10 p-8 text-center shadow-xl">
            <h3 className="text-4xl font-extrabold">AI</h3>
            <p className="mt-2 text-slate-300">Smart Vehicle Tracking</p>
          </div>
        </div>
      </section>
    </main>
  );
}
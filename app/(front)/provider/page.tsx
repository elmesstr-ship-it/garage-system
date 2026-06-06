import {
  Building2,
  BadgeCheck,
  Users,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Manage Garage",
    text: "Control parking spaces, availability, and garage operations easily.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Provider",
    text: "Build trust with users through a verified provider profile.",
  },
  {
    icon: Users,
    title: "Reach More Users",
    text: "Receive more parking requests and grow your garage business.",
  },
];

export default function ProviderPage() {
  return (
    <main className="min-h-screen px-6 py-16 text-white" style={{ background: "#060d1f" }}>

      {/* grid texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <section className="max-w-5xl mx-auto relative z-10 space-y-12">

        {/* header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-medium tracking-widest uppercase">
              Partners Program
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-black text-white leading-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Become a{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #60a5fa, #3b82f6)" }}
            >
              Service Provider
            </span>
          </h1>

          <p className="text-slate-400 text-base max-w-xl mx-auto leading-7">
            Join Smart Garage and manage your garage services through a modern
            dashboard built for providers.
          </p>
        </div>

        {/* feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className="group rounded-2xl border border-white/[0.07] p-6 hover:border-blue-500/30 transition-all duration-300 space-y-4"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Icon size={22} className="text-blue-400" />
                </div>
                <span className="text-slate-700 text-sm font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div>
                <h2
                  className="text-lg font-black text-white mb-1"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {title}
                </h2>
                <p className="text-slate-400 text-sm leading-6">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl border border-blue-500/20 p-8 md:p-10 text-center space-y-5"
          style={{ background: "rgba(59,130,246,0.05)", backdropFilter: "blur(20px)" }}
        >
          <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
            <ShieldCheck size={26} className="text-green-400" />
          </div>

          <div>
            <h2
              className="text-2xl md:text-3xl font-black text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Ready to join us?
            </h2>
            <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">
              Submit your provider request and start managing your garage smarter.
            </p>
          </div>

          <button
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
          >
            Apply Now
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </section>
    </main>
  );
}
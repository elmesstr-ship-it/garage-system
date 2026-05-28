import {
  Building2,
  BadgeCheck,
  Users,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function ProviderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-20 text-white">
      <section className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Become a{" "}
          <span className="text-blue-400">Service Provider</span>
        </h1>

        <p className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto leading-8">
          Join Smart Garage and manage your garage services through a modern
          dashboard built for providers.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {[
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
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:-translate-y-2 transition"
              >
                <div className="mx-auto mb-5 w-20 h-20 rounded-3xl bg-blue-500/20 flex items-center justify-center">
                  <Icon className="text-blue-400" size={42} />
                </div>

                <h2 className="text-2xl font-bold">
                  {item.title}
                </h2>

                <p className="text-slate-300 mt-4 leading-7">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          <ShieldCheck className="text-green-400 mx-auto mb-4" size={46} />

          <h2 className="text-3xl font-bold">
            Ready to join us?
          </h2>

          <p className="text-slate-300 mt-4">
            Submit your provider request and start managing your garage smarter.
          </p>

          <button className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-2xl font-semibold shadow-lg">
            Apply Now
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </main>
  );
}
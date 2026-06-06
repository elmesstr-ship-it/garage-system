import {
  Activity,
  BadgeCheck,
  Clock,
  Database,
  ShieldCheck,
  Zap,
  Sparkles,
  Car,
  CreditCard,
  LayoutDashboard,
  History,
  Radio,
  ArrowRight,
  Cpu,
} from "lucide-react";

const features = [
  {
    title: "Real-Time Slot Monitoring",
    desc: "Parking slot status updates instantly, allowing users to see available, reserved and occupied spaces without refreshing the page.",
    icon: Activity,
    tag: "Live",
  },
  {
    title: "Smart Booking System",
    desc: "Users can reserve available slots, add vehicle details and manage their parking process through a clean digital flow.",
    icon: BadgeCheck,
    tag: "Booking",
  },
  {
    title: "Automatic History Tracking",
    desc: "Completed and checked-out bookings are saved automatically, making it easy to review previous parking activity.",
    icon: History,
    tag: "History",
  },
  {
    title: "Cloud Firestore Database",
    desc: "Users, bookings, parking slots, active sessions and booking history are stored in a structured cloud database.",
    icon: Database,
    tag: "Database",
  },
  {
    title: "Admin Role Protection",
    desc: "Dashboard pages are protected and only users with admin role can access management tools and system analytics.",
    icon: ShieldCheck,
    tag: "Security",
  },
  {
    title: "Fast User Experience",
    desc: "Built with Next.js and modern UI components to provide smooth navigation, fast loading and responsive layouts.",
    icon: Zap,
    tag: "Performance",
  },
];

const stats = [
  { value: "24/7", label: "Live Monitoring" },
  { value: "Real-Time", label: "Slot Updates" },
  { value: "Admin", label: "Role Control" },
  { value: "Cloud", label: "Database System" },
];

const workflow = [
  {
    title: "Check Availability",
    desc: "User opens the parking map or status page to see live slot availability.",
    icon: Radio,
  },
  {
    title: "Book Slot",
    desc: "User selects an available slot and confirms the booking details.",
    icon: Car,
  },
  {
    title: "Manage Payment",
    desc: "System calculates parking cost based on selected plan or duration.",
    icon: CreditCard,
  },
  {
    title: "Admin Tracking",
    desc: "Admin monitors bookings, users, slots and system activity from dashboard.",
    icon: LayoutDashboard,
  },
];

export default function SmartFeaturesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060d1f] px-6 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      <div className="pointer-events-none absolute -left-40 top-16 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <section className="relative mx-auto max-w-7xl">
        <div className="mb-14 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-300">
              <Sparkles size={16} />
              Smart Garage Intelligence
            </div>

            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Intelligent Garage Management
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
              Smart Garage combines real-time parking monitoring, digital
              booking, automatic history tracking and protected admin control
              inside one modern web system.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/parking-map"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
              >
                View Parking Map
                <ArrowRight size={17} />
              </a>

              <a
                href="/booking"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white transition hover:border-blue-500/40 hover:bg-blue-500/10"
              >
                Start Booking
              </a>
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <div className="absolute -right-4 -top-4 rounded-2xl border border-blue-500/30 bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30">
              Live System
            </div>

            <div className="mb-6 flex items-center gap-4 rounded-3xl border border-blue-500/30 bg-blue-500/10 p-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white">
                <Cpu size={32} />
              </div>

              <div>
                <h2 className="text-xl font-black">System Core</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Firebase + Next.js powered garage workflow.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-black/20 p-5"
                >
                  <p className="text-2xl font-black text-blue-300">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-xl transition duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-blue-500/10"
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex h-15 w-15 items-center justify-center rounded-3xl bg-blue-600/20 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={30} />
                  </div>

                  <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                    {feature.tag}
                  </span>
                </div>

                <h2 className="text-xl font-black">{feature.title}</h2>

                <p className="mt-4 min-h-[112px] leading-7 text-slate-400">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl">
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
              System Workflow
            </p>
            <h2 className="text-3xl font-black md:text-4xl">
              How Smart Garage Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
              The system follows a smooth parking journey from checking
              availability to booking, payment and admin monitoring.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="relative rounded-3xl border border-white/10 bg-black/20 p-6"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
                      <Icon size={26} />
                    </div>

                    <span className="text-3xl font-black text-white/10">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-black">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-400">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
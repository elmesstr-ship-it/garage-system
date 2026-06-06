import {
  CheckCircle,
  Crown,
  Clock,
  Car,
  Sparkles,
  BadgePercent,
  ShieldCheck,
  Zap,
} from "lucide-react";

const plans = [
  {
    title: "Quick Stop",
    subtitle: "للزيارات السريعة",
    price: "20 EGP",
    period: "/ hour",
    oldPrice: "25 EGP",
    badge: "Most Flexible",
    discount: "Save 20%",
    desc: "Perfect for short visits, shopping, or quick appointments.",
    icon: Clock,
    highlight: false,
    features: [
      "20 EGP per hour",
      "Real-time slot availability",
      "Easy check-in and checkout",
      "Digital booking history",
    ],
  },
  {
    title: "Daily Pass",
    subtitle: "أفضل اختيار لليوم الكامل",
    price: "120 EGP",
    period: "/ day",
    oldPrice: "160 EGP",
    badge: "Best Value",
    discount: "Save 25%",
    desc: "A comfortable full-day plan for students, employees and long visits.",
    icon: Car,
    highlight: true,
    features: [
      "Full-day parking access",
      "Reserved parking slot",
      "Cheaper than hourly parking",
      "Priority availability during busy hours",
    ],
  },
  {
    title: "Premium Access",
    subtitle: "للاستخدام المتكرر",
    price: "650 EGP",
    period: "/ month",
    oldPrice: "850 EGP",
    badge: "Premium",
    discount: "Save 200 EGP",
    desc: "Designed for frequent users who need faster access and better parking experience.",
    icon: Crown,
    highlight: false,
    features: [
      "Monthly parking access",
      "Priority slot allocation",
      "Fast support",
      "Monthly usage report",
    ],
  },
];

const benefits = [
  {
    title: "No Hidden Fees",
    desc: "Clear pricing before booking.",
    icon: ShieldCheck,
  },
  {
    title: "Smart Discounts",
    desc: "Daily and monthly plans save more.",
    icon: BadgePercent,
  },
  {
    title: "Fast Booking",
    desc: "Reserve your slot in seconds.",
    icon: Zap,
  },
];

export default function PricingPage() {
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

      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <section className="relative mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-300">
            <Sparkles size={16} />
            Smart Garage Pricing
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Flexible Parking Plans
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            Choose the plan that fits your parking needs. Start with only{" "}
            <span className="font-bold text-blue-300">20 EGP per hour</span>,
            or save more with daily and monthly discounts.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.title}
                className={`relative rounded-[2rem] border p-7 shadow-2xl transition duration-300 hover:-translate-y-2 ${
                  plan.highlight
                    ? "border-blue-400/60 bg-blue-600/15 shadow-blue-600/20"
                    : "border-white/10 bg-white/[0.04] hover:border-blue-500/40 hover:bg-blue-500/10"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30">
                    Recommended
                  </div>
                )}

                <div className="mb-7 flex items-start justify-between gap-4">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-3xl ${
                      plan.highlight
                        ? "bg-blue-500 text-white"
                        : "bg-blue-600/20 text-blue-400"
                    }`}
                  >
                    <Icon size={30} />
                  </div>

                  <div className="text-right">
                    <p className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                      {plan.discount}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">{plan.badge}</p>
                  </div>
                </div>

                <p className="mb-2 text-sm font-semibold text-blue-300">
                  {plan.subtitle}
                </p>

                <h2 className="text-2xl font-black">{plan.title}</h2>

                <p className="mt-3 min-h-[56px] text-sm leading-7 text-slate-400">
                  {plan.desc}
                </p>

                <div className="my-7 rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black md:text-5xl">
                      {plan.price}
                    </span>
                    <span className="pb-2 text-sm text-slate-400">
                      {plan.period}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Instead of{" "}
                    <span className="text-slate-400 line-through">
                      {plan.oldPrice}
                    </span>
                  </p>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <CheckCircle
                        size={18}
                        className="shrink-0 text-blue-400"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-8 w-full rounded-2xl px-5 py-3 text-sm font-bold transition ${
                    plan.highlight
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-white/10 bg-white/[0.04] text-white hover:border-blue-500/40 hover:bg-blue-500/10"
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
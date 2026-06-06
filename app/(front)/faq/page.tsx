import {
  HelpCircle,
  CalendarCheck,
  History,
  Activity,
  ShieldCheck,
  LogOut,
  CreditCard,
  Clock,
  Car,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    title: "Booking",
    desc: "Everything about reserving and managing parking slots.",
    icon: CalendarCheck,
  },
  {
    title: "Real-Time System",
    desc: "Live updates for slots, bookings and garage activity.",
    icon: Activity,
  },
  {
    title: "Security",
    desc: "Role-based access and protected admin dashboard.",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    q: "How can I book a parking slot?",
    a: "Go to the Booking page, choose an available slot, enter your vehicle details, then confirm your booking. The system will save your reservation instantly.",
    icon: CalendarCheck,
    tag: "Booking",
  },
  {
    q: "Can I view my previous bookings?",
    a: "Yes. The History page shows your previous and completed bookings, including slot number, plate number, status, date and duration.",
    icon: History,
    tag: "History",
  },
  {
    q: "Does the system update parking slots in real time?",
    a: "Yes. The system uses Firebase Firestore to update parking slot status live, so users and admins can see the latest availability without refreshing manually.",
    icon: Activity,
    tag: "Live",
  },
  {
    q: "Who can access the Dashboard?",
    a: "Only users with the admin role can see and access the Dashboard. Normal users can use booking, history, pricing, FAQ and other public pages.",
    icon: ShieldCheck,
    tag: "Admin",
  },
  {
    q: "What happens after checkout?",
    a: "After checkout, the booking status changes to completed or checked out, the slot becomes available again, and the booking appears in the user's history.",
    icon: LogOut,
    tag: "Checkout",
  },
  {
    q: "How much does parking cost?",
    a: "The basic price is 20 EGP per hour. Users can also choose daily or monthly plans to save more compared to hourly parking.",
    icon: CreditCard,
    tag: "Pricing",
  },
  {
    q: "Can I reserve a slot for a full day?",
    a: "Yes. The Daily Pass is designed for users who need a parking slot for longer visits, work days or university hours.",
    icon: Clock,
    tag: "Daily Pass",
  },
  {
    q: "What if all parking slots are occupied?",
    a: "If all slots are occupied, users should wait until a slot becomes available. The Parking Status and Parking Map pages help users track availability live.",
    icon: Car,
    tag: "Slots",
  },
];

export default function FAQPage() {
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

      <div className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <section className="relative mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-300">
            <Sparkles size={16} />
            Smart Garage Help Center
          </div>

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-blue-500/30 bg-blue-600/20 text-blue-300 shadow-2xl shadow-blue-600/20">
            <HelpCircle size={40} />
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            Find clear answers about booking, parking slots, checkout, pricing,
            dashboard access and real-time garage updates.
          </p>
        </div>

        <div className="mb-12 grid gap-5 md:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-blue-500/10"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
                  <Icon size={28} />
                </div>

                <h2 className="text-xl font-black">{category.title}</h2>
                <p className="mt-3 leading-7 text-slate-400">
                  {category.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {faqs.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.q}
                className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-blue-500/10"
              >
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={26} />
                  </div>

                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-black leading-7 text-white">
                      {item.q}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-400">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-blue-500/30 bg-blue-600/10 p-8 shadow-2xl shadow-blue-600/10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <MessageCircle size={28} />
              </div>

              <h2 className="text-2xl font-black">
                Still have questions?
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                Smart Garage is designed to make parking easier, faster and more
                organized. You can check parking status, reserve a slot, and
                track your booking history from one place.
              </p>
            </div>

            <a
              href="/booking"
              className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
            >
              Start Booking
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
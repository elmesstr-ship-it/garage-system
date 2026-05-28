import {
  CalendarCheck,
  Car,
  Clock,
  MapPin,
  Plus,
  Search,
  CircleCheck,
  XCircle,
  Hourglass,
} from "lucide-react";

export default function BookingsPage() {
  const bookings = [
    {
      id: "BK-001",
      plate: "4821 FDS",
      owner: "Ahmed Mohamed",
      slot: "A1",
      date: "Today",
      time: "10:30 AM",
      status: "Confirmed",
    },
    {
      id: "BK-002",
      plate: "7742 KLM",
      owner: "Omar Ali",
      slot: "A4",
      date: "Today",
      time: "12:00 PM",
      status: "Pending",
    },
    {
      id: "BK-003",
      plate: "1935 XZT",
      owner: "Sara Khaled",
      slot: "A2",
      date: "Tomorrow",
      time: "08:45 PM",
      status: "Cancelled",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0b1020] px-10 py-8 text-white">
      <section className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold">
              Bookings
            </h1>

            <p className="mt-3 text-slate-400">
              Manage parking reservations for the 4 garage spots.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700">
            <Plus size={20} />
            New Booking
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <CalendarCheck className="text-blue-400" size={38} />
            <p className="mt-5 text-slate-400">Total Bookings</p>
            <h2 className="mt-2 text-4xl font-extrabold">3</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <CircleCheck className="text-green-400" size={38} />
            <p className="mt-5 text-slate-400">Confirmed</p>
            <h2 className="mt-2 text-4xl font-extrabold">1</h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <Hourglass className="text-yellow-400" size={38} />
            <p className="mt-5 text-slate-400">Pending</p>
            <h2 className="mt-2 text-4xl font-extrabold">1</h2>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5">
          <Search className="text-slate-400" />

          <input
            placeholder="Search booking by ID, plate, owner, or slot..."
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl">
          <div className="grid grid-cols-7 border-b border-white/10 pb-4 text-sm font-semibold text-slate-400">
            <span>Booking ID</span>
            <span>Plate</span>
            <span>Owner</span>
            <span>Slot</span>
            <span>Date</span>
            <span>Time</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-white/10">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="grid grid-cols-7 items-center py-5"
              >
                <span className="font-bold text-blue-300">
                  {booking.id}
                </span>

                <span className="flex items-center gap-2 font-semibold">
                  <Car size={18} className="text-blue-400" />
                  {booking.plate}
                </span>

                <span className="text-slate-300">
                  {booking.owner}
                </span>

                <span className="flex items-center gap-2 text-slate-300">
                  <MapPin size={17} className="text-blue-400" />
                  {booking.slot}
                </span>

                <span className="text-slate-300">
                  {booking.date}
                </span>

                <span className="flex items-center gap-2 text-slate-300">
                  <Clock size={17} className="text-blue-400" />
                  {booking.time}
                </span>

                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                    booking.status === "Confirmed"
                      ? "bg-green-500/15 text-green-300"
                      : booking.status === "Pending"
                      ? "bg-yellow-500/15 text-yellow-300"
                      : "bg-red-500/15 text-red-300"
                  }`}
                >
                  {booking.status === "Confirmed" ? (
                    <CircleCheck size={16} />
                  ) : booking.status === "Pending" ? (
                    <Hourglass size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}

                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
import { Car, Clock, CheckCircle, MapPin } from "lucide-react";

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-20 text-white">
      <section className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold">
            Parking <span className="text-blue-400">History</span>
          </h1>

          <p className="mt-4 text-lg text-slate-300">
            Track your previous parking activities and reservations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {[
            ["Main Garage", "Today - 10:30 AM"],
            ["City Center", "Yesterday - 07:15 PM"],
            ["Mall Parking", "May 20 - 02:00 PM"],
          ].map(([place, time]) => (
            <div
              key={place}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:-translate-y-2 transition"
            >
              <Car className="text-blue-400 mb-5" size={42} />

              <h2 className="text-2xl font-bold text-white">
                {place}
              </h2>

              <p className="flex gap-2 items-center text-slate-300 mt-4">
                <Clock size={18} /> {time}
              </p>

              <p className="flex gap-2 items-center text-green-400 mt-3">
                <CheckCircle size={18} /> Completed
              </p>

              <p className="flex gap-2 items-center text-slate-400 mt-3">
                <MapPin size={18} /> Smart Garage Zone
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
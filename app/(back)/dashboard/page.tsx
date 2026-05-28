import {
  Car,
  ParkingCircle,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const spots = [
    { id: "A1", status: "occupied", car: "BMW" },
    { id: "A2", status: "available", car: null },
    { id: "A3", status: "available", car: null },
    { id: "A4", status: "occupied", car: "Toyota" },
  ];

  const stats = [
    { title: "Total Slots", value: "4", icon: ParkingCircle, color: "text-blue-400" },
    { title: "Available", value: "2", icon: CheckCircle, color: "text-green-400" },
    { title: "Occupied", value: "2", icon: Car, color: "text-yellow-400" },
    { title: "Users", value: "24", icon: Users, color: "text-purple-400" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#0b1020] px-10 py-8 text-white">
      <section className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold">
              Smart Garage Dashboard
            </h1>
            <p className="mt-3 text-slate-400">
              Monitor the 4 parking spots, activity, and garage performance.
            </p>
          </div>

          <button className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold hover:bg-blue-700">
            Add Parking Slot
          </button>
        </div>

        <div className="mt-10 grid grid-cols-4 gap-6">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-xl"
              >
                <Icon className={item.color} size={42} />
                <p className="mt-6 text-slate-400">{item.title}</p>
                <h2 className="mt-2 text-5xl font-extrabold">{item.value}</h2>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-4 gap-6">
          <div className="col-span-3 rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Parking Spots</h2>
              <span className="text-slate-400">Live Status</span>
            </div>

            <div className="mt-8 grid grid-cols-4 gap-6">
              {spots.map((spot) => {
                const occupied = spot.status === "occupied";

                return (
                  <div
                    key={spot.id}
                    className={`rounded-3xl border p-8 ${
                      occupied
                        ? "border-yellow-400/30 bg-yellow-500/15 text-yellow-300"
                        : "border-green-400/30 bg-green-500/15 text-green-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-5xl font-extrabold">{spot.id}</h3>
                      <Car size={40} />
                    </div>

                    <p className="mt-8 text-xl font-bold">
                      {occupied ? "Occupied" : "Available"}
                    </p>

                    <p className="mt-2 text-sm opacity-80">
                      {occupied ? `Vehicle: ${spot.car}` : "Ready for booking"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-xl">
            <h2 className="text-3xl font-bold">Recent Activity</h2>

            <div className="mt-8 space-y-4">
              {[
                "BMW entered Slot A1",
                "Toyota reserved Slot A4",
                "Slot A2 is available",
                "Slot A3 is ready",
              ].map((activity) => (
                <div
                  key={activity}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 p-4"
                >
                  <Clock className="text-blue-400" size={20} />
                  <p className="text-slate-300">{activity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-xl">
            <TrendingUp className="text-blue-400" size={42} />
            <h2 className="mt-5 text-3xl font-bold">Occupancy Rate</h2>
            <p className="mt-3 text-slate-400">
              Current garage occupancy is 50% because 2 out of 4 spots are occupied.
            </p>

            <div className="mt-8 h-4 rounded-full bg-white/10">
              <div className="h-4 w-[50%] rounded-full bg-blue-500" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-xl">
            <AlertTriangle className="text-yellow-400" size={42} />
            <h2 className="mt-5 text-3xl font-bold">Alerts</h2>
            <p className="mt-3 text-slate-400">
              No critical alerts. All 4 parking spots are monitored successfully.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
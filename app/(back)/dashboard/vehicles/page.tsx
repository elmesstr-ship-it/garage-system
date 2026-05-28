import {
  Car,
  Search,
  Plus,
  CircleCheck,
  Clock,
} from "lucide-react";

export default function VehiclesPage() {
  const vehicles = [
    {
      plate: "4821 FDS",
      owner: "Ahmed Mohamed",
      model: "BMW X5",
      slot: "A1",
      status: "Parked",
    },
    {
      plate: "7742 KLM",
      owner: "Omar Ali",
      model: "Toyota Corolla",
      slot: "A4",
      status: "Parked",
    },
    {
      plate: "1935 XZT",
      owner: "Sara Khaled",
      model: "Mercedes C180",
      slot: "—",
      status: "Left",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0b1020] px-10 py-8 text-white">
      <section className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold">
              Vehicles
            </h1>

            <p className="mt-3 text-slate-400">
              Manage vehicles currently using the smart garage.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700">
            <Plus size={20} />
            Add Vehicle
          </button>
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5">
          <Search className="text-slate-400" />

          <input
            placeholder="Search by plate, owner, or vehicle model..."
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl">
          <div className="grid grid-cols-5 border-b border-white/10 pb-4 text-sm font-semibold text-slate-400">
            <span>Plate Number</span>
            <span>Owner</span>
            <span>Vehicle</span>
            <span>Slot</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-white/10">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.plate}
                className="grid grid-cols-5 items-center py-5"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-500/20 p-3">
                    <Car
                      className="text-blue-400"
                      size={22}
                    />
                  </div>

                  <span className="font-bold">
                    {vehicle.plate}
                  </span>
                </div>

                <span className="text-slate-300">
                  {vehicle.owner}
                </span>

                <span className="text-slate-300">
                  {vehicle.model}
                </span>

                <span className="text-slate-300">
                  {vehicle.slot}
                </span>

                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                    vehicle.status === "Parked"
                      ? "bg-green-500/15 text-green-300"
                      : "bg-yellow-500/15 text-yellow-300"
                  }`}
                >
                  {vehicle.status === "Parked" ? (
                    <CircleCheck size={16} />
                  ) : (
                    <Clock size={16} />
                  )}

                  {vehicle.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  Mail,
  Phone,
  UserCircle2,
} from "lucide-react";

export default function UsersPage() {
  const users = [
    {
      id: "USR-001",
      name: "Ahmed Mohamed",
      email: "ahmed@gmail.com",
      phone: "+20 109 225 8811",
      role: "Admin",
      vehicles: 2,
    },
    {
      id: "USR-002",
      name: "Omar Ali",
      email: "omar@gmail.com",
      phone: "+20 114 778 9922",
      role: "User",
      vehicles: 1,
    },
    {
      id: "USR-003",
      name: "Sara Khaled",
      email: "sara@gmail.com",
      phone: "+20 101 334 5512",
      role: "User",
      vehicles: 3,
    },
  ];

  return (
    <main className="min-h-screen bg-[#0b1020] px-10 py-8 text-white">
      <section className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold">
              Users
            </h1>

            <p className="mt-3 text-slate-400">
              Manage all registered smart garage users.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700">
            <Plus size={20} />
            Add User
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <Users className="text-blue-400" size={38} />

            <p className="mt-5 text-slate-400">
              Total Users
            </p>

            <h2 className="mt-2 text-4xl font-extrabold">
              3
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <ShieldCheck className="text-green-400" size={38} />

            <p className="mt-5 text-slate-400">
              Admins
            </p>

            <h2 className="mt-2 text-4xl font-extrabold">
              1
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <UserCircle2 className="text-purple-400" size={38} />

            <p className="mt-5 text-slate-400">
              Active Users
            </p>

            <h2 className="mt-2 text-4xl font-extrabold">
              3
            </h2>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5">
          <Search className="text-slate-400" />

          <input
            placeholder="Search by name, email, or phone..."
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl">
          <div className="grid grid-cols-6 border-b border-white/10 pb-4 text-sm font-semibold text-slate-400">
            <span>User</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Role</span>
            <span>Vehicles</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-white/10">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-6 items-center py-5"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-500/20 p-3">
                    <UserCircle2
                      className="text-blue-400"
                      size={22}
                    />
                  </div>

                  <div>
                    <p className="font-bold">
                      {user.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {user.id}
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-2 text-slate-300">
                  <Mail size={16} className="text-blue-400" />
                  {user.email}
                </span>

                <span className="flex items-center gap-2 text-slate-300">
                  <Phone size={16} className="text-blue-400" />
                  {user.phone}
                </span>

                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${
                    user.role === "Admin"
                      ? "bg-blue-500/15 text-blue-300"
                      : "bg-green-500/15 text-green-300"
                  }`}
                >
                  {user.role}
                </span>

                <span className="font-semibold text-slate-300">
                  {user.vehicles}
                </span>

                <span className="inline-flex w-fit rounded-full bg-green-500/15 px-3 py-1 text-sm font-semibold text-green-300">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
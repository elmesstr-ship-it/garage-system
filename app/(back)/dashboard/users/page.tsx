"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  Mail,
  Phone,
  UserCircle2,
  Loader2,
  Car,
} from "lucide-react";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";

type UserData = {
  id: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  vehicles?: number;
  vehicleBrand?: string;
  vehicleModel?: string;
  plateNumber?: string;
  status?: string;
  createdAt?: Timestamp;
};

function roleStyle(role?: string) {
  return role?.toLowerCase() === "admin"
    ? "bg-blue-500/15 text-blue-300 border-blue-400/20"
    : "bg-green-500/15 text-green-300 border-green-400/20";
}

function statusStyle(status?: string) {
  return status?.toLowerCase() === "blocked"
    ? "bg-red-500/15 text-red-300 border-red-400/20"
    : "bg-green-500/15 text-green-300 border-green-400/20";
}

function getVehiclesCount(user: UserData) {
  if (typeof user.vehicles === "number") return user.vehicles;
  if (user.plateNumber || user.vehicleBrand || user.vehicleModel) return 1;
  return 0;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserData[];

        data.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });

        setUsers(data);
        setLoading(false);
      },
      (error) => {
        console.error("USERS ERROR:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();
    if (!value) return users;

    return users.filter((user) => {
      const name = user.fullName || user.name || "";
      const email = user.email || "";
      const phone = user.phone || "";
      const role = user.role || "";
      const plate = user.plateNumber || "";
      const vehicle = `${user.vehicleBrand || ""} ${user.vehicleModel || ""}`;

      return (
        name.toLowerCase().includes(value) ||
        email.toLowerCase().includes(value) ||
        phone.toLowerCase().includes(value) ||
        role.toLowerCase().includes(value) ||
        plate.toLowerCase().includes(value) ||
        vehicle.toLowerCase().includes(value) ||
        user.id.toLowerCase().includes(value)
      );
    });
  }, [users, search]);

  const adminsCount = users.filter(
    (user) => user.role?.toLowerCase() === "admin"
  ).length;

  const activeUsersCount = users.filter(
    (user) => user.status?.toLowerCase() !== "blocked"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-xl">
          <Loader2 className="mx-auto animate-spin text-blue-400" size={38} />
          <h2 className="mt-4 text-xl font-bold text-white">Loading Users</h2>
          <p className="mt-2 text-sm text-slate-400">
            Reading users from Firestore
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Admin Users
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Users
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
            Manage all registered Smart Garage users from Firestore.
          </p>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 lg:w-auto">
          <Plus size={20} />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={<Users className="text-blue-400" size={32} />}
          title="Total Users"
          value={users.length}
        />

        <StatCard
          icon={<ShieldCheck className="text-green-400" size={32} />}
          title="Admins"
          value={adminsCount}
        />

        <StatCard
          icon={<UserCircle2 className="text-purple-400" size={32} />}
          title="Active Users"
          value={activeUsersCount}
        />
      </div>

      <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-xl backdrop-blur-xl">
        <Search className="text-slate-400" size={22} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, role, plate, or user ID..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.04] p-12 text-center">
          <Users className="mx-auto text-slate-500" size={48} />
          <h2 className="mt-4 text-xl font-bold text-white">No users found</h2>
          <p className="mt-2 text-sm text-slate-400">
            No matching users are available in users collection.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-xl backdrop-blur-xl xl:block">
            <table className="w-full table-fixed text-sm">
              <thead className="bg-white/10 text-slate-400">
                <tr>
                  <th className="w-[28%] px-6 py-4 text-left font-semibold">
                    User
                  </th>
                  <th className="w-[26%] px-6 py-4 text-left font-semibold">
                    Email
                  </th>
                  <th className="w-[17%] px-6 py-4 text-left font-semibold">
                    Phone
                  </th>
                  <th className="w-[11%] px-6 py-4 text-left font-semibold">
                    Role
                  </th>
                  <th className="w-[9%] px-6 py-4 text-left font-semibold">
                    Vehicles
                  </th>
                  <th className="w-[9%] px-6 py-4 text-left font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filteredUsers.map((user) => {
                  const name = user.fullName || user.name || "Unknown User";
                  const role = user.role || "user";
                  const status = user.status || "active";

                  return (
                    <tr key={user.id} className="transition hover:bg-white/10">
                      <td className="px-6 py-5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20">
                            <UserCircle2
                              className="text-blue-400"
                              size={24}
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-bold text-white">
                              {name}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex min-w-0 items-center gap-2 text-slate-300">
                          <Mail size={16} className="shrink-0 text-blue-400" />
                          <span className="truncate">{user.email || "-"}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex min-w-0 items-center gap-2 text-slate-300">
                          <Phone size={16} className="shrink-0 text-blue-400" />
                          <span className="truncate">{user.phone || "-"}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${roleStyle(
                            role
                          )}`}
                        >
                          {role}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="flex items-center gap-2 font-semibold text-slate-300">
                          <Car size={16} className="text-purple-400" />
                          {getVehiclesCount(user)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 xl:hidden">
            {filteredUsers.map((user) => {
              const name = user.fullName || user.name || "Unknown User";
              const role = user.role || "user";
              const status = user.status || "active";

              return (
                <div
                  key={user.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-2xl bg-blue-500/20 p-3">
                        <UserCircle2 className="text-blue-400" size={24} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-white">
                          {name}
                        </h3>
                        <p className="truncate text-xs text-slate-500">
                          {user.id}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${roleStyle(
                        role
                      )}`}
                    >
                      {role}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <p className="flex min-w-0 items-center gap-2 text-sm text-slate-300">
                      <Mail size={16} className="shrink-0 text-blue-400" />
                      <span className="truncate">{user.email || "-"}</span>
                    </p>

                    <p className="flex min-w-0 items-center gap-2 text-sm text-slate-300">
                      <Phone size={16} className="shrink-0 text-blue-400" />
                      <span className="truncate">{user.phone || "-"}</span>
                    </p>

                    <p className="flex items-center gap-2 text-sm text-slate-300">
                      <Car size={16} className="text-purple-400" />
                      Vehicles: {getVehiclesCount(user)}
                    </p>
                  </div>

                  <div className="mt-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
        {icon}
      </div>

      <p className="mt-5 text-sm text-slate-400">{title}</p>

      <h2 className="mt-2 text-4xl font-extrabold text-white">{value}</h2>
    </div>
  );
}
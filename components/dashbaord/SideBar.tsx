"use client";

import { useEffect, useState } from "react";
import {
  Car,
  CreditCard,
  Home,
  LogOut,
  Settings,
  TicketCheck,
  Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

type SidebarUser = {
  name?: string;
  email?: string;
  role?: string;
};

export default function Sidebar({ user = false }: { user?: boolean }) {
  const pathName = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<SidebarUser | null>(null);
  const [vehiclesCount, setVehiclesCount] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        router.push("/login");
        return;
      }

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setCurrentUser(userSnap.data() as SidebarUser);
        } else {
          setCurrentUser({
            name: firebaseUser.email?.split("@")[0] || "User",
            email: firebaseUser.email || "",
            role: "user",
          });
        }
      } catch (error) {
        console.error("SIDEBAR USER ERROR:", error);

        setCurrentUser({
          name: firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email || "",
          role: "user",
        });
      }
    });

    return () => unsub();
  }, [router]);

  async function handleLogout() {
    try {
      await signOut(auth);
      localStorage.removeItem("smart-user");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  }

  const name = currentUser?.name || "User";
  const role = currentUser?.role || "user";

  const initials =
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US";

  const sideBarLinks = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    {
      label: "Vehicles",
      href: "/dashboard/vehicles",
      icon: Car,
      badgeCount: vehiclesCount,
    },
    { label: "Bookings", href: "/dashboard/bookings", icon: TicketCheck },
    { label: "Users", href: "/dashboard/users", icon: Users },
    { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        .sg-sidebar {
          width: 240px;
          min-height: 100vh;
          background: #090d18;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          border-right: 0.5px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
          flex-shrink: 0;
        }

        .sg-sb-header {
          background: rgba(59,130,246,0.12);
          border: 0.5px solid rgba(59,130,246,0.2);
          border-radius: 10px;
          padding: 14px;
        }

        .sg-sb-header-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
        }

        .sg-sb-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 5px #3b82f6;
          flex-shrink: 0;
        }

        .sg-sb-brand {
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .sg-sb-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .sg-sb-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .sg-sb-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          color: rgba(255,255,255,0.45);
          font-size: 13px;
          font-weight: 400;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }

        .sg-sb-link:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.85);
        }

        .sg-sb-link.sg-active {
          background: #3b82f6;
          color: #fff;
        }

        .sg-sb-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .sg-sb-label {
          flex: 1;
        }

        .sg-sb-badge {
          background: rgba(255,255,255,0.2);
          color: #fff;
          font-size: 10px;
          font-weight: 500;
          padding: 2px 7px;
          border-radius: 999px;
          min-width: 20px;
          text-align: center;
          line-height: 1.6;
        }

        .sg-active .sg-sb-badge {
          background: rgba(255,255,255,0.25);
        }

        .sg-sb-footer {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 12px;
        }

        .sg-sb-avatar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .sg-sb-avatar-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(59,130,246,0.2);
          border: 0.5px solid rgba(59,130,246,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 500;
          color: #93c5fd;
          flex-shrink: 0;
        }

        .sg-sb-name {
          font-size: 13px;
          font-weight: 500;
          color: #fff;
          margin: 0;
          max-width: 130px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sg-sb-role {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          margin: 1px 0 0;
          text-transform: capitalize;
        }

        .sg-sb-logout {
          width: 100%;
          height: 34px;
          border-radius: 8px;
          border: 0.5px solid rgba(239,68,68,0.3);
          background: rgba(239,68,68,0.1);
          color: #fca5a5;
          font-size: 12px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.15s;
        }

        .sg-sb-logout:hover {
          background: rgba(239,68,68,0.18);
        }

        @media (max-width: 768px) {
          .sg-sidebar {
            display: none;
          }
        }
      `}</style>

      <aside className="sg-sidebar">
        <div className="sg-sb-header">
          <div className="sg-sb-header-top">
            <div className="sg-sb-dot" />
            <span className="sg-sb-brand">Smart Garage</span>
          </div>
          <div className="sg-sb-sub">
            {role === "admin" ? "Admin Control Panel" : "User Dashboard"}
          </div>
        </div>

        <nav className="sg-sb-nav">
          {sideBarLinks.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathName === item.href ||
              (item.href !== "/dashboard" &&
                pathName.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("sg-sb-link", isActive && "sg-active")}
              >
                <Icon className="sg-sb-icon" />
                <span className="sg-sb-label">{item.label}</span>

                {!!item.badgeCount && (
                  <span className="sg-sb-badge">{item.badgeCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="sg-sb-footer">
          <div className="sg-sb-avatar">
            <div className="sg-sb-avatar-circle">{initials}</div>
            <div>
              <p className="sg-sb-name">{name}</p>
              <p className="sg-sb-role">{role}</p>
            </div>
          </div>

          <button className="sg-sb-logout" onClick={handleLogout}>
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
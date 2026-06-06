"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  KeyRound,
  LayoutDashboard,
  LogOut,
  User,
  CheckCheck,
  Circle,
  Car,
  CreditCard,
  Info,
  Menu,
  DollarSign,
  HelpCircle,
  Map,
  Users,
  Sparkles,
  ChevronDown,
} from "lucide-react";

import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
  Timestamp,
  writeBatch,
  Unsubscribe,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CommandMenu } from "@/components/comman-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type HeaderUser = {
  uid?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
};

type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type?: "booking" | "payment" | "system";
  read: boolean;
  link?: string;
  createdAt?: Timestamp;
};

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/parking-status", label: "Parking Status" },
  { href: "/booking", label: "Booking" },
  { href: "/history", label: "History" },
];

const extraLinks = [
  { href: "/pricing", label: "Pricing", icon: DollarSign },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/parking-map", label: "Parking Map", icon: Map },
  { href: "/team", label: "Team", icon: Users },
  { href: "/smart-features", label: "Smart Features", icon: Sparkles },
];

function formatNotificationTime(createdAt?: Timestamp) {
  if (!createdAt?.toDate) return "Just now";

  const diff = Date.now() - createdAt.toDate().getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function getNotificationIcon(type?: string) {
  if (type === "booking") return Car;
  if (type === "payment") return CreditCard;
  return Info;
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<HeaderUser | null>(null);
  const [ready, setReady] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let unsubscribeNotifications: Unsubscribe | null = null;

    const cached = localStorage.getItem("smart-user");

    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        localStorage.removeItem("smart-user");
      }
    }

    setReady(true);

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
        unsubscribeNotifications = null;
      }

      if (!firebaseUser) {
        setUser(null);
        setNotifications([]);
        localStorage.removeItem("smart-user");
        return;
      }

      const fallbackUser: HeaderUser = {
        uid: firebaseUser.uid,
        name: firebaseUser.email?.split("@")[0] || "User",
        email: firebaseUser.email || "",
        image: firebaseUser.photoURL || "",
        role: "user",
      };

      setUser(fallbackUser);

      try {
        const userRef = doc(db, "users", firebaseUser.uid);

        const snap: any = await Promise.race([
          getDoc(userRef),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Firestore timeout")), 4000)
          ),
        ]);

        let userData = fallbackUser;

        if (snap.exists()) {
          const data = snap.data() as HeaderUser;

          userData = {
            uid: firebaseUser.uid,
            name: data.name || fallbackUser.name,
            email: data.email || fallbackUser.email,
            image: data.image || fallbackUser.image,
            role: data.role || "user",
          };
        }

        setUser(userData);
        localStorage.setItem("smart-user", JSON.stringify(userData));
      } catch (error) {
        console.warn("HEADER USER FALLBACK:", error);
        localStorage.setItem("smart-user", JSON.stringify(fallbackUser));
      }

      const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", firebaseUser.uid)
      );

      unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];

        data.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });

        setNotifications(data.slice(0, 8));
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeNotifications) unsubscribeNotifications();
    };
  }, []);

  async function handleLogout() {
    localStorage.removeItem("smart-user");
    await signOut(auth);
    setUser(null);
    setNotifications([]);
    router.push("/login");
    router.refresh();
  }

  async function markNotificationAsRead(notification: Notification) {
    if (!notification.read) {
      await updateDoc(doc(db, "notifications", notification.id), {
        read: true,
      });
    }

    if (notification.link) {
      router.push(notification.link);
    }
  }

  async function markAllAsRead() {
    const unread = notifications.filter((item) => !item.read);
    if (!unread.length) return;

    const batch = writeBatch(db);

    unread.forEach((item) => {
      batch.update(doc(db, "notifications", item.id), {
        read: true,
      });
    });

    await batch.commit();
  }

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "";
  const displayRole = user?.role || "user";
  const isAdmin = displayRole === "admin";

  const initials =
    displayName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US";

  const navLinkClass = (href: string) =>
    `rounded-xl px-3 py-2 text-sm font-medium transition ${
      pathname === href
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#060d1f]/95 px-3 text-white shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
            <Car size={22} />
          </div>

          <div className="hidden sm:block">
            <p className="text-base font-bold leading-5">Smart Garage</p>
            <p className="text-xs text-slate-500">Parking System</p>
          </div>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 xl:flex">
          {mainLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass(link.href)}>
              {link.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white">
                More
                <ChevronDown size={15} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 rounded-2xl border border-white/10 bg-[#101827] p-2 text-white shadow-2xl">
              {extraLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2"
                    >
                      <Icon size={16} />
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:block">
            <CommandMenu />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300 xl:hidden">
                <Menu size={20} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-64 rounded-2xl border border-white/10 bg-[#101827] p-2 text-white shadow-2xl"
            >
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2 bg-white/10" />

              {[...mainLinks, ...extraLinks].map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="cursor-pointer rounded-xl px-3 py-2">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}

              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {ready && user?.email && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300"
                >
                  <Bell size={18} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#060d1f] bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-[340px] rounded-2xl border border-white/10 bg-[#101827] p-2 text-white shadow-2xl"
              >
                <div className="flex items-center justify-between px-3 py-2">
                  <DropdownMenuLabel className="p-0 text-base font-bold">
                    Notifications
                  </DropdownMenuLabel>

                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                </div>

                <DropdownMenuSeparator className="my-2 bg-white/10" />

                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                      <Bell size={20} className="text-blue-400" />
                    </div>

                    <p className="text-sm font-semibold text-white">
                      No notifications yet
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Booking and payment updates will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[360px] space-y-1 overflow-y-auto pr-1">
                    {notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);

                      return (
                        <DropdownMenuItem
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification)}
                          className="cursor-pointer rounded-xl p-3 focus:bg-white/[0.06]"
                        >
                          <div className="flex w-full gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                              <Icon size={18} className="text-blue-400" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate text-sm font-semibold text-white">
                                  {notification.title}
                                </p>

                                {!notification.read && (
                                  <Circle
                                    size={8}
                                    className="mt-1 shrink-0 fill-blue-400 text-blue-400"
                                  />
                                )}
                              </div>

                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                                {notification.message}
                              </p>

                              <p className="mt-2 text-[11px] text-slate-500">
                                {formatNotificationTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {ready && user?.email ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-2 outline-none transition hover:border-blue-500/40 hover:bg-blue-500/10 sm:px-3"
                >
                  <Avatar className="h-9 w-9 border border-blue-400/50">
                    <AvatarImage src={user.image || ""} alt={displayName} />
                    <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="hidden text-left lg:block">
                    <p className="text-sm font-semibold text-white">{displayName}</p>
                    <p className="text-xs text-slate-500 capitalize">
                      {displayRole} Account
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 rounded-2xl border border-white/10 bg-[#101827] p-2 text-white shadow-2xl"
              >
                <DropdownMenuLabel className="space-y-1 rounded-xl bg-white/[0.04] p-3 text-center">
                  <p className="font-semibold">{displayName}</p>
                  <p className="text-xs font-normal text-slate-400">{displayEmail}</p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-2 bg-white/10" />

                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                </DropdownMenuItem>

                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="my-2 bg-white/10" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded-xl px-3 py-2 text-red-400 focus:text-red-400"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="rounded-2xl bg-blue-600 px-4 text-white hover:bg-blue-700 sm:px-5"
            >
              <Link href="/login">
                <KeyRound className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CommandMenu } from "@/components/comman-menu";
import MainNav from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import ModeToggle from "@/components/ModeToggle";

import { Button } from "@/components/ui/button";
import { KeyRound, LayoutDashboard, LogOut } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type UserData = {
  id: number;
  name: string;
  email: string;
};

export function SiteHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("smart-user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("smart-user");
    setUser(null);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-[#081028]/90">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <MainNav />
          <MobileNav />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <CommandMenu />
          </div>

          <nav className="flex items-center gap-3">
            {user?.email ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none ring-0">
                    <Avatar className="h-10 w-10 cursor-pointer border-2 border-blue-500 shadow-md transition hover:scale-105">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt={user.name}
                      />

                      <AvatarFallback>
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-white/10 dark:bg-[#111827] dark:text-white"
                >
                  <DropdownMenuLabel className="flex flex-col items-center py-4">
                    <Avatar className="mb-3 h-16 w-16 border border-slate-200 dark:border-white/10">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt={user.name}
                      />

                      <AvatarFallback>
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <span className="text-lg font-bold">
                      {user.name}
                    </span>

                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-white/10" />

                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex cursor-pointer items-center gap-2 rounded-xl text-slate-700 focus:bg-slate-100 dark:text-slate-200 dark:focus:bg-white/10"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-white/10" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer rounded-xl text-red-500 focus:bg-red-500/10 focus:text-red-500"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="rounded-xl bg-blue-600 px-5 text-white shadow-md hover:bg-blue-700"
              >
                <Link href="/login">
                  <KeyRound className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}

            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
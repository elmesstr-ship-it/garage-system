"use client";

import * as React from "react";
import {
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="
            relative
            h-10
            w-10
            rounded-xl
            border-white/10
            bg-white/[0.06]
            backdrop-blur-xl
            hover:bg-white/[0.12]
          "
        >
          <Sun
            className="
              h-5 w-5
              rotate-0 scale-100
              text-yellow-400
              transition-all
              dark:-rotate-90 dark:scale-0
            "
          />

          <Moon
            className="
              absolute
              h-5 w-5
              rotate-90 scale-0
              text-blue-400
              transition-all
              dark:rotate-0 dark:scale-100
            "
          />

          <span className="sr-only">
            Toggle theme
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
          w-44
          rounded-2xl
          border-white/10
          bg-[#111827]
          p-2
          text-white
          shadow-2xl
        "
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`
            flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2
            hover:bg-white/10
            ${
              theme === "light"
                ? "bg-white/10"
                : ""
            }
          `}
        >
          <Sun
            size={18}
            className="text-yellow-400"
          />

          Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`
            flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2
            hover:bg-white/10
            ${
              theme === "dark"
                ? "bg-white/10"
                : ""
            }
          `}
        >
          <Moon
            size={18}
            className="text-blue-400"
          />

          Dark
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`
            flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2
            hover:bg-white/10
            ${
              theme === "system"
                ? "bg-white/10"
                : ""
            }
          `}
        >
          <Monitor
            size={18}
            className="text-green-400"
          />

          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
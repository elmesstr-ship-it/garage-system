import { MainNavItem } from "@/types/nav";

export interface DocsConfig {
  mainNav: MainNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "History",
      href: "/history",
    },
    {
      title: "Profile",
      href: "/profile",
    },
    {
      title: "Contact",
      href: "/contact",
    },
    {
      title: "Be Services Provider",
      href: "/provider",
    },
  ],
};
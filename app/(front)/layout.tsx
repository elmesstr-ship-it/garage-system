// import Footer from "@/components/Frontend/Footer";
import { SiteHeader } from "@/components/SiteHeader";
// import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
// import 'leaflet/dist/leaflet.css';
// import MegaMenu from "@/components/Frontend/MegaMenu";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const session = await getServerSession(authOptions);
  return (
    <div className="">
      <SiteHeader />
      <div>{children}</div>

      {/* <SiteFooter /> */}
      {/* <Footer /> */}
    </div>
  );
}

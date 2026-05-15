"use client";

import { useState } from "react";
import { Sidebar, SidebarData } from "./sidebar";
import { TopBar } from "./top-bar";

export function DashboardLayoutClient({ children, sidebarProps }: { children: React.ReactNode, sidebarProps: SidebarData }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar onOpenMobile={() => setMobileOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} data={sidebarProps} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

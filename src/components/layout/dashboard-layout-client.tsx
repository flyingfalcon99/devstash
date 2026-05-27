"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar, SidebarData } from "./sidebar";
import { TopBar } from "./top-bar";
import { CommandPalette } from "@/components/features/search/command-palette";
import { EditorPreferencesProvider } from "@/context/editor-preferences-context";
import { ItemDrawerProvider, useItemDrawer } from "@/context/item-drawer-context";
import type { SearchData } from "@/lib/db/search";
import type { EditorPreferences } from "@/lib/editor-preferences";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  sidebarProps: SidebarData;
  searchData: SearchData;
  editorPreferences: EditorPreferences;
}

function DashboardLayoutInner({ children, sidebarProps, searchData }: Omit<DashboardLayoutClientProps, "editorPreferences">) {
  const { openItem } = useItemDrawer();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar onOpenMobile={() => setMobileOpen(true)} onOpenPalette={openPalette} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} data={sidebarProps} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        items={searchData.items}
        collections={searchData.collections}
        onSelectItem={openItem}
      />
    </div>
  );
}

export function DashboardLayoutClient({ children, sidebarProps, searchData, editorPreferences }: DashboardLayoutClientProps) {
  return (
    <EditorPreferencesProvider initialPrefs={editorPreferences}>
      <ItemDrawerProvider>
        <DashboardLayoutInner sidebarProps={sidebarProps} searchData={searchData}>
          {children}
        </DashboardLayoutInner>
      </ItemDrawerProvider>
    </EditorPreferencesProvider>
  );
}

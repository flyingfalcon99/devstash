"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
  Star,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Folder
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const iconMap = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
} as const;

export interface SidebarData {
  user: { name: string; email: string };
  itemTypes: Array<{ id: string; name: string; icon: string; color: string; count: number }>;
  favoriteCollections: Array<{ id: string; name: string }>;
  recentCollections: Array<{ id: string; name: string; itemCount: number; color: string }>;
}

interface SidebarContentProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  data: SidebarData;
}

function SidebarContent({ onClose, isCollapsed, data }: SidebarContentProps) {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);

  const userInitials = data.user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {/* Types */}
        <div>
          {!isCollapsed && (
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1">
              Types
            </p>
          )}
          <nav className="space-y-0.5">
            {data.itemTypes.map((type) => {
              const Icon = iconMap[type.icon as keyof typeof iconMap];
              return (
                <Link
                  key={type.id}
                  href={`/items/${type.name}s`}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                    isCollapsed ? "justify-center" : "justify-between"
                  )}
                  title={isCollapsed ? `${type.name}s` : undefined}
                >
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
                    )}
                    {!isCollapsed && <span className="capitalize">{type.name}s</span>}
                    {!isCollapsed && (type.name === "File" || type.name === "Image") && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-medium">Pro</Badge>
                    )}
                  </div>
                  {!isCollapsed && <span className="text-xs">{type.count}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Collections */}
        <div>
          <button
            onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
            className={cn(
              "flex items-center w-full px-2 mb-1 group",
              isCollapsed ? "justify-center" : "justify-between"
            )}
            title={isCollapsed ? "Collections" : undefined}
          >
            {isCollapsed ? (
              <Folder className="h-4 w-4 text-muted-foreground" />
            ) : (
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Collections
              </p>
            )}
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  "h-3 w-3 text-muted-foreground transition-transform duration-200",
                  !isCollectionsOpen && "-rotate-90"
                )}
              />
            )}
          </button>

          {isCollectionsOpen && (
            <div className="space-y-3 mt-1">
              {data.favoriteCollections.length > 0 && (
                <div>
                  {!isCollapsed && <p className="text-xs text-muted-foreground px-2 mb-1">Favorites</p>}
                  <nav className="space-y-0.5">
                    {data.favoriteCollections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        onClick={onClose}
                        className={cn(
                          "flex items-center px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                          isCollapsed ? "justify-center" : "gap-2"
                        )}
                        title={isCollapsed ? col.name : undefined}
                      >
                        <Star className="h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400" />
                        {!isCollapsed && <span className="truncate">{col.name}</span>}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}

              <div>
                {!isCollapsed && <p className="text-xs text-muted-foreground px-2 mb-1">All Collections</p>}
                <nav className="space-y-0.5">
                  {data.recentCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      onClick={onClose}
                      className={cn(
                        "flex items-center px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                        isCollapsed ? "justify-center" : "justify-between"
                      )}
                      title={isCollapsed ? col.name : undefined}
                    >
                      {isCollapsed ? (
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                      ) : (
                        <>
                          <div className="flex items-center gap-2 truncate">
                            <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                            <span className="truncate">{col.name}</span>
                          </div>
                          <span className="text-xs shrink-0">{col.itemCount}</span>
                        </>
                      )}
                    </Link>
                  ))}
                </nav>
                {!isCollapsed && (
                  <div className="mt-4 px-2">
                    <Link
                      href="/collections"
                      onClick={onClose}
                      className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
                    >
                      View all collections
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User area */}
      <div className="border-t border-border p-3 shrink-0">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-2")}>
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="text-xs bg-muted">{userInitials}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{data.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{data.user.email}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  data: SidebarData;
}

export function Sidebar({ mobileOpen, onMobileClose, data }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
          isOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex items-center justify-between px-3 py-3 border-b border-border shrink-0">
          {isOpen && (
            <span className="text-xs font-semibold text-muted-foreground px-1">Menu</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 shrink-0", !isOpen && "mx-auto")}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
        </div>
        <SidebarContent isCollapsed={!isOpen} data={data} />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex items-center justify-between px-3 py-3 border-b border-border shrink-0">
            <span className="text-xs font-semibold text-muted-foreground px-1">Menu</span>
          </div>
          <SidebarContent onClose={onMobileClose} isCollapsed={false} data={data} />
        </SheetContent>
      </Sheet>
    </>
  );
}

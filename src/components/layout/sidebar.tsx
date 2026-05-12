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
import { itemTypes, itemTypeCounts, collections, currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const iconMap = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
} as const;

const favoriteCollections = collections.filter((c) => c.isFavorite);
const recentCollections = collections.filter((c) => !c.isFavorite);

const userInitials = currentUser.name
  .split(" ")
  .map((n) => n[0])
  .join("");

interface SidebarContentProps {
  onClose?: () => void;
  isCollapsed?: boolean;
}

function SidebarContent({ onClose, isCollapsed }: SidebarContentProps) {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(true);

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
            {itemTypes.map((type) => {
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
                  </div>
                  {!isCollapsed && <span className="text-xs">{itemTypeCounts[type.name]}</span>}
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
              {favoriteCollections.length > 0 && (
                <div>
                  {!isCollapsed && <p className="text-xs text-muted-foreground px-2 mb-1">Favorites</p>}
                  <nav className="space-y-0.5">
                    {favoriteCollections.map((col) => (
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
                  {recentCollections.map((col) => (
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
                        <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <>
                          <span className="truncate">{col.name}</span>
                          <span className="text-xs">{col.itemCount}</span>
                        </>
                      )}
                    </Link>
                  ))}
                </nav>
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
                <p className="text-xs font-medium truncate">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
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
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
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
        <SidebarContent isCollapsed={!isOpen} />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex items-center justify-between px-3 py-3 border-b border-border shrink-0">
            <span className="text-xs font-semibold text-muted-foreground px-1">Menu</span>
          </div>
          <SidebarContent onClose={onMobileClose} isCollapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  );
}

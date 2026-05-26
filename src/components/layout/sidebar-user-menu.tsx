"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarUserMenuProps {
  user: { name: string; email: string; image?: string | null };
  isCollapsed?: boolean;
  initials: string;
}

export function SidebarUserMenu({ user, isCollapsed, initials }: SidebarUserMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="border-t border-border p-3 shrink-0">
      <div ref={dropdownRef} className="relative">
        {dropdownOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1 rounded-md border border-border bg-background shadow-md py-1 z-50">
            <Link
              href="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <User className="h-4 w-4 shrink-0" />
              Profile
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted/50 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </div>
        )}

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={cn(
            "flex items-center w-full rounded-md hover:bg-muted/50 transition-colors p-1",
            isCollapsed ? "justify-center" : "gap-2"
          )}
        >
          <Avatar className="h-7 w-7 shrink-0">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User avatar"}
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
            ) : (
              <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
            )}
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          {!isCollapsed && (
            <Settings className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
}

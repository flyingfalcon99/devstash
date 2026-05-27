"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarUserMenuProps {
  user: { name: string; email: string; image?: string | null };
  isCollapsed?: boolean;
  initials: string;
}

export function SidebarUserMenu({ user, isCollapsed, initials }: SidebarUserMenuProps) {
  return (
    <div className="border-t border-border p-3 shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="User menu"
          className={cn(
            "flex items-center w-full rounded-md hover:bg-muted/50 transition-colors p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring",
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
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-48">
          <DropdownMenuItem render={<Link href="/profile" />} className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/settings" />} className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

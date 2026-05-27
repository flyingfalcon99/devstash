import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getDashboardStats } from "@/lib/db/collections";
import { getSidebarItemTypes } from "@/lib/db/items";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { itemTypeIconMap } from "@/lib/constants/item-types";
import { Mail, CalendarDays, Layers, Box } from "lucide-react";

function getInitials(name?: string | null, email?: string | null) {
  const source = name ?? email ?? "?";
  return source
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;

  const [user, oauthAccount, stats, itemTypes] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, createdAt: true },
    }),
    prisma.account.findFirst({
      where: { userId },
      select: { provider: true },
    }),
    getDashboardStats(userId),
    getSidebarItemTypes(userId),
  ]);

  if (!user) redirect("/sign-in");

  const initials = getInitials(user.name, user.email);
  const accountType = oauthAccount
    ? oauthAccount.provider.charAt(0).toUpperCase() + oauthAccount.provider.slice(1)
    : "Email";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">View your account information and usage.</p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar + name + account type */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "Avatar"} />
              <AvatarFallback className="text-xl bg-muted">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              {user.name && <p className="font-semibold text-base">{user.name}</p>}
              <p className="text-xs text-muted-foreground">{accountType} account</p>
            </div>
          </div>

          {/* Email and member since */}
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span>
                <span className="font-medium text-foreground">Email:</span>{" "}
                {user.email}
              </span>
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              <span>
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usage Statistics</CardTitle>
          <CardDescription>Your DevStash at a glance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Box className="h-4 w-4 shrink-0" />
                <p className="text-sm">Total items</p>
              </div>
              <p className="text-base font-semibold">{stats.totalItems}</p>
            </div>
            <div className="rounded-lg border border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Layers className="h-4 w-4 shrink-0" />
                <p className="text-sm">Collections</p>
              </div>
              <p className="text-base font-semibold">{stats.totalCollections}</p>
            </div>
          </div>

          {/* Items by type */}
          {itemTypes.some((t) => t.count > 0) && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Items by Type</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {itemTypes.filter((t) => t.count > 0).map((type) => {
                  const Icon = itemTypeIconMap[type.icon as keyof typeof itemTypeIconMap];
                  return (
                    <div
                      key={type.id}
                      className="rounded-lg border border-border p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5">
                        {Icon && <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: type.color }} />}
                        <span className="text-xs capitalize text-muted-foreground">{type.name}s</span>
                      </div>
                      <span className="text-sm font-semibold">{type.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

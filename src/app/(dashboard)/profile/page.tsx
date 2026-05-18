import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getDashboardStats } from "@/lib/db/collections";
import { getSidebarItemTypes } from "@/lib/db/items";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChangePasswordForm } from "@/components/features/profile/change-password-form";
import { DeleteAccountButton } from "@/components/features/profile/delete-account-button";
import { itemTypeIconMap } from "@/lib/constants/item-types";

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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/sign-in");

  const [stats, itemTypes] = await Promise.all([
    getDashboardStats(user.id),
    getSidebarItemTypes(user.id),
  ]);

  const isCredentialsUser = !!user.password;
  const initials = getInitials(user.name, user.email);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Avatar"}
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
            ) : (
              <AvatarFallback className="text-lg bg-muted">{initials}</AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-1">
            {user.name && <p className="font-medium">{user.name}</p>}
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usage</CardTitle>
          <CardDescription>Your DevStash at a glance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4 space-y-1">
              <p className="text-2xl font-bold">{stats.totalItems}</p>
              <p className="text-sm text-muted-foreground">Total items</p>
            </div>
            <div className="rounded-lg border border-border p-4 space-y-1">
              <p className="text-2xl font-bold">{stats.totalCollections}</p>
              <p className="text-sm text-muted-foreground">Collections</p>
            </div>
          </div>

          {/* Item type breakdown */}
          <div className="space-y-2">
            {itemTypes.filter((t) => t.count > 0).map((type) => {
              const Icon = itemTypeIconMap[type.icon as keyof typeof itemTypeIconMap];
              return (
                <div key={type.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />}
                    <span className="capitalize text-muted-foreground">{type.name}s</span>
                  </div>
                  <span className="font-medium">{type.count}</span>
                </div>
              );
            })}
            {itemTypes.every((t) => t.count === 0) && (
              <p className="text-sm text-muted-foreground">No items yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Change Password — credentials users only */}
      {isCredentialsUser && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Change Password</CardTitle>
            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  );
}

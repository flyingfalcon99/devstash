"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const res = await fetch("/api/profile", { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Failed to delete account.");
      setLoading(false);
      setConfirming(false);
      return;
    }

    await signOut({ callbackUrl: "/sign-in" });
  }

  if (confirming) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Are you sure? This will permanently delete your account and all your data. This cannot be undone.
        </p>
        <div className="flex gap-2">
          <Button variant="destructive" disabled={loading} onClick={handleDelete}>
            {loading ? "Deleting…" : "Yes, delete my account"}
          </Button>
          <Button variant="outline" disabled={loading} onClick={() => setConfirming(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button variant="destructive" onClick={() => setConfirming(true)}>
      Delete account
    </Button>
  );
}

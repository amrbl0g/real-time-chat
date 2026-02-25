"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const session = authClient.useSession();

  useEffect(() => {
    if (!session.isPending && !session.data) {
      router.replace("/sign-in");
    }
  }, [session.data, session.isPending, router]);

  if (session.isPending || !session.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Loading...</p>
      </div>
    );
  }

  const { user } = session.data;
  const initial =
    (user.name && user.name.charAt(0).toUpperCase()) ||
    (user.email && user.email.charAt(0).toUpperCase()) ||
    "?";

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700">
            {initial}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">
              {user.name ?? "No name"}
            </span>
            <span className="text-xs text-slate-500">{user.email}</span>
          </div>
        </div>
        <Button type="button" onClick={() => void handleSignOut()}>
          Sign out
        </Button>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        <p className="text-sm text-slate-500">
          Real-time chat UI will go here.
        </p>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignInPage = () => {
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { error: signUpError } = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: "/",
        });

        if (signUpError) {
          setError(signUpError.message ?? "Failed to sign up.");
          return;
        }
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        });

        if (signInError) {
          setError(signInError.message ?? "Failed to sign in.");
          return;
        }
      }

      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "github" | "google") => {
    setLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">
          {mode === "signin" ? "Sign in" : "Create an account"}
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Use email & password or continue with Google or GitHub.
        </p>

        <form className="space-y-4" onSubmit={handleEmailAuth}>
          {mode === "signup" && (
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                value={name}
                id="name"
                onChange={(event) => setName(event.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              value={email}
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              value={password}
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="mt-1 w-full">
            {loading
              ? "Please wait..."
              : mode === "signin"
                ? "Sign in with email"
                : "Sign up with email"}
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs uppercase tracking-wide text-slate-500">
              Or continue with
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              disabled={loading}
              onClick={() => void handleSocialSignIn("google")}
              className="flex-1 border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
            >
              Continue with Google
            </Button>
            <Button
              type="button"
              disabled={loading}
              onClick={() => void handleSocialSignIn("github")}
              className="flex-1 border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
            >
              Continue with GitHub
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() =>
              setMode((current) => (current === "signin" ? "signup" : "signin"))
            }
            className="font-medium text-slate-900 hover:text-slate-700"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Loader2, LogIn, UserPlus, ArrowLeft, Hexagon } from "lucide-react";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Mode = "signIn" | "signUp";

export default function Auth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const mode = (params.get("mode") === "signUp" ? "signUp" : "signIn") as Mode;
  const returnTo = params.get("returnTo") || "/dashboard";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) navigate(returnTo, { replace: true });
  }, [isAuthenticated, navigate, returnTo]);

  const setMode = (next: Mode) => {
    params.set("mode", next);
    setParams(params, { replace: true });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    try {
      await signIn(
        "password",
        mode === "signUp"
          ? { flow: "signUp", email, password, name: String(formData.get("name") ?? "") }
          : { flow: "signIn", email, password }
      );
      navigate(returnTo, { replace: true });
    } catch {
      setError("Couldn't sign you in. Check the email/password and try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (isAuthenticated) return <Navigate to={returnTo} replace />;

  const isSignUp = mode === "signUp";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="grid-backdrop radial-fade pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[380px] w-[640px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="border-border/80 bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur">
          <CardHeader className="items-center text-center">
            <Logo className="mb-2 h-10 w-10" />
            <CardTitle className="text-xl">
              {isSignUp ? "Create your OpenForge account" : "Welcome back"}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "Fork the future — set up your account in seconds."
                : "Sign in to your OpenForge playground."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" name="name" type="text" placeholder="Ada Lovelace" required />
                </div>
              )}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  minLength={8}
                  required
                />
                {isSignUp && (
                  <p className="text-xs text-muted-foreground">At least 8 characters.</p>
                )}
              </div>

              {error && (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" size="lg">
                {isSignUp ? (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create account
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signIn")}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New to OpenForge?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signUp")}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Create an account
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Hexagon className="h-3 w-3 text-primary/60" />
          OpenForge · Apache-2.0 · Your data stays in your Convex deployment
        </p>
      </div>
    </div>
  );
}

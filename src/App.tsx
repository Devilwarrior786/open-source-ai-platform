import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import type { ReactNode } from "react";

import Landing from "@/routes/Landing";
import Auth from "@/routes/Auth";
import Dashboard from "@/routes/Dashboard";
import BackendRequired from "@/components/BackendRequired";
import Logo from "@/components/Logo";

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Logo className="h-10 w-10 animate-pulse" />
    </div>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const location = useLocation();
  if (isLoading) return <FullPageSpinner />;
  if (!isAuthenticated)
    return <Navigate to={`/auth?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  return <>{children}</>;
}

export default function App({ backendConnected = true }: { backendConnected?: boolean }) {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/auth"
        element={backendConnected ? <Auth /> : <BackendRequired />}
      />
      <Route
        path="/dashboard"
        element={
          backendConnected ? (
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          ) : (
            <BackendRequired />
          )
        }
      />
      <Route
        path="/dashboard/:threadId"
        element={
          backendConnected ? (
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          ) : (
            <BackendRequired />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

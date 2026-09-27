import { Link } from "react-router-dom";
import { PlugZap } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function BackendRequired() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <Logo className="h-12 w-12" />
      <div className="max-w-md space-y-2">
        <h1 className="flex items-center justify-center gap-2 text-xl font-semibold">
          <PlugZap className="h-5 w-5 text-primary" />
          Backend not connected yet
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The Convex deployment URL (<code className="font-mono text-xs text-primary">VITE_CONVEX_URL</code>)
          isn&apos;t set in this environment. Once the backend is linked, authentication and the
          chat playground will light up automatically. The landing page works without it.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}

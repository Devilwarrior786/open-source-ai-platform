import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Github,
  Terminal,
  Zap,
  ShieldCheck,
  GitBranch,
  Database,
  Sparkles,
} from "lucide-react";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Terminal,
    title: "Chat playground",
    description:
      "Talk to open-weight models in realtime. Threads and messages persist in Convex and sync instantly across tabs.",
  },
  {
    icon: Database,
    title: "Realtime backend",
    description:
      "Convex functions and a reactive database handle auth, storage, and AI orchestration — zero servers to run.",
  },
  {
    icon: ShieldCheck,
    title: "Own your auth",
    description:
      "Email + password sign-in built on Convex Auth. Your users, your database, no vendor lock-in.",
  },
  {
    icon: GitBranch,
    title: "Open source, Apache-2.0",
    description:
      "Fork it, extend it, ship it. Every layer is inspectable and modifiable — from the UI to the model calls.",
  },
];

const stack = [
  { name: "React 18", icon: Zap },
  { name: "Vite", icon: Zap },
  { name: "Convex", icon: Database },
  { name: "Tailwind CSS", icon: Sparkles },
  { name: "Mistral AI", icon: Terminal },
  { name: "TypeScript", icon: ShieldCheck },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Backdrop */}
      <div className="grid-backdrop radial-fade pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

      {/* Nav */}
      <header className="relative z-10 border-b border-border/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight">
              Open<span className="text-primary">Forge</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://github.com/Devilwarrior786/open-source-ai-platform"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <motion.section
          className="container flex flex-col items-center pb-20 pt-24 text-center md:pt-32"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.div variants={item}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Apache-2.0 · Open weights · Self-hostable
            </div>
          </motion.div>

          <motion.h1
            variants={item}
            className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl"
          >
            The open-source platform for <span className="text-gradient">building with AI</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            A chat playground over open-weight models, a realtime Convex backend, and auth you own.
            Fork it, wire in your keys, and ship your own AI product today.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/auth">
                Launch the playground
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://github.com/Devilwarrior786/open-source-ai-platform"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" />
                Star on GitHub
              </a>
            </Button>
          </motion.div>

          {/* Terminal mock */}
          <motion.div variants={item} className="mt-16 w-full max-w-3xl">
            <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur">
              <div className="flex items-center gap-2 border-b border-border/70 bg-muted/40 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">openforge — chat.ts</span>
              </div>
              <div className="space-y-2 p-5 font-mono text-sm leading-relaxed">
                <p><span className="text-primary">you</span> <span className="text-muted-foreground">›</span> summarize this thread in 3 bullets</p>
                <p><span className="text-accent">forge</span> <span className="text-muted-foreground">›</span> <span className="text-foreground/90">• Realtime sync via Convex subscriptions</span></p>
                <p><span className="text-accent">forge</span> <span className="text-muted-foreground">›</span> <span className="text-foreground/90">• Open-weight model, your own API key</span></p>
                <p>
                  <span className="text-accent">forge</span> <span className="text-muted-foreground">›</span>{" "}
                  <span className="text-foreground/90">• Self-hostable, Apache-2.0 licensed</span>
                  <span className="ml-1 inline-block h-4 w-2 animate-caret-blink bg-primary align-middle" />
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stack strip */}
          <motion.div variants={item} className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {stack.map(({ name, icon: Icon }) => (
              <span
                key={name}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-4 w-4 text-primary/70" />
                {name}
              </span>
            ))}
          </motion.div>
        </motion.section>

        {/* Features */}
        <section id="features" className="container py-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={container}
          >
            <motion.div variants={item} className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Everything you need, <span className="text-gradient">nothing you don&apos;t</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                A complete, minimal foundation for an open-source AI product — designed to be
                read, understood, and extended in an afternoon.
              </p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, description }) => (
                <motion.div key={title} variants={item}>
                  <Card className="group h-full border-border/70 bg-card/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex rounded-lg border border-primary/20 bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary/15">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mb-2 font-semibold">{title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="container pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-10 text-center md:p-16"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-[90px]" />
            <h2 className="relative text-3xl font-bold tracking-tight md:text-4xl">
              Ready to forge something open?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-muted-foreground">
              Create an account and start chatting with open models in under a minute.
            </p>
            <div className="relative mt-8 flex justify-center">
              <Button size="lg" asChild>
                <Link to="/auth">
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/60 py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5" />
            <span>OpenForge — Apache-2.0</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              className="transition-colors hover:text-foreground"
              href="https://github.com/Devilwarrior786/open-source-ai-platform"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <Link className="transition-colors hover:text-foreground" to="/auth">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

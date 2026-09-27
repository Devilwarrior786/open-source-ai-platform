import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  MessageSquare,
  Plus,
  LogOut,
  SendHorizontal,
  Loader2,
  Sparkles,
  Wrench,
} from "lucide-react";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function ChatMessageRow({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex w-full gap-3", isUser && "justify-end")}>
      {!isUser && (
        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[78%] whitespace-pre-wrap rounded-xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm border border-border bg-card text-foreground"
        )}
      >
        {content}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const { threadId } = useParams<{ threadId: string }>();

  const threads = useQuery(api.threads.list, {});
  const messages = useQuery(
    api.threads.listMessages,
    threadId ? { threadId: threadId as Id<"threads"> } : "skip"
  );
  const sendMessage = useMutation(api.chat.sendMessage);

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setError(null);
    try {
      const result = await sendMessage({
        threadId: threadId as Id<"threads"> | undefined,
        content,
      });
      setDraft("");
      if (result.threadId !== threadId) {
        navigate(`/dashboard/${result.threadId}`, { replace: true });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card/50">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <Logo className="h-7 w-7" />
          <span className="font-bold tracking-tight">
            Open<span className="text-primary">Forge</span>
          </span>
        </div>

        <div className="p-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
          {threads === undefined && (
            <div className="flex items-center gap-2 px-2 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading threads…
            </div>
          )}
          {threads?.length === 0 && (
            <p className="px-2 py-4 text-sm text-muted-foreground">No chats yet. Say hello 👋</p>
          )}
          {threads?.map((t) => (
            <button
              key={t._id}
              onClick={() => navigate(`/dashboard/${t._id}`)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                threadId === t._id
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-primary/60" />
              <span className="truncate">{t.title}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={() => void signOut()}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
          <div>
            <h1 className="font-semibold">Chat Playground</h1>
            <p className="text-xs text-muted-foreground">Open-weight models via Mistral AI</p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {!threadId && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <Logo className="h-12 w-12 animate-float" />
              <h2 className="text-lg font-semibold">Start a new conversation</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Ask anything, or try one of the starters below. Threads are saved automatically.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {[
                  "Explain Convex in one paragraph",
                  "Ideas for an open-source AI project",
                  "Write a haiku about open source",
                ].map((s) => (
                  <Button key={s} variant="outline" size="sm" onClick={() => setDraft(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {threadId &&
            messages?.map((m) => <ChatMessageRow key={m._id} role={m.role} content={m.content} />)}
          {threadId && messages?.length === 0 && (
            <p className="text-sm text-muted-foreground">No messages in this thread yet.</p>
          )}
          {threadId && sending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              Forge is thinking…
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="shrink-0 border-t border-border p-4">
          {error && (
            <p className="mb-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend();
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Send a message to the playground…"
              className="h-11 flex-1"
              disabled={sending}
            />
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11"
              disabled={sending || !draft.trim()}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wrench className="h-3 w-3" />
            No model key yet? Messages persist anyway — add MISTRAL_API_KEY to go live.
          </p>
        </div>
      </main>
    </div>
  );
}

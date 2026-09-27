import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16 2.5l11.7 6.75v13.5L16 29.5 4.3 22.75V9.25z"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="2.2"
      />
      <path d="M17.6 8.5l-6.4 8.9h4.7L13.4 24.5l7.4-10.1h-4.9z" className="fill-primary" />
    </svg>
  );
}

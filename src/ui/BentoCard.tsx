import type { ReactNode } from "react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
}

export function BentoCard({ children, className = "" }: BentoCardProps) {
  return (
    <div
      className={`bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 p-3 rounded-xl ${className}`}
    >
      {children}
    </div>
  );
}

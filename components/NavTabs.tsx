"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/simulador", label: "Fase de Grupos" },
  { href: "/mata-mata", label: "Mata-mata" },
];

export function NavTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 border-b border-zinc-800">
      {TABS.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`px-3 h-9 inline-flex items-center text-xs font-semibold uppercase tracking-wider border-b-2 transition ${
              active
                ? "border-zinc-50 text-zinc-50"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

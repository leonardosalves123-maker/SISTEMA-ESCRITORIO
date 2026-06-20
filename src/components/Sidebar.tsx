"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const itens = [
  { href: "/", label: "Painel", icon: "📊" },
  { href: "/clientes", label: "Clientes", icon: "👥" },
  { href: "/processos", label: "Processos", icon: "⚖️" },
  { href: "/agenda", label: "Agenda & Prazos", icon: "📅" },
  { href: "/financeiro", label: "Financeiro", icon: "💰" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-slate-900 text-slate-100 flex flex-col">
      <div className="px-6 py-6 border-b border-slate-700">
        <p className="text-lg font-semibold leading-tight">Escritório</p>
        <p className="text-xs text-slate-400">Gestão Jurídica</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {itens.map((item) => {
          const ativo =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                ativo
                  ? "bg-slate-700 text-white font-medium"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-slate-700 text-xs text-slate-400">
        v0.1 — Protótipo
      </div>
    </aside>
  );
}

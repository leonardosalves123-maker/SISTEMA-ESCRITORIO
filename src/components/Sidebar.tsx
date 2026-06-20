"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sair } from "@/app/login/actions";

const itens = [
  { href: "/", label: "Painel", icon: "📊" },
  { href: "/clientes", label: "Clientes", icon: "👥" },
  { href: "/processos", label: "Processos", icon: "⚖️" },
  { href: "/agenda", label: "Agenda & Prazos", icon: "📅" },
  { href: "/financeiro", label: "Financeiro", icon: "💰" },
];

export function Sidebar({
  usuario,
}: {
  usuario: { nome: string; cargo: string | null };
}) {
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
      <div className="px-4 py-4 border-t border-slate-700">
        <p className="text-sm font-medium text-white truncate px-2">
          {usuario.nome}
        </p>
        <p className="text-xs text-slate-400 px-2 mb-2">
          {usuario.cargo ?? "Usuário"}
        </p>
        <form action={sair}>
          <button
            type="submit"
            className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            ↩ Sair
          </button>
        </form>
      </div>
    </aside>
  );
}

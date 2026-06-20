import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{titulo}</h1>
        {descricao && <p className="text-sm text-slate-500 mt-1">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}

export function StatCard({
  label,
  valor,
  detalhe,
  cor = "slate",
}: {
  label: string;
  valor: string | number;
  detalhe?: string;
  cor?: "slate" | "green" | "red" | "amber" | "blue";
}) {
  const cores: Record<string, string> = {
    slate: "text-slate-900",
    green: "text-emerald-600",
    red: "text-red-600",
    amber: "text-amber-600",
    blue: "text-blue-600",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${cores[cor]}`}>{valor}</p>
      {detalhe && <p className="text-xs text-slate-400 mt-1">{detalhe}</p>}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

const estiloBadge: Record<string, string> = {
  ATIVO: "bg-emerald-100 text-emerald-700",
  ENCERRADO: "bg-slate-100 text-slate-600",
  ARQUIVADO: "bg-slate-100 text-slate-600",
  SUSPENSO: "bg-amber-100 text-amber-700",
  PAGO: "bg-emerald-100 text-emerald-700",
  PENDENTE: "bg-amber-100 text-amber-700",
  RECEITA: "bg-blue-100 text-blue-700",
  DESPESA: "bg-red-100 text-red-700",
  PRAZO: "bg-red-100 text-red-700",
  COMPROMISSO: "bg-blue-100 text-blue-700",
  PF: "bg-violet-100 text-violet-700",
  PJ: "bg-indigo-100 text-indigo-700",
};

export function Badge({ value }: { value: string }) {
  const cls = estiloBadge[value] ?? "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}
    >
      {value}
    </span>
  );
}

export function BotaoLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
    >
      {children}
    </Link>
  );
}

export function VazioMsg({ texto }: { texto: string }) {
  return <p className="text-sm text-slate-400 p-6 text-center">{texto}</p>;
}

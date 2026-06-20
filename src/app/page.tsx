import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moeda, data, diasRestantes } from "@/lib/format";
import { PageHeader, StatCard, Card, Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const [
    totalClientes,
    processosAtivos,
    proximosCompromissos,
    receberPendente,
    pagarPendente,
  ] = await Promise.all([
    prisma.cliente.count(),
    prisma.processo.count({ where: { status: "ATIVO" } }),
    prisma.compromisso.findMany({
      where: { concluido: false },
      orderBy: { data: "asc" },
      take: 6,
      include: { processo: true },
    }),
    prisma.lancamento.aggregate({
      where: { tipo: "RECEITA", status: "PENDENTE" },
      _sum: { valor: true },
    }),
    prisma.lancamento.aggregate({
      where: { tipo: "DESPESA", status: "PENDENTE" },
      _sum: { valor: true },
    }),
  ]);

  return (
    <div>
      <PageHeader titulo="Painel" descricao="Visão geral do escritório" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Clientes" valor={totalClientes} cor="blue" />
        <StatCard label="Processos ativos" valor={processosAtivos} cor="slate" />
        <StatCard
          label="A receber (pendente)"
          valor={moeda(receberPendente._sum.valor)}
          cor="green"
        />
        <StatCard
          label="A pagar (pendente)"
          valor={moeda(pagarPendente._sum.valor)}
          cor="red"
        />
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">
            Próximos compromissos e prazos
          </h2>
          <Link href="/agenda" className="text-sm text-blue-600 hover:underline">
            Ver agenda
          </Link>
        </div>
        {proximosCompromissos.length === 0 ? (
          <p className="text-sm text-slate-400 p-6 text-center">
            Nenhum compromisso pendente.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {proximosCompromissos.map((c) => {
              const dias = diasRestantes(c.data);
              const vencido = dias < 0;
              return (
                <li
                  key={c.id}
                  className="px-5 py-3 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge value={c.tipo} />
                      <span className="font-medium text-slate-800 truncate">
                        {c.titulo}
                      </span>
                    </div>
                    {c.processo && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {c.processo.titulo}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-slate-700">{data(c.data)}</p>
                    <p
                      className={`text-xs ${
                        vencido
                          ? "text-red-600 font-medium"
                          : dias <= 3
                            ? "text-amber-600"
                            : "text-slate-400"
                      }`}
                    >
                      {vencido
                        ? `Vencido há ${Math.abs(dias)}d`
                        : dias === 0
                          ? "Hoje"
                          : `Em ${dias}d`}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

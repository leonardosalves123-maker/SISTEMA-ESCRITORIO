import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { moeda, data } from "@/lib/format";
import { PageHeader, Card, Badge, VazioMsg } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ClienteDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(id) },
    include: {
      processos: { orderBy: { criadoEm: "desc" } },
      lancamentos: { orderBy: { criadoEm: "desc" } },
    },
  });

  if (!cliente) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/clientes" className="text-sm text-blue-600 hover:underline">
        ← Voltar para clientes
      </Link>
      <div className="mt-2" />
      <PageHeader
        titulo={cliente.nome}
        descricao={cliente.documento ?? undefined}
        acao={<Badge value={cliente.tipo} />}
      />

      <Card className="p-6 mb-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-500">E-mail</dt>
            <dd className="text-slate-800">{cliente.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Telefone</dt>
            <dd className="text-slate-800">{cliente.telefone ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Endereço</dt>
            <dd className="text-slate-800">{cliente.endereco ?? "—"}</dd>
          </div>
          {cliente.observacao && (
            <div className="sm:col-span-2">
              <dt className="text-slate-500">Observações</dt>
              <dd className="text-slate-800">{cliente.observacao}</dd>
            </div>
          )}
        </dl>
      </Card>

      <h2 className="font-semibold text-slate-900 mb-3">Processos</h2>
      <Card className="mb-6">
        {cliente.processos.length === 0 ? (
          <VazioMsg texto="Nenhum processo vinculado." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {cliente.processos.map((p) => (
              <li key={p.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <Link
                    href={`/processos/${p.id}`}
                    className="font-medium text-slate-800 hover:text-blue-600"
                  >
                    {p.titulo}
                  </Link>
                  <p className="text-xs text-slate-500">{p.numero ?? "Sem número"}</p>
                </div>
                <Badge value={p.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <h2 className="font-semibold text-slate-900 mb-3">Financeiro</h2>
      <Card>
        {cliente.lancamentos.length === 0 ? (
          <VazioMsg texto="Nenhum lançamento financeiro." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {cliente.lancamentos.map((l) => (
              <li key={l.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{l.descricao}</p>
                  <p className="text-xs text-slate-500">
                    Venc.: {data(l.vencimento)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge value={l.status} />
                  <span
                    className={`font-medium ${
                      l.tipo === "RECEITA" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {l.tipo === "RECEITA" ? "+" : "-"}
                    {moeda(l.valor)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

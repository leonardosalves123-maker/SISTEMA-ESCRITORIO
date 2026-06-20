import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moeda } from "@/lib/format";
import { PageHeader, Card, Badge, BotaoLink, VazioMsg } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ProcessosPage() {
  const processos = await prisma.processo.findMany({
    orderBy: { criadoEm: "desc" },
    include: { cliente: true },
  });

  return (
    <div>
      <PageHeader
        titulo="Processos"
        descricao={`${processos.length} processo(s) cadastrado(s)`}
        acao={<BotaoLink href="/processos/novo">+ Novo processo</BotaoLink>}
      />

      <Card>
        {processos.length === 0 ? (
          <VazioMsg texto="Nenhum processo cadastrado ainda." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Processo</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Área</th>
                <th className="px-5 py-3 font-medium">Valor da causa</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link
                      href={`/processos/${p.id}`}
                      className="font-medium text-slate-800 hover:text-blue-600"
                    >
                      {p.titulo}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {p.numero ?? "Sem número CNJ"}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{p.cliente.nome}</td>
                  <td className="px-5 py-3 text-slate-600">{p.area ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-600">
                    {p.valorCausa ? moeda(p.valorCausa) : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <Badge value={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

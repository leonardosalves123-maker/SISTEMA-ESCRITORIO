import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, Badge, BotaoLink, VazioMsg } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { processos: true } } },
  });

  return (
    <div>
      <PageHeader
        titulo="Clientes"
        descricao={`${clientes.length} cliente(s) cadastrado(s)`}
        acao={<BotaoLink href="/clientes/novo">+ Novo cliente</BotaoLink>}
      />

      <Card>
        {clientes.length === 0 ? (
          <VazioMsg texto="Nenhum cliente cadastrado ainda." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Nome</th>
                <th className="px-5 py-3 font-medium">Tipo</th>
                <th className="px-5 py-3 font-medium">Documento</th>
                <th className="px-5 py-3 font-medium">Contato</th>
                <th className="px-5 py-3 font-medium text-center">Processos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientes.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link
                      href={`/clientes/${c.id}`}
                      className="font-medium text-slate-800 hover:text-blue-600"
                    >
                      {c.nome}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <Badge value={c.tipo} />
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {c.documento ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {c.telefone ?? c.email ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-center text-slate-600">
                    {c._count.processos}
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

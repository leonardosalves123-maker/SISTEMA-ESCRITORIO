import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { moeda, data, dataHora } from "@/lib/format";
import { adicionarAndamento } from "../actions";
import { PageHeader, Card, Badge, VazioMsg } from "@/components/ui";
import { Input, BotaoSalvar } from "@/components/form";

export const dynamic = "force-dynamic";

export default async function ProcessoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const processo = await prisma.processo.findUnique({
    where: { id: Number(id) },
    include: {
      cliente: true,
      andamentos: { orderBy: { data: "desc" } },
      compromissos: { orderBy: { data: "asc" } },
    },
  });

  if (!processo) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/processos" className="text-sm text-blue-600 hover:underline">
        ← Voltar para processos
      </Link>
      <div className="mt-2" />
      <PageHeader
        titulo={processo.titulo}
        descricao={processo.numero ?? "Sem número CNJ"}
        acao={<Badge value={processo.status} />}
      />

      <Card className="p-6 mb-6">
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-slate-500">Cliente</dt>
            <dd>
              <Link
                href={`/clientes/${processo.cliente.id}`}
                className="text-blue-600 hover:underline"
              >
                {processo.cliente.nome}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Parte contrária</dt>
            <dd className="text-slate-800">{processo.parteContraria ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Área</dt>
            <dd className="text-slate-800">{processo.area ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Comarca</dt>
            <dd className="text-slate-800">{processo.comarca ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Vara</dt>
            <dd className="text-slate-800">{processo.vara ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Fase</dt>
            <dd className="text-slate-800">{processo.fase ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Valor da causa</dt>
            <dd className="text-slate-800">
              {processo.valorCausa ? moeda(processo.valorCausa) : "—"}
            </dd>
          </div>
        </dl>
      </Card>

      {processo.compromissos.length > 0 && (
        <>
          <h2 className="font-semibold text-slate-900 mb-3">
            Compromissos e prazos
          </h2>
          <Card className="mb-6">
            <ul className="divide-y divide-slate-100">
              {processo.compromissos.map((c) => (
                <li
                  key={c.id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Badge value={c.tipo} />
                    <span
                      className={
                        c.concluido ? "text-slate-400 line-through" : "text-slate-800"
                      }
                    >
                      {c.titulo}
                    </span>
                  </div>
                  <span className="text-sm text-slate-600">{data(c.data)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      <h2 className="font-semibold text-slate-900 mb-3">Andamentos</h2>
      <Card className="mb-6">
        <form
          action={adicionarAndamento}
          className="flex gap-2 p-4 border-b border-slate-100"
        >
          <input type="hidden" name="processoId" value={processo.id} />
          <Input name="descricao" placeholder="Registrar novo andamento..." required />
          <BotaoSalvar texto="Adicionar" />
        </form>
        {processo.andamentos.length === 0 ? (
          <VazioMsg texto="Nenhum andamento registrado." />
        ) : (
          <ul className="divide-y divide-slate-100">
            {processo.andamentos.map((a) => (
              <li key={a.id} className="px-5 py-3">
                <p className="text-slate-800 text-sm">{a.descricao}</p>
                <p className="text-xs text-slate-400 mt-0.5">{dataHora(a.data)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

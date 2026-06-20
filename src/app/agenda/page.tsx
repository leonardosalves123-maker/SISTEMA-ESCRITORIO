import { prisma } from "@/lib/prisma";
import { data, diasRestantes } from "@/lib/format";
import { criarCompromisso, alternarConcluido } from "./actions";
import { PageHeader, Card, Badge, VazioMsg } from "@/components/ui";
import { Campo, Input, Select, BotaoSalvar } from "@/components/form";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const [compromissos, processos] = await Promise.all([
    prisma.compromisso.findMany({
      orderBy: [{ concluido: "asc" }, { data: "asc" }],
      include: { processo: true },
    }),
    prisma.processo.findMany({
      where: { status: "ATIVO" },
      orderBy: { titulo: "asc" },
    }),
  ]);

  const pendentes = compromissos.filter((c) => !c.concluido);
  const concluidos = compromissos.filter((c) => c.concluido);

  return (
    <div>
      <PageHeader
        titulo="Agenda & Prazos"
        descricao="Compromissos e prazos processuais"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Pendentes</h2>
            </div>
            {pendentes.length === 0 ? (
              <VazioMsg texto="Nenhum compromisso pendente." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {pendentes.map((c) => {
                  const dias = diasRestantes(c.data);
                  const vencido = dias < 0;
                  return (
                    <li
                      key={c.id}
                      className="px-5 py-3 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <form action={alternarConcluido}>
                          <input type="hidden" name="id" value={c.id} />
                          <input
                            type="hidden"
                            name="concluido"
                            value={String(c.concluido)}
                          />
                          <button
                            type="submit"
                            title="Marcar como concluído"
                            className="w-5 h-5 rounded border border-slate-300 hover:bg-slate-100"
                          />
                        </form>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge value={c.tipo} />
                            <span className="font-medium text-slate-800 truncate">
                              {c.titulo}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {c.processo ? c.processo.titulo : "Sem processo"}
                            {c.responsavel ? ` · ${c.responsavel}` : ""}
                          </p>
                        </div>
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

          {concluidos.length > 0 && (
            <Card>
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Concluídos</h2>
              </div>
              <ul className="divide-y divide-slate-100">
                {concluidos.map((c) => (
                  <li
                    key={c.id}
                    className="px-5 py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <form action={alternarConcluido}>
                        <input type="hidden" name="id" value={c.id} />
                        <input
                          type="hidden"
                          name="concluido"
                          value={String(c.concluido)}
                        />
                        <button
                          type="submit"
                          title="Reabrir"
                          className="w-5 h-5 rounded bg-emerald-500 text-white text-xs flex items-center justify-center"
                        >
                          ✓
                        </button>
                      </form>
                      <span className="text-slate-400 line-through">{c.titulo}</span>
                    </div>
                    <span className="text-sm text-slate-400">{data(c.data)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <Card className="p-5 h-fit">
          <h2 className="font-semibold text-slate-900 mb-4">Novo compromisso</h2>
          <form action={criarCompromisso} className="space-y-4">
            <Campo label="Título">
              <Input name="titulo" required placeholder="Ex: Audiência" />
            </Campo>
            <Campo label="Tipo">
              <Select name="tipo" defaultValue="COMPROMISSO">
                <option value="COMPROMISSO">Compromisso</option>
                <option value="PRAZO">Prazo</option>
              </Select>
            </Campo>
            <Campo label="Data e hora">
              <Input name="data" type="datetime-local" required />
            </Campo>
            <Campo label="Responsável">
              <Input name="responsavel" placeholder="Ex: Dr. Carlos" />
            </Campo>
            <Campo label="Processo (opcional)">
              <Select name="processoId" defaultValue="">
                <option value="">Nenhum</option>
                {processos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titulo}
                  </option>
                ))}
              </Select>
            </Campo>
            <BotaoSalvar texto="Adicionar" />
          </form>
        </Card>
      </div>
    </div>
  );
}

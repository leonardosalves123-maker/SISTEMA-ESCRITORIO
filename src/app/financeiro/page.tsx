import { prisma } from "@/lib/prisma";
import { moeda, data } from "@/lib/format";
import { criarLancamento, alternarStatus } from "./actions";
import { PageHeader, Card, StatCard, Badge, VazioMsg } from "@/components/ui";
import { Campo, Input, Select, BotaoSalvar } from "@/components/form";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const [lancamentos, clientes] = await Promise.all([
    prisma.lancamento.findMany({
      orderBy: { criadoEm: "desc" },
      include: { cliente: true, processo: true },
    }),
    prisma.cliente.findMany({ orderBy: { nome: "asc" } }),
  ]);

  const receitas = lancamentos
    .filter((l) => l.tipo === "RECEITA")
    .reduce((s, l) => s + l.valor, 0);
  const despesas = lancamentos
    .filter((l) => l.tipo === "DESPESA")
    .reduce((s, l) => s + l.valor, 0);
  const aReceber = lancamentos
    .filter((l) => l.tipo === "RECEITA" && l.status === "PENDENTE")
    .reduce((s, l) => s + l.valor, 0);

  return (
    <div>
      <PageHeader titulo="Financeiro" descricao="Honorários, receitas e despesas" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Receitas (total)" valor={moeda(receitas)} cor="green" />
        <StatCard label="Despesas (total)" valor={moeda(despesas)} cor="red" />
        <StatCard label="Saldo" valor={moeda(receitas - despesas)} cor="blue" />
        <StatCard label="A receber" valor={moeda(aReceber)} cor="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            {lancamentos.length === 0 ? (
              <VazioMsg texto="Nenhum lançamento registrado." />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-100">
                    <th className="px-5 py-3 font-medium">Descrição</th>
                    <th className="px-5 py-3 font-medium">Venc.</th>
                    <th className="px-5 py-3 font-medium">Valor</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lancamentos.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-800">{l.descricao}</p>
                        <p className="text-xs text-slate-500">
                          {l.cliente?.nome ?? "—"}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {data(l.vencimento)}
                      </td>
                      <td
                        className={`px-5 py-3 font-medium ${
                          l.tipo === "RECEITA" ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {l.tipo === "RECEITA" ? "+" : "-"}
                        {moeda(l.valor)}
                      </td>
                      <td className="px-5 py-3">
                        <form action={alternarStatus}>
                          <input type="hidden" name="id" value={l.id} />
                          <input type="hidden" name="status" value={l.status} />
                          <button type="submit" title="Alternar status">
                            <Badge value={l.status} />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        <Card className="p-5 h-fit">
          <h2 className="font-semibold text-slate-900 mb-4">Novo lançamento</h2>
          <form action={criarLancamento} className="space-y-4">
            <Campo label="Descrição">
              <Input name="descricao" required placeholder="Ex: Honorários iniciais" />
            </Campo>
            <Campo label="Tipo">
              <Select name="tipo" defaultValue="RECEITA">
                <option value="RECEITA">Receita</option>
                <option value="DESPESA">Despesa</option>
              </Select>
            </Campo>
            <Campo label="Valor (R$)">
              <Input name="valor" type="number" step="0.01" required placeholder="0,00" />
            </Campo>
            <Campo label="Vencimento">
              <Input name="vencimento" type="date" />
            </Campo>
            <Campo label="Status">
              <Select name="status" defaultValue="PENDENTE">
                <option value="PENDENTE">Pendente</option>
                <option value="PAGO">Pago</option>
              </Select>
            </Campo>
            <Campo label="Cliente (opcional)">
              <Select name="clienteId" defaultValue="">
                <option value="">Nenhum</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
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

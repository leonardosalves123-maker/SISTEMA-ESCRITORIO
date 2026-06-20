import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { criarProcesso } from "../actions";
import { PageHeader, Card, VazioMsg } from "@/components/ui";
import { Campo, Input, Select, BotaoSalvar } from "@/components/form";

export const dynamic = "force-dynamic";

export default async function NovoProcessoPage() {
  const clientes = await prisma.cliente.findMany({ orderBy: { nome: "asc" } });

  return (
    <div className="max-w-2xl">
      <PageHeader titulo="Novo processo" descricao="Cadastre um novo processo / caso" />

      <Card className="p-6">
        {clientes.length === 0 ? (
          <div>
            <VazioMsg texto="Cadastre um cliente antes de criar um processo." />
            <div className="text-center">
              <Link href="/clientes/novo" className="text-sm text-blue-600 hover:underline">
                Cadastrar cliente
              </Link>
            </div>
          </div>
        ) : (
          <form
            action={criarProcesso}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Campo label="Título do processo" span2>
              <Input name="titulo" required placeholder="Ex: Ação Trabalhista - Verbas" />
            </Campo>

            <Campo label="Cliente">
              <Select name="clienteId" required defaultValue="">
                <option value="" disabled>
                  Selecione o cliente
                </option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </Select>
            </Campo>

            <Campo label="Número CNJ">
              <Input name="numero" placeholder="0000000-00.0000.0.00.0000" />
            </Campo>

            <Campo label="Parte contrária">
              <Input name="parteContraria" placeholder="Nome da parte contrária" />
            </Campo>

            <Campo label="Área">
              <Select name="area" defaultValue="Cível">
                <option>Cível</option>
                <option>Trabalhista</option>
                <option>Criminal</option>
                <option>Família</option>
                <option>Tributário</option>
                <option>Previdenciário</option>
                <option>Empresarial</option>
                <option>Consumidor</option>
              </Select>
            </Campo>

            <Campo label="Comarca">
              <Input name="comarca" placeholder="Cidade/UF" />
            </Campo>

            <Campo label="Vara">
              <Input name="vara" placeholder="Ex: 3ª Vara Cível" />
            </Campo>

            <Campo label="Fase">
              <Input name="fase" placeholder="Ex: Conhecimento" />
            </Campo>

            <Campo label="Valor da causa (R$)">
              <Input name="valorCausa" type="number" step="0.01" placeholder="0,00" />
            </Campo>

            <Campo label="Status">
              <Select name="status" defaultValue="ATIVO">
                <option value="ATIVO">Ativo</option>
                <option value="SUSPENSO">Suspenso</option>
                <option value="ARQUIVADO">Arquivado</option>
                <option value="ENCERRADO">Encerrado</option>
              </Select>
            </Campo>

            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <BotaoSalvar texto="Salvar processo" />
              <Link
                href="/processos"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

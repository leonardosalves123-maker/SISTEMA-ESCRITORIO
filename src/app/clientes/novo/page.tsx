import Link from "next/link";
import { criarCliente } from "../actions";
import { PageHeader, Card } from "@/components/ui";
import { Campo, Input, Select, Textarea, BotaoSalvar } from "@/components/form";

export default function NovoClientePage() {
  return (
    <div className="max-w-2xl">
      <PageHeader titulo="Novo cliente" descricao="Cadastre um novo cliente" />

      <Card className="p-6">
        <form action={criarCliente} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo label="Nome / Razão social" span2>
            <Input name="nome" required placeholder="Nome completo" />
          </Campo>

          <Campo label="Tipo">
            <Select name="tipo" defaultValue="PF">
              <option value="PF">Pessoa Física</option>
              <option value="PJ">Pessoa Jurídica</option>
            </Select>
          </Campo>

          <Campo label="CPF / CNPJ">
            <Input name="documento" placeholder="000.000.000-00" />
          </Campo>

          <Campo label="E-mail">
            <Input name="email" type="email" placeholder="email@exemplo.com" />
          </Campo>

          <Campo label="Telefone">
            <Input name="telefone" placeholder="(00) 00000-0000" />
          </Campo>

          <Campo label="Endereço" span2>
            <Input name="endereco" placeholder="Rua, número, cidade/UF" />
          </Campo>

          <Campo label="Observações" span2>
            <Textarea name="observacao" placeholder="Anotações sobre o cliente" />
          </Campo>

          <div className="sm:col-span-2 flex items-center gap-3 pt-2">
            <BotaoSalvar texto="Salvar cliente" />
            <Link
              href="/clientes"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

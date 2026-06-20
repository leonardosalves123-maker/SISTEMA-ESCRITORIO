import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Limpa dados existentes (ordem respeita as relações)
  await prisma.lancamento.deleteMany();
  await prisma.compromisso.deleteMany();
  await prisma.andamento.deleteMany();
  await prisma.processo.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.usuario.deleteMany();

  // Usuário administrador de demonstração
  await prisma.usuario.create({
    data: {
      nome: "Dra. Administradora",
      email: "admin@escritorio.com",
      senhaHash: await bcrypt.hash("admin123", 10),
      cargo: "Sócia",
    },
  });

  const hoje = new Date();
  const emDias = (d: number) => {
    const data = new Date(hoje);
    data.setDate(data.getDate() + d);
    return data;
  };

  // Clientes
  const maria = await prisma.cliente.create({
    data: {
      tipo: "PF",
      nome: "Maria Oliveira Santos",
      documento: "123.456.789-00",
      email: "maria.santos@email.com",
      telefone: "(11) 98765-4321",
      endereco: "Rua das Flores, 123 - São Paulo/SP",
    },
  });

  const construtora = await prisma.cliente.create({
    data: {
      tipo: "PJ",
      nome: "Construtora Alfa Ltda.",
      documento: "12.345.678/0001-90",
      email: "juridico@construtoraalfa.com.br",
      telefone: "(11) 3000-1000",
      endereco: "Av. Paulista, 1000 - São Paulo/SP",
    },
  });

  const joao = await prisma.cliente.create({
    data: {
      tipo: "PF",
      nome: "João Pereira Lima",
      documento: "987.654.321-00",
      email: "joao.lima@email.com",
      telefone: "(21) 99999-8888",
      endereco: "Rua do Sol, 45 - Rio de Janeiro/RJ",
    },
  });

  // Processos
  const proc1 = await prisma.processo.create({
    data: {
      numero: "1001234-56.2025.8.26.0100",
      titulo: "Ação Trabalhista - Verbas Rescisórias",
      clienteId: maria.id,
      parteContraria: "Comércio XYZ Ltda.",
      area: "Trabalhista",
      comarca: "São Paulo/SP",
      vara: "3ª Vara do Trabalho",
      status: "ATIVO",
      fase: "Conhecimento",
      valorCausa: 45000,
      andamentos: {
        create: [
          { descricao: "Distribuição da petição inicial.", data: emDias(-40) },
          { descricao: "Audiência de conciliação designada.", data: emDias(-10) },
        ],
      },
    },
  });

  const proc2 = await prisma.processo.create({
    data: {
      numero: "2005678-90.2025.8.26.0050",
      titulo: "Ação de Cobrança - Inadimplência Contratual",
      clienteId: construtora.id,
      parteContraria: "Fornecedora Beta S.A.",
      area: "Cível",
      comarca: "São Paulo/SP",
      vara: "12ª Vara Cível",
      status: "ATIVO",
      fase: "Conhecimento",
      valorCausa: 250000,
      andamentos: {
        create: [
          { descricao: "Petição inicial protocolada.", data: emDias(-25) },
          { descricao: "Réu citado.", data: emDias(-5) },
        ],
      },
    },
  });

  const proc3 = await prisma.processo.create({
    data: {
      numero: "3009999-11.2024.8.19.0001",
      titulo: "Divórcio Consensual",
      clienteId: joao.id,
      area: "Família",
      comarca: "Rio de Janeiro/RJ",
      vara: "1ª Vara de Família",
      status: "ENCERRADO",
      fase: "Sentença",
      valorCausa: 0,
      andamentos: {
        create: [{ descricao: "Sentença homologatória transitada em julgado.", data: emDias(-60) }],
      },
    },
  });

  // Compromissos e prazos
  await prisma.compromisso.createMany({
    data: [
      {
        titulo: "Audiência de conciliação",
        tipo: "COMPROMISSO",
        data: emDias(2),
        processoId: proc1.id,
        responsavel: "Dr. Carlos",
      },
      {
        titulo: "Prazo: contestação",
        tipo: "PRAZO",
        data: emDias(5),
        processoId: proc2.id,
        responsavel: "Dra. Ana",
      },
      {
        titulo: "Reunião com cliente Maria",
        tipo: "COMPROMISSO",
        data: emDias(1),
        responsavel: "Dr. Carlos",
      },
      {
        titulo: "Prazo: réplica",
        tipo: "PRAZO",
        data: emDias(-2),
        processoId: proc1.id,
        responsavel: "Dra. Ana",
        concluido: true,
      },
    ],
  });

  // Lançamentos financeiros
  await prisma.lancamento.createMany({
    data: [
      {
        descricao: "Honorários iniciais - Maria Santos",
        tipo: "RECEITA",
        valor: 5000,
        status: "PAGO",
        clienteId: maria.id,
        processoId: proc1.id,
        vencimento: emDias(-30),
      },
      {
        descricao: "Honorários mensais - Construtora Alfa",
        tipo: "RECEITA",
        valor: 8000,
        status: "PENDENTE",
        clienteId: construtora.id,
        processoId: proc2.id,
        vencimento: emDias(7),
      },
      {
        descricao: "Custas processuais - Ação de Cobrança",
        tipo: "DESPESA",
        valor: 1200,
        status: "PAGO",
        clienteId: construtora.id,
        processoId: proc2.id,
        vencimento: emDias(-20),
      },
      {
        descricao: "Honorários êxito - Divórcio João",
        tipo: "RECEITA",
        valor: 3500,
        status: "PENDENTE",
        clienteId: joao.id,
        processoId: proc3.id,
        vencimento: emDias(15),
      },
    ],
  });

  console.log("Seed concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

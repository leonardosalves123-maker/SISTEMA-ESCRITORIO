# Sistema de Gestão — Escritório de Advocacia

Sistema web para gestão de um escritório de advocacia, inspirado em ferramentas
como o AdvBox. Permite gerenciar **clientes**, **processos/casos**,
**agenda & prazos** e o **financeiro** do escritório.

## Funcionalidades

- **Painel**: visão geral com indicadores (clientes, processos ativos, valores a
  receber/pagar) e próximos compromissos/prazos.
- **Clientes**: cadastro de pessoas físicas e jurídicas, com ficha individual
  mostrando processos e lançamentos financeiros vinculados.
- **Processos**: cadastro de processos (número CNJ, área, comarca, vara, fase,
  valor da causa, status), com registro de **andamentos**.
- **Agenda & Prazos**: compromissos e prazos processuais, com alerta de
  vencimento e marcação de concluído.
- **Financeiro**: lançamentos de receitas e despesas (honorários, custas),
  controle de pago/pendente e resumo de saldo e a receber.

## Tecnologias

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM + SQLite (banco local)

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Criar o banco de dados e aplicar as migrações
npx prisma migrate dev

# 4. (Opcional) Popular o banco com dados de exemplo
npm run seed

# 5. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts úteis

| Comando             | Descrição                                |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento              |
| `npm run build`     | Build de produção                        |
| `npm start`         | Servidor de produção                     |
| `npm run seed`      | Popula o banco com dados de exemplo      |
| `npx prisma studio` | Interface visual para o banco de dados   |

## Indo para produção

O SQLite é ótimo para desenvolvimento, mas em produção (ex.: Vercel) o ideal é
usar **PostgreSQL**. Para migrar:

1. Altere `provider` para `postgresql` em `prisma/schema.prisma`.
2. Defina a `DATABASE_URL` com a string de conexão do Postgres.
3. Rode `npx prisma migrate deploy`.

## Estrutura

```
prisma/
  schema.prisma        # modelos do banco (Cliente, Processo, etc.)
  seed.ts              # dados de exemplo
src/
  app/
    page.tsx           # Painel
    clientes/          # módulo de clientes
    processos/         # módulo de processos
    agenda/            # módulo de agenda e prazos
    financeiro/        # módulo financeiro
  components/          # componentes de UI reutilizáveis
  lib/                 # prisma client e utilitários
```

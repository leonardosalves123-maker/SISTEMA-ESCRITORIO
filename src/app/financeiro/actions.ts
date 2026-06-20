"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function criarLancamento(formData: FormData) {
  const descricao = String(formData.get("descricao") ?? "").trim();
  const valor = Number(formData.get("valor"));
  if (!descricao || !valor) return;

  const clienteId = formData.get("clienteId");
  const vencimento = formData.get("vencimento") as string;

  await prisma.lancamento.create({
    data: {
      descricao,
      valor,
      tipo: String(formData.get("tipo") ?? "RECEITA"),
      status: String(formData.get("status") ?? "PENDENTE"),
      vencimento: vencimento ? new Date(vencimento) : null,
      clienteId: clienteId ? Number(clienteId) : null,
    },
  });

  revalidatePath("/financeiro");
  redirect("/financeiro");
}

export async function alternarStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));

  await prisma.lancamento.update({
    where: { id },
    data: { status: status === "PAGO" ? "PENDENTE" : "PAGO" },
  });

  revalidatePath("/financeiro");
}

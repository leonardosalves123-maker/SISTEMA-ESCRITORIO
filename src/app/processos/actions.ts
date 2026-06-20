"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function criarProcesso(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const clienteId = Number(formData.get("clienteId"));
  if (!titulo || !clienteId) return;

  const valorCausaRaw = formData.get("valorCausa") as string;

  await prisma.processo.create({
    data: {
      titulo,
      clienteId,
      numero: (formData.get("numero") as string) || null,
      parteContraria: (formData.get("parteContraria") as string) || null,
      area: (formData.get("area") as string) || null,
      comarca: (formData.get("comarca") as string) || null,
      vara: (formData.get("vara") as string) || null,
      status: String(formData.get("status") ?? "ATIVO"),
      fase: (formData.get("fase") as string) || null,
      valorCausa: valorCausaRaw ? Number(valorCausaRaw) : null,
    },
  });

  revalidatePath("/processos");
  redirect("/processos");
}

export async function adicionarAndamento(formData: FormData) {
  const processoId = Number(formData.get("processoId"));
  const descricao = String(formData.get("descricao") ?? "").trim();
  if (!processoId || !descricao) return;

  await prisma.andamento.create({
    data: { processoId, descricao },
  });

  revalidatePath(`/processos/${processoId}`);
}

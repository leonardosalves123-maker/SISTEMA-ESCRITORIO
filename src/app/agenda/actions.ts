"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function criarCompromisso(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const dataStr = String(formData.get("data") ?? "");
  if (!titulo || !dataStr) return;

  const processoId = formData.get("processoId");

  await prisma.compromisso.create({
    data: {
      titulo,
      tipo: String(formData.get("tipo") ?? "COMPROMISSO"),
      data: new Date(dataStr),
      responsavel: (formData.get("responsavel") as string) || null,
      observacao: (formData.get("observacao") as string) || null,
      processoId: processoId ? Number(processoId) : null,
    },
  });

  revalidatePath("/agenda");
  redirect("/agenda");
}

export async function alternarConcluido(formData: FormData) {
  const id = Number(formData.get("id"));
  const concluido = formData.get("concluido") === "true";

  await prisma.compromisso.update({
    where: { id },
    data: { concluido: !concluido },
  });

  revalidatePath("/agenda");
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function criarCliente(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return;

  await prisma.cliente.create({
    data: {
      nome,
      tipo: String(formData.get("tipo") ?? "PF"),
      documento: (formData.get("documento") as string) || null,
      email: (formData.get("email") as string) || null,
      telefone: (formData.get("telefone") as string) || null,
      endereco: (formData.get("endereco") as string) || null,
      observacao: (formData.get("observacao") as string) || null,
    },
  });

  revalidatePath("/clientes");
  redirect("/clientes");
}

"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { criarSessao, encerrarSessao } from "@/lib/auth";

export async function entrar(
  _estadoAnterior: { erro?: string } | undefined,
  formData: FormData,
): Promise<{ erro?: string }> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  if (!email || !senha) {
    return { erro: "Informe e-mail e senha." };
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
    return { erro: "E-mail ou senha inválidos." };
  }

  await criarSessao({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    cargo: usuario.cargo,
  });

  redirect("/");
}

export async function sair() {
  await encerrarSessao();
  redirect("/login");
}

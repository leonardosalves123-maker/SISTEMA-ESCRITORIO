import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "sessao";
const DURACAO = 60 * 60 * 24 * 7; // 7 dias em segundos

// Em produção, defina SESSION_SECRET nas variáveis de ambiente.
const segredo = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "segredo-de-desenvolvimento-troque-em-producao",
);

export type SessaoUsuario = {
  id: number;
  nome: string;
  email: string;
  cargo: string | null;
};

export async function criarSessao(usuario: SessaoUsuario) {
  const token = await new SignJWT({ ...usuario })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACAO}s`)
    .sign(segredo);

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: DURACAO,
    path: "/",
  });
}

export async function obterSessao(): Promise<SessaoUsuario | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, segredo);
    return {
      id: payload.id as number,
      nome: payload.nome as string,
      email: payload.email as string,
      cargo: (payload.cargo as string) ?? null,
    };
  } catch {
    return null;
  }
}

export async function encerrarSessao() {
  const store = await cookies();
  store.delete(COOKIE);
}

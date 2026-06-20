import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const segredo = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "segredo-de-desenvolvimento-troque-em-producao",
);

async function autenticado(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("sessao")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, segredo);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ehLogin = pathname === "/login";
  const logado = await autenticado(req);

  // Não logado tentando acessar área protegida -> login
  if (!logado && !ehLogin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // Já logado tentando acessar o login -> painel
  if (logado && ehLogin) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  // Protege tudo, exceto assets estáticos e a API interna do Next.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

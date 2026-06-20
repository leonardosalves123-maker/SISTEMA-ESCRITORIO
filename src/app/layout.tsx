import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { obterSessao } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Gestão - Escritório de Advocacia",
  description: "Gestão de clientes, processos, agenda e financeiro do escritório",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessao = await obterSessao();

  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        {sessao ? (
          <div className="flex min-h-screen">
            <Sidebar usuario={{ nome: sessao.nome, cargo: sessao.cargo }} />
            <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
              {children}
            </main>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}

"use client";

import { useActionState } from "react";
import { entrar } from "./actions";

export default function LoginPage() {
  const [estado, formAction, pendente] = useActionState(entrar, {});

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Escritório</h1>
          <p className="text-sm text-slate-500">Gestão Jurídica</p>
        </div>

        <form
          action={formAction}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4"
        >
          <h2 className="font-semibold text-slate-800">Acessar o sistema</h2>

          {estado?.erro && (
            <p className="text-sm bg-red-50 text-red-700 rounded-md px-3 py-2">
              {estado.erro}
            </p>
          )}

          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1">
              E-mail
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="seu@email.com"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-slate-700 mb-1">
              Senha
            </span>
            <input
              name="senha"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={pendente}
            className="w-full bg-slate-900 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-60"
          >
            {pendente ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          Acesso de demonstração: admin@escritorio.com / admin123
        </p>
      </div>
    </div>
  );
}

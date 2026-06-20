import type { ReactNode } from "react";

const baseInput =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400";

export function Campo({
  label,
  children,
  span2 = false,
}: {
  label: string;
  children: ReactNode;
  span2?: boolean;
}) {
  return (
    <label className={`block ${span2 ? "sm:col-span-2" : ""}`}>
      <span className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={baseInput} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={baseInput} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return <textarea {...props} className={baseInput} rows={3} />;
}

export function BotaoSalvar({ texto = "Salvar" }: { texto?: string }) {
  return (
    <button
      type="submit"
      className="bg-slate-900 text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-slate-700 transition-colors"
    >
      {texto}
    </button>
  );
}

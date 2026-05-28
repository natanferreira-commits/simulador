"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/store/simulationStore";

export default function HomePage() {
  const router = useRouter();
  const userName = useSimulation((s) => s.userName);
  const setUserName = useSimulation((s) => s.setUserName);
  const hasHydrated = useSimulation((s) => s.hasHydrated);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (hasHydrated && userName) {
      setInput(userName);
    }
  }, [hasHydrated, userName]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed.length < 2) return;
    setUserName(trimmed);
    router.push("/simulador");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Copa do Mundo 2026
          </div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight text-zinc-900">
            Simulador da Copa
          </h1>
          <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
            Monte seu palpite jogo a jogo seguindo as regras oficiais da FIFA.
            48 seleções, 12 grupos, mata-mata de 32.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Seu nome
          </label>
          <input
            id="name"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Natan"
            autoFocus
            maxLength={40}
            className="w-full h-12 px-4 text-base border border-zinc-300 rounded-lg outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition"
          />
          <button
            type="submit"
            disabled={input.trim().length < 2}
            className="w-full h-12 bg-zinc-900 text-white font-semibold rounded-lg hover:bg-zinc-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Começar a palpitar
          </button>
        </form>

        {hasHydrated && userName && (
          <p className="mt-5 text-xs text-center text-zinc-500">
            Voltando como <strong className="text-zinc-700">{userName}</strong>? Seu palpite está salvo.
          </p>
        )}

        <p className="mt-12 text-center text-xs text-zinc-400">
          by Dupla / Arena
        </p>
      </div>
    </div>
  );
}

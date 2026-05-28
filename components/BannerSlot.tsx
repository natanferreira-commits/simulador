/**
 * Banner placeholder. Substituir pelo banner real (imagem, iframe ou
 * componente de ad network) quando definido.
 *
 * Formato padrão: leaderboard horizontal (~728x90 a 970x120). Responsivo
 * pra ocupar toda a largura do container, com altura controlada por
 * aspect ratio em telas grandes e min-height em telas menores.
 */
export function BannerSlot() {
  return (
    <div
      role="complementary"
      aria-label="Espaço publicitário"
      className="w-full flex items-center justify-center rounded-md border border-dashed border-zinc-800 bg-zinc-900/40 text-zinc-600 hover:border-zinc-700 hover:bg-zinc-900/60 transition cursor-default min-h-[90px] md:min-h-[100px] my-4"
    >
      <div className="flex flex-col items-center gap-1 py-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          Espaço publicitário
        </div>
        <div className="text-[9px] uppercase tracking-widest text-zinc-700">
          Banner · 970 × 90
        </div>
      </div>
    </div>
  );
}

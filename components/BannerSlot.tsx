import Image from "next/image";

/**
 * Banner do oDupla — 1200x280.
 *
 * A imagem precisa estar em /public/banner-odupla.png.
 * Quando rolar o link real (YouTube / Instagram), trocar o href.
 */
export function BannerSlot() {
  return (
    <a
      href="https://www.youtube.com/@oDupla"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="oDupla — vídeos novos todos os dias"
      className="relative block w-full overflow-hidden rounded-md border border-zinc-800 hover:border-zinc-700 transition my-4"
      style={{ aspectRatio: "1200 / 280" }}
    >
      <Image
        src="/banner-odupla.png"
        alt="oDupla — vídeos novos todos os dias"
        fill
        sizes="(max-width: 1200px) 100vw, 1200px"
        className="object-cover"
        priority
      />
    </a>
  );
}

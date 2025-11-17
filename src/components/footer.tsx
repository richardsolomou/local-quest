export function Footer() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 text-center text-xs text-zinc-400 sm:text-sm">
      Made with <span className="text-red-500">&lt;3</span> by{" "}
      <a
        className="inline-flex flex-wrap items-center gap-1 font-medium underline decoration-zinc-600 underline-offset-2 transition-colors hover:text-zinc-100 hover:decoration-zinc-400"
        data-umami-event="footer_link_clicked"
        href="https://ras.sh"
        rel="noopener noreferrer"
        target="_blank"
      >
        ras.sh
      </a>
    </div>
  );
}

export default function DeveloperCredit() {
  return (
    <aside
      aria-label="Developer credit"
      className="pointer-events-none fixed right-0 top-0 z-40 hidden h-dvh items-center pr-2 md:flex lg:pr-3"
    >
      <a
        href="https://bushaan.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="edge-credit pointer-events-auto select-none text-[11px] font-medium tracking-[0.18em] text-muted/45 transition-colors hover:text-muted"
      >
        Developed by Bushaan Gunatilake
      </a>
    </aside>
  );
}

export default function ScrollIndicator() {
  return (
    <div
      data-hero-scroll
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto hidden w-fit flex-col items-center gap-3 md:flex"
    >
      <span className="text-caption uppercase text-muted">Scroll</span>
      <span className="h-10 w-px bg-gold/60" />
    </div>
  );
}

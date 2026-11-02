import Container from "@/components/ui/Container";
import { BRAND, CODE, MARK_PATH, NAV } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink2">
      <Container className="py-12 md:py-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MARK_PATH} alt="" width={20} height={20} className="h-5 w-5" />
            <span className="text-[0.875rem] font-medium text-fg">{BRAND}</span>
          </div>
          <nav aria-label="Footer" className="flex items-center gap-8">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[0.875rem] text-muted transition-colors duration-200 hover:text-gold motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div aria-hidden className="my-8 h-px w-full bg-line md:my-5" />
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-small text-muted">© 2026 CTRL + SHIFT + CANDLE</p>
          <p aria-hidden className="select-none font-mono text-label text-status opacity-60">
            {CODE.status}
          </p>
        </div>
      </Container>
    </footer>
  );
}

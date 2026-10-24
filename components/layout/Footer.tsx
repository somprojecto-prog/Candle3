import CodeComment from "@/components/ui/CodeComment";
import Container from "@/components/ui/Container";
import { BRAND, CODE, MARK_PATH, NAV } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <Container className="py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MARK_PATH} alt="" width={28} height={28} className="h-7 w-7" />
            <span className="text-sm font-medium tracking-[0.28em] text-fg">{BRAND}</span>
          </div>
          <nav aria-label="Footer" className="flex items-center gap-8">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[0.9375rem] text-muted transition-colors hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {BRAND}
          </p>
          <CodeComment className="md:text-right">{CODE.status}</CodeComment>
        </div>
      </Container>
    </footer>
  );
}

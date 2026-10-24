"use client";

import type { MouseEvent } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { BRAND, MARK_PATH, NAV, SHOP_URL } from "@/lib/constants";
import { scrollToHash } from "@/lib/scrollTo";

export default function Header() {
  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href !== "#top" && !document.querySelector(href)) return;
    e.preventDefault();
    scrollToHash(href);
    history.replaceState(null, "", href);
  };

  return (
    <header className="sticky top-0 z-40 h-[72px] border-b border-line bg-ink/85 backdrop-blur">
      <Container className="flex h-full items-center justify-between">
        <a
          href="#top"
          onClick={(e) => go(e, "#top")}
          className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MARK_PATH} alt="" width={28} height={28} className="h-7 w-7" />
          <span className="text-sm font-medium tracking-[0.28em] text-fg">{BRAND}</span>
        </a>
        <div className="flex items-center gap-10">
          <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => go(e, item.href)}
                className="text-[0.9375rem] text-muted transition-colors hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Button href={SHOP_URL} size="sm">
            Shop
          </Button>
        </div>
      </Container>
    </header>
  );
}

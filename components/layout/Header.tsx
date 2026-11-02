"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { BRAND, MARK_PATH, NAV, SHOP_URL } from "@/lib/constants";
import { scrollToHash, startScroll, stopScroll } from "@/lib/scrollTo";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 80);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        wasOpen.current = false;
        burgerRef.current?.focus();
      }
      return;
    }
    wasOpen.current = true;
    stopScroll();

    const first = menuRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    const raf = requestAnimationFrame(() => first?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const inMenu = Array.from(menuRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
      const items = burgerRef.current ? [burgerRef.current, ...inMenu] : inMenu;
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !items.includes(active)) {
        e.preventDefault();
        (e.shiftKey ? lastEl : firstEl).focus();
      } else if (e.shiftKey && active === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onMq);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      startScroll();
    };
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href !== "#top" && !document.querySelector(href)) return;
    e.preventDefault();
    scrollToHash(href);
    history.replaceState(null, "", href);
  };

  // Em captura: liberta o scroll antes do scrollToHash do link/botão (o Lenis ignora scrollTo parado).
  const onMenuClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) {
      startScroll();
      setOpen(false);
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] border-b border-line backdrop-blur-[12px] transition-[height,background-color] duration-200 ease-out motion-reduce:transition-none",
          scrolled ? "h-16 bg-[rgba(5,5,5,0.94)]" : "h-16 bg-[rgba(5,5,5,0.85)] md:h-[72px]",
        )}
      >
        <Container className="flex h-full items-center justify-between">
          <a
            href="#top"
            onClick={(e) => go(e, "#top")}
            className={cn("flex items-center gap-3 transition-opacity duration-200 hover:opacity-80", RING)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MARK_PATH} alt="" width={20} height={20} className="h-5 w-5" />
            <span className="text-[0.875rem] font-medium text-fg">{BRAND}</span>
          </a>

          <div className="flex items-center gap-4 md:gap-10">
            <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => go(e, item.href)}
                  className={cn(
                    "relative text-[0.875rem] text-muted transition-colors duration-200 hover:text-fg after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-200 hover:after:scale-x-100 motion-reduce:transition-none motion-reduce:after:transition-none",
                    RING,
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <Button href={SHOP_URL} size="sm">
              Shop
            </Button>

            <button
              ref={burgerRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className={cn("flex h-10 w-10 items-center justify-center md:hidden", RING)}
            >
              <span aria-hidden className="relative block h-[13px] w-[18px]">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-px bg-fg transition-transform duration-200 motion-reduce:transition-none",
                    open && "translate-y-[6px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 top-[6px] h-px bg-fg transition-opacity duration-200 motion-reduce:transition-none",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 top-[12px] h-px bg-fg transition-transform duration-200 motion-reduce:transition-none",
                    open && "-translate-y-[6px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </Container>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        onClickCapture={onMenuClickCapture}
        className={cn(
          "fixed inset-0 z-[90] flex flex-col bg-ink pt-16 transition-[opacity,transform,visibility] duration-300 ease-out motion-reduce:transition-none md:hidden",
          open ? "visible translate-y-0 opacity-100" : "invisible translate-y-5 opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-8 px-6">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              className={cn("text-[1.5rem] font-medium leading-tight text-fg", RING)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          <Button href={SHOP_URL} className="w-full">
            Shop
          </Button>
        </div>
      </div>
    </>
  );
}

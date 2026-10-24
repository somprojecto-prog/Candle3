import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { BRAND, HERO_TIMING, MODEL_PATH } from "@/lib/constants";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: BRAND,
  description: "A focused candle for concentration, creativity, and flow.",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

const DEV = process.env.NODE_ENV !== "production";
const FAILSAFE_MS = Math.round(HERO_TIMING.failsafe * 1000);

const INLINE = `(function(){
var d=document.documentElement;
d.classList.add("js");
var rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
var on=false;
try{
var gl=false;
try{var c=document.createElement("canvas");gl=!!(c.getContext("webgl2")||c.getContext("webgl"));}catch(e){}
var failed=false;
try{failed=sessionStorage.getItem("story:failed")==="1";}catch(e){}
on = gl && !failed;
if (DEV) {
  var q = new URLSearchParams(location.search).get("story");
  if (q === "on") on = true;
  else if (q === "off") on = false;
}
d.dataset.story = on ? "on" : "off";
var h=location.hash;
if(!rm&&(h===""||h==="#top")&&(window.scrollY||d.scrollTop||0)===0){
window.__heroT0=performance.now();d.dataset.hero="playing";
setTimeout(function(){if(d.dataset.hero==="playing")d.dataset.hero="done";},${FAILSAFE_MS});
}
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <link rel="preload" href={MODEL_PATH} as="fetch" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: INLINE }} />
      </head>
      <body className="bg-ink font-sans text-fg antialiased">{children}</body>
    </html>
  );
}

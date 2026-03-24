import { c as createComponent, b as addAttribute, a as renderTemplate } from './astro/server_CZk8NOd-.mjs';
import 'piccolore';
import 'clsx';

const $$Favicons = createComponent(async ($$result, $$props, $$slots) => {
  let faviconUrl = "/favicon.ico";
  let favicon16 = "/favicon-16x16.png";
  let favicon32 = "/favicon-32x32.png";
  let appleTouchIconUrl = "/apple-touch-icon.png";
  let siteName = "MarketMindAI";
  try {
    const BACKEND_URL = "http://localhost:8001";
    const res = await fetch(`${BACKEND_URL}/api/site-settings/logo`);
    if (res.ok) {
      const data = await res.json();
      siteName = data.site_name || "MarketMindAI";
      if (data.favicon_url) {
        faviconUrl = data.favicon_url;
        favicon16 = data.favicon_url;
        favicon32 = data.favicon_url;
      }
      if (data.logo_url) {
        appleTouchIconUrl = data.logo_url;
      }
    }
  } catch {
  }
  return renderTemplate`<!-- Standard favicons --><link rel="shortcut icon"${addAttribute(faviconUrl, "href")} id="favicon-shortcut"><link rel="icon" type="image/x-icon"${addAttribute(faviconUrl, "href")} id="favicon-ico"><link rel="icon" type="image/png" sizes="16x16"${addAttribute(favicon16, "href")} id="favicon-16"><link rel="icon" type="image/png" sizes="32x32"${addAttribute(favicon32, "href")} id="favicon-32"><!-- Apple touch icons (iOS / iPadOS) --><link rel="apple-touch-icon"${addAttribute(appleTouchIconUrl, "href")} id="apple-touch-icon"><link rel="apple-touch-icon" sizes="57x57"${addAttribute(appleTouchIconUrl, "href")}><link rel="apple-touch-icon" sizes="72x72"${addAttribute(appleTouchIconUrl, "href")}><link rel="apple-touch-icon" sizes="120x120"${addAttribute(appleTouchIconUrl, "href")}><link rel="apple-touch-icon" sizes="152x152"${addAttribute(appleTouchIconUrl, "href")}><link rel="apple-touch-icon" sizes="180x180"${addAttribute(appleTouchIconUrl, "href")}><!-- Android Chrome / PWA icons --><link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png"><link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png"><!-- Web App Manifest (PWA) --><link rel="manifest" href="/site.webmanifest"><!-- Microsoft / Windows tiles --><meta name="msapplication-TileColor" content="#2563eb"><meta name="msapplication-TileImage" content="/android-chrome-192x192.png"><meta name="msapplication-config" content="none"><!-- App meta --><meta name="apple-mobile-web-app-title"${addAttribute(siteName, "content")}><meta name="application-name"${addAttribute(siteName, "content")}><meta name="theme-color" content="#2563eb" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#1e293b" media="(prefers-color-scheme: dark)">`;
}, "/app/frontend/src/components/Favicons.astro", void 0);

export { $$Favicons as $ };

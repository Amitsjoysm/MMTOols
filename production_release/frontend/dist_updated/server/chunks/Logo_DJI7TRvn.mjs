import { c as createComponent, m as maybeRenderHead, b as addAttribute, a as renderTemplate, d as renderScript } from './astro/server_CZk8NOd-.mjs';
import 'piccolore';
import 'clsx';

const $$Logo = createComponent(async ($$result, $$props, $$slots) => {
  let logoUrl = null;
  let siteName = "MarketMindAI";
  try {
    const BACKEND_URL = "http://localhost:8001";
    const res = await fetch(`${BACKEND_URL}/api/site-settings/logo`, {
      headers: { "Accept": "application/json" }
    });
    if (res.ok) {
      const data = await res.json();
      logoUrl = data.logo_url || null;
      siteName = data.site_name || "MarketMindAI";
    }
  } catch {
  }
  return renderTemplate`${maybeRenderHead()}<span class="self-center ml-2 rtl:ml-0 rtl:mr-2 font-bold text-gray-900 dark:text-white whitespace-nowrap flex items-center gap-2" id="site-logo-container" data-testid="site-logo"> ${logoUrl ? renderTemplate`<img${addAttribute(logoUrl.startsWith("/") ? logoUrl : `/${logoUrl}`, "src")}${addAttribute(siteName, "alt")} class="h-9 md:h-10 w-auto" id="site-logo-img" onerror="this.style.display='none'; document.getElementById('logo-fallback').style.display='flex';">` : renderTemplate`<span class="flex items-center gap-2" id="logo-fallback"> <svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path> </svg> <span> <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Market</span><span class="text-gray-900 dark:text-white">MindAI</span> </span> </span>`} </span> ${logoUrl && renderTemplate`<span class="hidden flex items-center gap-2" id="logo-fallback"> <svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path> </svg> <span> <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Market</span><span class="text-gray-900 dark:text-white">MindAI</span> </span> </span>`} ${renderScript($$result, "/app/frontend/src/components/Logo.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/components/Logo.astro", void 0);

export { $$Logo as $ };

import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as renderScript } from '../../chunks/astro/server_CZk8NOd-.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../chunks/PageLayout_W7EoUzsJ.mjs';
export { renderers } from '../../renderers.mjs';

const $$ClaimedTools = createComponent(async ($$result, $$props, $$slots) => {
  const title = "My Claimed Tools";
  const description = "Manage your claimed tools";
  return renderTemplate`${renderComponent($$result, "PageLayout", $$PageLayout, { "metadata": { title, description } }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12 max-w-6xl"> <div class="mb-8"> <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2" data-testid="page-title">
My Claimed Tools
</h1> <p class="text-gray-600 dark:text-gray-400">
Manage tools you've claimed for content management and promotion
</p> </div> <!-- Loading state --> <div id="loading" class="flex justify-center items-center py-12"> <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> </div> <!-- Error state --> <div id="error" class="hidden bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6"> <p class="text-red-800 dark:text-red-200" id="error-message"></p> </div> <!-- Tools grid --> <div id="tools-container" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <!-- Tools will be dynamically inserted here --> </div> <!-- Empty state --> <div id="empty-state" class="hidden text-center py-12"> <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No claimed tools yet</h3> <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
Visit tool pages and click "Claim This Tool" to start managing tools.
</p> <a href="/tools" class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
Browse Tools
</a> </div> </div> ${renderScript($$result2, "/app/frontend/src/pages/user/claimed-tools.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/app/frontend/src/pages/user/claimed-tools.astro", void 0);

const $$file = "/app/frontend/src/pages/user/claimed-tools.astro";
const $$url = "/user/claimed-tools";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ClaimedTools,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

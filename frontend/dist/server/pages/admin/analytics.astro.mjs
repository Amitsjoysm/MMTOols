import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DmgvrA-F.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_CAobx7UV.mjs';
export { renderers } from '../../renderers.mjs';

const $$Analytics = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Analytics - Admin"
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="analytics-container"> <!-- Loading State --> <div id="loading" class="text-center py-12"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p> </div> <!-- Analytics Content --> <div id="analytics-content" class="hidden space-y-6"> <!-- Timeframe Selector --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <div class="flex items-center gap-4"> <label for="timeframe" class="text-sm font-medium text-gray-700 dark:text-gray-300">
Timeframe:
</label> <select id="timeframe" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" data-testid="timeframe-selector"> <option value="7">Last 7 Days</option> <option value="30" selected>Last 30 Days</option> <option value="90">Last 90 Days</option> <option value="365">Last Year</option> </select> </div> </div> <!-- Analytics Stats --> <div id="stats-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> <!-- Stats will be rendered here --> </div> <!-- Charts Row --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"> <!-- Activity Chart --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Activity Overview</h3> <div id="activity-chart" class="space-y-4"> <!-- Activity metrics will be rendered here --> </div> </div> <!-- Performance Chart --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Performance Metrics</h3> <div id="performance-chart" class="space-y-4"> <!-- Performance metrics will be rendered here --> </div> </div> </div> <!-- Detailed Stats --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Detailed Statistics</h3> <div id="detailed-stats" class="grid grid-cols-1 md:grid-cols-2 gap-6"> <!-- Detailed stats will be rendered here --> </div> </div> </div> <!-- Error State --> <div id="error" class="hidden text-center py-12"> <p class="text-xl text-red-600 dark:text-red-400">Error loading analytics data.</p> <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
Retry
</button> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/admin/analytics.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/admin/analytics.astro", void 0);

const $$file = "/app/frontend/src/pages/admin/analytics.astro";
const $$url = "/admin/analytics";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Analytics,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

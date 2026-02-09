import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Chl_MonH.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../chunks/AdminLayout_DVD5S_3Q.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Dashboard - Admin"
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="dashboard-container"> <!-- Loading State --> <div id="loading" class="text-center py-12"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p> </div> <!-- Dashboard Content (rendered by JS) --> <div id="dashboard-content" class="hidden space-y-6"> <!-- Stats Grid --> <div id="stats-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> <!-- Stats will be rendered here --> </div> <!-- Charts Row --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"> <!-- Growth Chart --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Growth Overview</h3> <div id="growth-chart" class="space-y-4"> <!-- Growth metrics will be rendered here --> </div> </div> <!-- Top Categories --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Categories</h3> <div id="top-categories" class="space-y-3"> <!-- Categories will be rendered here --> </div> </div> </div> <!-- Content Overview --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"> <!-- Top Tools --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Most Viewed Tools</h3> <div id="top-tools" class="space-y-3"> <!-- Tools will be rendered here --> </div> </div> <!-- Top Blogs --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Most Viewed Blogs</h3> <div id="top-blogs" class="space-y-3"> <!-- Blogs will be rendered here --> </div> </div> </div> <!-- Recent Activity --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity (Today)</h3> <div id="recent-activity" class="grid grid-cols-1 md:grid-cols-4 gap-4"> <!-- Recent activity stats will be rendered here --> </div> </div> </div> <!-- Error State --> <div id="error" class="hidden text-center py-12"> <p class="text-xl text-red-600 dark:text-red-400">Error loading dashboard data.</p> <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
Retry
</button> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/admin/index.astro", void 0);

const $$file = "/app/frontend/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

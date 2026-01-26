import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DU95tW1k.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_B__REsA5.mjs';
export { renderers } from '../../renderers.mjs';

const $$Reviews = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Reviews Management - Admin"
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="reviews-management" class="space-y-6"> <div class="flex items-center justify-between"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Reviews Management</h2> </div> <!-- Filters --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <select id="verified-filter" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"> <option value="">All Reviews</option> <option value="false">Pending Verification</option> <option value="true">Verified</option> </select> <button id="reset-filters-btn" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
Reset Filters
</button> </div> </div> <!-- Loading State --> <div id="loading" class="text-center py-12"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Loading reviews...</p> </div> <!-- Reviews Table --> <div id="reviews-table-container" class="hidden bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"> <div class="overflow-x-auto"> <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"> <thead class="bg-gray-50 dark:bg-gray-900"> <tr> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tool</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Review</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th> <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th> <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th> </tr> </thead> <tbody id="reviews-tbody" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"></tbody> </table> </div> </div> <!-- Pagination --> <div id="pagination" class="hidden flex items-center justify-between"> <div class="text-sm text-gray-700 dark:text-gray-300">
Showing <span id="page-info"></span> </div> <div class="flex space-x-2"> <button id="prev-btn" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
Previous
</button> <button id="next-btn" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
Next
</button> </div> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/admin/reviews.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/admin/reviews.astro", void 0);

const $$file = "/app/frontend/src/pages/admin/reviews.astro";
const $$url = "/admin/reviews";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Reviews,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

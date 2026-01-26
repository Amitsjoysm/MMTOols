import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CiGCQnlW.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DRpkFXGC.mjs';
export { renderers } from '../../renderers.mjs';

const $$Contacts = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Contact Submissions - Admin"
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="contacts-management" class="space-y-6"> <div class="flex items-center justify-between"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Contact Submissions</h2> </div> <!-- Filters --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <select id="status-filter" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"> <option value="">All Status</option> <option value="new">New</option> <option value="in_progress">In Progress</option> <option value="resolved">Resolved</option> <option value="closed">Closed</option> </select> <button id="reset-filters-btn" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
Reset Filters
</button> </div> </div> <!-- Loading State --> <div id="loading" class="text-center py-12"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Loading submissions...</p> </div> <!-- Contacts List --> <div id="contacts-list" class="hidden space-y-4"> <!-- Contact cards will be rendered here --> </div> <!-- Pagination --> <div id="pagination" class="hidden flex items-center justify-between"> <div class="text-sm text-gray-700 dark:text-gray-300">
Showing <span id="page-info"></span> </div> <div class="flex space-x-2"> <button id="prev-btn" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
Previous
</button> <button id="next-btn" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
Next
</button> </div> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/admin/contacts.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/admin/contacts.astro", void 0);

const $$file = "/app/frontend/src/pages/admin/contacts.astro";
const $$url = "/admin/contacts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contacts,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

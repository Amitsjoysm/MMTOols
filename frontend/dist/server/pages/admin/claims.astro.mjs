import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as renderScript } from '../../chunks/astro/server_CZk8NOd-.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_Csi0zVbJ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Claims = createComponent(async ($$result, $$props, $$slots) => {
  const title = "Tool Claims Management";
  const description = "Manage tool ownership claim requests";
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": title, "description": description }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-8"> <div class="flex justify-between items-center mb-8"> <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tool Claims Management</h1> <div class="flex gap-2"> <button id="refreshBtn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
Refresh
</button> </div> </div> <!-- Filter tabs --> <div class="mb-6 border-b border-gray-200 dark:border-gray-700"> <ul class="flex flex-wrap -mb-px text-sm font-medium text-center"> <li class="mr-2"> <button data-filter="pending" class="filter-tab inline-block p-4 border-b-2 border-blue-600 text-blue-600 rounded-t-lg active">
Pending <span id="pending-count" class="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">0</span> </button> </li> <li class="mr-2"> <button data-filter="approved" class="filter-tab inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
Approved <span id="approved-count" class="ml-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">0</span> </button> </li> <li class="mr-2"> <button data-filter="rejected" class="filter-tab inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
Rejected <span id="rejected-count" class="ml-1 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">0</span> </button> </li> <li class="mr-2"> <button data-filter="all" class="filter-tab inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
All
</button> </li> </ul> </div> <!-- Loading state --> <div id="loading" class="flex justify-center items-center py-12"> <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> </div> <!-- Error state --> <div id="error" class="hidden bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6"> <p class="text-red-800 dark:text-red-200" id="error-message"></p> </div> <!-- Claims list --> <div id="claims-container" class="hidden space-y-4"> <!-- Claims will be dynamically inserted here --> </div> <!-- Empty state --> <div id="empty-state" class="hidden text-center py-12"> <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path> </svg> <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No claims found</h3> <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">No tool claims match your filter criteria.</p> </div> </div>  <div id="rejection-modal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"> <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"> <div class="mt-3"> <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
Reject Claim Request
</h3> <div class="mt-2 px-7 py-3"> <label for="rejection-reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Reason for Rejection (Optional)
</label> <textarea id="rejection-reason" rows="4" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Provide a reason for rejection..."></textarea> </div> <div class="flex gap-3 px-4 py-3"> <button id="confirm-reject" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
Reject
</button> <button id="cancel-reject" class="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition">
Cancel
</button> </div> </div> </div> </div> ${renderScript($$result2, "/app/frontend/src/pages/admin/claims.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/app/frontend/src/pages/admin/claims.astro", void 0);

const $$file = "/app/frontend/src/pages/admin/claims.astro";
const $$url = "/admin/claims";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Claims,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_ngSGK97K.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_0VZwM4He.mjs';
export { renderers } from '../../renderers.mjs';

const $$FreeTools = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Free Tools Management - Admin"
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="free-tools-container"> <!-- Loading State --> <div id="loading" class="text-center py-12"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Loading free tools...</p> </div> <!-- Free Tools Content --> <div id="tools-content" class="hidden space-y-6"> <!-- Header with Add Button --> <div class="flex justify-between items-center"> <div> <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Free Tools</h2> <p class="text-gray-600 dark:text-gray-400 mt-1">Manage your free tools directory</p> </div> <button id="add-tool-btn" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" data-testid="add-tool-btn">
+ Add Free Tool
</button> </div> <!-- Search --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <div class="flex gap-4"> <input type="text" id="search-input" placeholder="Search tools..." class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" data-testid="search-input"> <button id="search-btn" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" data-testid="search-btn">
Search
</button> </div> </div> <!-- Tools Grid --> <div id="tools-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <!-- Tools will be rendered here --> </div> <div id="no-tools" class="hidden text-center py-12"> <p class="text-gray-600 dark:text-gray-400">No free tools found.</p> </div> </div> <!-- Error State --> <div id="error" class="hidden text-center py-12"> <p class="text-xl text-red-600 dark:text-red-400">Error loading free tools.</p> <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
Retry
</button> </div> </div>  <div id="tool-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4"> <div class="flex items-center justify-between mb-6"> <h2 id="modal-title" class="text-2xl font-bold text-gray-900 dark:text-white">Add Free Tool</h2> <button id="close-modal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <form id="tool-form" class="space-y-4"> <div> <label for="tool-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label> <input type="text" id="tool-name" required class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="Tool name"> </div> <div> <label for="tool-link" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Link *</label> <input type="url" id="tool-link" required class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="https://example.com"> </div> <div> <label for="tool-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label> <textarea id="tool-description" rows="4" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" placeholder="Brief description of the tool"></textarea> </div> <div class="flex justify-end space-x-3 pt-4"> <button type="button" id="cancel-btn" class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
Cancel
</button> <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" data-testid="save-tool-btn">
Save Tool
</button> </div> </form> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/admin/free-tools.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/admin/free-tools.astro", void 0);

const $$file = "/app/frontend/src/pages/admin/free-tools.astro";
const $$url = "/admin/free-tools";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$FreeTools,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

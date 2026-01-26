import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CiGCQnlW.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_DRpkFXGC.mjs';
export { renderers } from '../../renderers.mjs';

const $$Categories = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Categories Management - Admin"
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="categories-management" class="space-y-6"> <!-- Header with Actions --> <div class="flex items-center justify-between"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Categories Management</h2> <button id="create-category-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" data-testid="create-category-btn">
+ Add New Category
</button> </div> <!-- Loading State --> <div id="loading" class="text-center py-12"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Loading categories...</p> </div> <!-- Categories Grid --> <div id="categories-grid" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> <!-- Categories will be rendered here --> </div> <!-- Empty State --> <div id="empty-state" class="hidden text-center py-12"> <p class="text-gray-500 dark:text-gray-400">No categories yet. Create your first category!</p> </div> </div>  <div id="category-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"> <div class="p-6"> <div class="flex items-center justify-between mb-6"> <h3 id="modal-title" class="text-2xl font-bold text-gray-900 dark:text-white">Add New Category</h3> <button id="close-modal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <form id="category-form" class="space-y-6"> <input type="hidden" id="category-id"> <!-- Name --> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Name *</label> <input type="text" id="category-name" required class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"> </div> <!-- Description --> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label> <textarea id="category-description" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea> </div> <!-- SEO Fields --> <div class="border-t border-gray-200 dark:border-gray-700 pt-4"> <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO Settings</h4> <div class="space-y-4"> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SEO Title</label> <input type="text" id="category-seo-title" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"> </div> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SEO Description</label> <textarea id="category-seo-description" rows="2" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea> </div> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SEO Keywords</label> <input type="text" id="category-seo-keywords" placeholder="keyword1, keyword2, keyword3" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"> </div> </div> </div> <div class="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700"> <button type="button" id="cancel-btn" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
Cancel
</button> <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" data-testid="save-category-btn">
Save Category
</button> </div> </form> </div> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/admin/categories.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/admin/categories.astro", void 0);

const $$file = "/app/frontend/src/pages/admin/categories.astro";
const $$url = "/admin/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Categories,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

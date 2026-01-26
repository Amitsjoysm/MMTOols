import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CiGCQnlW.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../chunks/PageLayout_BPU-MuxB.mjs';
export { renderers } from '../../renderers.mjs';

const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "My Dashboard - MarketMindAI",
    description: "Manage your profile, favorite tools, and activity."
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"> <!-- Loading State --> <div id="loading" class="text-center py-12"> <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p> </div> <!-- Not Logged In State --> <div id="not-logged-in" class="hidden text-center py-12"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please Log In</h2> <p class="text-gray-600 dark:text-gray-400 mb-6">You need to be logged in to access your dashboard.</p> <a href="/auth/login" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
Log In
</a> </div> <!-- Dashboard Content --> <div id="dashboard-content" class="hidden space-y-8"> <!-- User Header --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"> <div class="flex items-start justify-between"> <div class="flex items-start space-x-6"> <div id="user-avatar" class="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold"></div> <div> <h1 id="user-name" class="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="user-name"></h1> <p id="user-email" class="text-gray-600 dark:text-gray-400 mb-4" data-testid="user-email"></p> <p id="user-bio" class="text-gray-700 dark:text-gray-300" data-testid="user-bio"></p> </div> </div> <button id="edit-profile-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" data-testid="edit-profile-btn">
Edit Profile
</button> </div> </div> <!-- Stats Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="stat-total-blogs"> <div class="text-3xl font-bold text-blue-600 dark:text-blue-400" id="stat-blogs">0</div> <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Blogs</div> </div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="stat-published-blogs"> <div class="text-3xl font-bold text-green-600 dark:text-green-400" id="stat-published">0</div> <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Published</div> </div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="stat-total-reviews"> <div class="text-3xl font-bold text-purple-600 dark:text-purple-400" id="stat-reviews">0</div> <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Reviews Written</div> </div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-testid="stat-favorite-tools"> <div class="text-3xl font-bold text-yellow-600 dark:text-yellow-400" id="stat-favorites">0</div> <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Favorite Tools</div> </div> </div> <!-- Recent Blogs --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <div class="flex items-center justify-between mb-6"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Recent Blogs</h2> <a href="/user/blogs" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
View All →
</a> </div> <div id="recent-blogs" data-testid="recent-blogs-list"> <!-- Blogs will be rendered here --> </div> </div> </div> </div>  <div id="edit-profile-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h2> <form id="edit-profile-form" class="space-y-4"> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label> <input type="text" id="edit-full-name" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" data-testid="edit-full-name-input"> </div> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label> <textarea id="edit-bio" rows="4" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" data-testid="edit-bio-input"></textarea> </div> <div class="flex items-center justify-end space-x-4"> <button type="button" id="cancel-edit-btn" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" data-testid="cancel-edit-btn">
Cancel
</button> <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" data-testid="save-profile-btn">
Save Changes
</button> </div> </form> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/user/dashboard.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/user/dashboard.astro", void 0);

const $$file = "/app/frontend/src/pages/user/dashboard.astro";
const $$url = "/user/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { c as createComponent, b as addAttribute, e as renderHead, d as renderScript, a as renderTemplate } from '../../chunks/astro/server_DmgvrA-F.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                        */
export { renderers } from '../../renderers.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Admin Login - MarketMindAI",
    description: "Admin & SuperAdmin access to MarketMindAI dashboard"
  };
  return renderTemplate`<html lang="en" class="motion-safe:scroll-smooth 2xl:text-[20px]"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${metadata.title}</title><meta name="description"${addAttribute(metadata.description, "content")}><meta name="robots" content="noindex, nofollow">${renderHead()}</head> <body class="antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen flex items-center justify-center"> <div class="w-full max-w-md px-4"> <!-- Logo and Header --> <div class="text-center mb-8"> <a href="/" class="inline-block mb-4"> <div class="flex items-center justify-center space-x-2"> <svg class="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg> <span class="text-2xl font-bold text-white">MarketMindAI</span> </div> </a> <h1 class="text-3xl font-bold text-white mb-2">Admin Access</h1> <p class="text-purple-200">Restricted to authorized administrators only</p> </div> <!-- Admin Notice --> <div class="bg-purple-900/50 border border-purple-500/50 rounded-lg p-4 mb-6"> <div class="flex items-start"> <svg class="w-5 h-5 text-purple-300 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <div> <p class="text-sm text-purple-100 font-medium mb-1">Administrator Portal</p> <p class="text-xs text-purple-300">This area is for admins and superadmins only. Regular users should use the <a href="/auth/login" class="underline hover:text-purple-200">public login page</a>.</p> </div> </div> </div> <!-- Login Form --> <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"> <!-- Error Message --> <div id="error-message" class="hidden mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg"> <p class="text-sm text-red-200"></p> </div> <form id="admin-login-form" class="space-y-6"> <!-- Email --> <div> <label for="email" class="block text-sm font-medium text-white mb-2">
Admin Email
</label> <input type="email" id="email" name="email" required autocomplete="email" class="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="admin@marketmindai.com"> </div> <!-- Password --> <div> <label for="password" class="block text-sm font-medium text-white mb-2">
Password
</label> <input type="password" id="password" name="password" required autocomplete="current-password" class="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="••••••••"> </div> <!-- Remember Me --> <div class="flex items-center justify-between"> <label class="flex items-center"> <input type="checkbox" id="remember" name="remember" class="w-4 h-4 rounded border-white/30 bg-white/10 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"> <span class="ml-2 text-sm text-purple-200">Remember me</span> </label> </div> <!-- Submit Button --> <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg">
Sign In as Admin
</button> </form> </div> <!-- Back Links --> <div class="text-center mt-6 space-y-2"> <a href="/auth/login" class="block text-sm text-purple-200 hover:text-white">
← Not an admin? Use public login
</a> <a href="/" class="block text-sm text-purple-300 hover:text-purple-100">
Back to Home
</a> </div> </div> ${renderScript($$result, "/app/frontend/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/app/frontend/src/pages/admin/login.astro", void 0);

const $$file = "/app/frontend/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

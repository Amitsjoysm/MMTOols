import { c as createComponent, b as addAttribute, e as renderHead, d as renderScript, a as renderTemplate } from '../../chunks/astro/server_ngSGK97K.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                        */
export { renderers } from '../../renderers.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Login - MarketMindAI",
    description: "Sign in to your MarketMindAI account"
  };
  return renderTemplate`<html lang="en" class="motion-safe:scroll-smooth 2xl:text-[20px]"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${metadata.title}</title><meta name="description"${addAttribute(metadata.description, "content")}><meta name="robots" content="noindex, nofollow">${renderHead()}</head> <body class="antialiased bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center"> <div class="w-full max-w-md px-4"> <!-- Logo and Header --> <div class="text-center mb-8"> <a href="/" class="inline-block mb-4"> <div class="flex items-center justify-center space-x-2"> <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path> </svg> <span class="text-2xl font-bold text-gray-900 dark:text-white">MarketMindAI</span> </div> </a> <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1> <p class="text-gray-600 dark:text-gray-400">Sign in to your account</p> </div> <!-- Login Form --> <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"> <form id="login-form" class="space-y-6"> <!-- Email --> <div> <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Email Address
</label> <input type="email" id="email" name="email" required autocomplete="email" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="you@example.com" data-testid="email-input"> </div> <!-- Password --> <div> <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Password
</label> <input type="password" id="password" name="password" required autocomplete="current-password" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="••••••••" data-testid="password-input"> </div> <!-- Remember Me --> <div class="flex items-center justify-between"> <div class="flex items-center"> <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"> <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
Remember me
</label> </div> <a href="/auth/forgot-password" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
Forgot password?
</a> </div> <!-- Error Message --> <div id="error-message" class="hidden p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm"></div> <!-- Submit Button --> <button type="submit" class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl" data-testid="login-btn">
Sign In
</button> </form> <!-- Register Link --> <div class="mt-6 text-center"> <p class="text-sm text-gray-600 dark:text-gray-400">
Don't have an account?
<a href="/auth/register" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
Sign up
</a> </p> </div> </div> <!-- Back to Home --> <div class="text-center mt-6"> <a href="/" class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
← Back to Home
</a> </div> </div> ${renderScript($$result, "/app/frontend/src/pages/auth/login.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/app/frontend/src/pages/auth/login.astro", void 0);

const $$file = "/app/frontend/src/pages/auth/login.astro";
const $$url = "/auth/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

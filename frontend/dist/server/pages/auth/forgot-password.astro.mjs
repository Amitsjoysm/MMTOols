import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CiGCQnlW.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../chunks/PageLayout_BPU-MuxB.mjs';
export { renderers } from '../../renderers.mjs';

const $$ForgotPassword = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Forgot Password - MarketMindAI",
    description: "Reset your password"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center px-4 py-12"> <div class="max-w-md w-full space-y-8"> <div class="text-center"> <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
Forgot Password?
</h2> <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
Enter your email address and we'll send you a link to reset your password
</p> </div> <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"> <form id="forgot-password-form" class="space-y-6"> <div> <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Email Address
</label> <input type="email" id="email" name="email" required class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="your@email.com" data-testid="email-input"> </div> <div id="form-message" class="hidden"></div> <button type="submit" class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" data-testid="submit-forgot-password-btn">
Send Reset Link
</button> </form> <div class="mt-6 text-center"> <a href="/auth/login" class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
Back to Login
</a> </div> </div> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/auth/forgot-password.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/auth/forgot-password.astro", void 0);

const $$file = "/app/frontend/src/pages/auth/forgot-password.astro";
const $$url = "/auth/forgot-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ForgotPassword,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

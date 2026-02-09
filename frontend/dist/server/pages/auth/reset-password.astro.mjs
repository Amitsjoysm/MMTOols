import { f as createAstro, c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Chl_MonH.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../chunks/PageLayout_BLdQrLIn.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://marketmindai.com");
const $$ResetPassword = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ResetPassword;
  const metadata = {
    title: "Reset Password - MarketMindAI",
    description: "Create a new password"
  };
  const token = Astro2.url.searchParams.get("token");
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center px-4 py-12"> <div class="max-w-md w-full space-y-8"> <div class="text-center"> <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
Reset Password
</h2> <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
Enter your new password below
</p> </div> <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"> ${!token ? renderTemplate`<div class="text-center text-red-600 dark:text-red-400"> <p>Invalid or missing reset token. Please request a new password reset link.</p> <a href="/auth/forgot-password" class="mt-4 inline-block text-blue-600 hover:text-blue-700">
Request New Link
</a> </div>` : renderTemplate`<form id="reset-password-form" class="space-y-6"> <input type="hidden" id="token"${addAttribute(token, "value")}> <div> <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
New Password
</label> <input type="password" id="password" name="password" required minlength="8" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter new password" data-testid="password-input"> <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">At least 8 characters</p> </div> <div> <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Confirm Password
</label> <input type="password" id="confirm-password" name="confirm-password" required minlength="8" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Confirm new password" data-testid="confirm-password-input"> </div> <div id="form-message" class="hidden"></div> <button type="submit" class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" data-testid="submit-reset-password-btn">
Reset Password
</button> </form>`} </div> <div class="text-center"> <a href="/auth/login" class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
Back to Login
</a> </div> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/auth/reset-password.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/auth/reset-password.astro", void 0);

const $$file = "/app/frontend/src/pages/auth/reset-password.astro";
const $$url = "/auth/reset-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ResetPassword,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

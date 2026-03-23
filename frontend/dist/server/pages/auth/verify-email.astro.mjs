import { f as createAstro, c as createComponent, a as renderTemplate, h as defineScriptVars, r as renderComponent, m as maybeRenderHead } from '../../chunks/astro/server_CZk8NOd-.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../chunks/PageLayout_CQTO3tfd.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://marketmindai.com");
const $$VerifyEmail = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$VerifyEmail;
  const metadata = {
    title: "Verify Email - MarketMindAI",
    description: "Verify your email address"
  };
  const token = Astro2.url.searchParams.get("token");
  return renderTemplate(_a || (_a = __template(["", " <script>(function(){", `
  // Dynamic API URL detection
  function getApiBaseUrl() {
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      if (currentOrigin.includes('preview.app.github.dev') || 
          currentOrigin.includes('github.dev') ||
          currentOrigin.includes('preview.emergentagent.com')) {
        return currentOrigin.replace(':3000', ':8001').replace('3000-', '8001-');
      }
    }
    return 'http://localhost:8001';
  }
  
  const API_BASE_URL = getApiBaseUrl();

  // Token-based verification (from email link)
  if (token) {
    const verifyToken = async () => {
      try {
        const response = await fetch(\`\${API_BASE_URL}/api/auth/verify-email/\${token}\`, {
          method: 'POST',
        });

        const statusDiv = document.getElementById('verification-status');
        if (response.ok) {
          statusDiv.innerHTML = \`
            <div class="text-green-600 dark:text-green-400">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-xl font-bold mt-4">Email Verified!</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Your email has been successfully verified.</p>
              <a href="/auth/login" class="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go to Login</a>
            </div>
          \`;
        } else {
          const error = await response.json();
          statusDiv.innerHTML = \`
            <div class="text-red-600 dark:text-red-400">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-xl font-bold mt-4">Verification Failed</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">\${error.detail || 'Invalid or expired verification link'}</p>
              <a href="/auth/verify-email" class="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try OTP Verification</a>
            </div>
          \`;
        }
      } catch (error) {
        console.error('Verification error:', error);
      }
    };
    verifyToken();
  }

  // OTP verification form
  const otpForm = document.getElementById('otp-form') as HTMLFormElement;
  if (otpForm) {
    otpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const messageDiv = document.getElementById('otp-message');
      const submitBtn = otpForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const email = (document.getElementById('email') as HTMLInputElement).value;
      const otp = (document.getElementById('otp') as HTMLInputElement).value;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verifying...';
      messageDiv.classList.add('hidden');

      try {
        const response = await fetch(\`\${API_BASE_URL}/api/auth/verify-otp\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp_code: otp }),
        });

        if (response.ok) {
          messageDiv.className = 'p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg';
          messageDiv.textContent = 'Email verified successfully! Redirecting to login...';
          messageDiv.classList.remove('hidden');
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
        } else {
          const error = await response.json();
          throw new Error(error.detail || 'Verification failed');
        }
      } catch (error) {
        messageDiv.className = 'p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg';
        messageDiv.textContent = error.message || 'Invalid verification code. Please try again.';
        messageDiv.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verify Email';
      }
    });

    // Resend verification
    const resendBtn = document.getElementById('resend-btn');
    resendBtn?.addEventListener('click', async () => {
      const email = (document.getElementById('email') as HTMLInputElement).value;
      if (!email) {
        alert('Please enter your email address');
        return;
      }

      const messageDiv = document.getElementById('otp-message');
      try {
        const response = await fetch(\`\${API_BASE_URL}/api/auth/resend-verification\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          messageDiv.className = 'p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg';
          messageDiv.textContent = 'Verification code sent! Please check your email.';
        } else {
          throw new Error('Failed to resend verification');
        }
      } catch (error) {
        messageDiv.className = 'p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg';
        messageDiv.textContent = 'Failed to resend verification code. Please try again.';
      }
      messageDiv.classList.remove('hidden');
    });
  }
})();<\/script>`], ["", " <script>(function(){", `
  // Dynamic API URL detection
  function getApiBaseUrl() {
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      if (currentOrigin.includes('preview.app.github.dev') || 
          currentOrigin.includes('github.dev') ||
          currentOrigin.includes('preview.emergentagent.com')) {
        return currentOrigin.replace(':3000', ':8001').replace('3000-', '8001-');
      }
    }
    return 'http://localhost:8001';
  }
  
  const API_BASE_URL = getApiBaseUrl();

  // Token-based verification (from email link)
  if (token) {
    const verifyToken = async () => {
      try {
        const response = await fetch(\\\`\\\${API_BASE_URL}/api/auth/verify-email/\\\${token}\\\`, {
          method: 'POST',
        });

        const statusDiv = document.getElementById('verification-status');
        if (response.ok) {
          statusDiv.innerHTML = \\\`
            <div class="text-green-600 dark:text-green-400">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-xl font-bold mt-4">Email Verified!</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Your email has been successfully verified.</p>
              <a href="/auth/login" class="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go to Login</a>
            </div>
          \\\`;
        } else {
          const error = await response.json();
          statusDiv.innerHTML = \\\`
            <div class="text-red-600 dark:text-red-400">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-xl font-bold mt-4">Verification Failed</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-400">\\\${error.detail || 'Invalid or expired verification link'}</p>
              <a href="/auth/verify-email" class="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Try OTP Verification</a>
            </div>
          \\\`;
        }
      } catch (error) {
        console.error('Verification error:', error);
      }
    };
    verifyToken();
  }

  // OTP verification form
  const otpForm = document.getElementById('otp-form') as HTMLFormElement;
  if (otpForm) {
    otpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const messageDiv = document.getElementById('otp-message');
      const submitBtn = otpForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const email = (document.getElementById('email') as HTMLInputElement).value;
      const otp = (document.getElementById('otp') as HTMLInputElement).value;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verifying...';
      messageDiv.classList.add('hidden');

      try {
        const response = await fetch(\\\`\\\${API_BASE_URL}/api/auth/verify-otp\\\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp_code: otp }),
        });

        if (response.ok) {
          messageDiv.className = 'p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg';
          messageDiv.textContent = 'Email verified successfully! Redirecting to login...';
          messageDiv.classList.remove('hidden');
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
        } else {
          const error = await response.json();
          throw new Error(error.detail || 'Verification failed');
        }
      } catch (error) {
        messageDiv.className = 'p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg';
        messageDiv.textContent = error.message || 'Invalid verification code. Please try again.';
        messageDiv.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verify Email';
      }
    });

    // Resend verification
    const resendBtn = document.getElementById('resend-btn');
    resendBtn?.addEventListener('click', async () => {
      const email = (document.getElementById('email') as HTMLInputElement).value;
      if (!email) {
        alert('Please enter your email address');
        return;
      }

      const messageDiv = document.getElementById('otp-message');
      try {
        const response = await fetch(\\\`\\\${API_BASE_URL}/api/auth/resend-verification\\\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          messageDiv.className = 'p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg';
          messageDiv.textContent = 'Verification code sent! Please check your email.';
        } else {
          throw new Error('Failed to resend verification');
        }
      } catch (error) {
        messageDiv.className = 'p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg';
        messageDiv.textContent = 'Failed to resend verification code. Please try again.';
      }
      messageDiv.classList.remove('hidden');
    });
  }
})();<\/script>`])), renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen flex items-center justify-center px-4 py-12"> <div class="max-w-md w-full space-y-8"> <div class="text-center"> <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
Email Verification
</h2> <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
Verify your email to activate your account
</p> </div> <!-- Token Verification (if token in URL) --> ${token && renderTemplate`<div id="token-verification" class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"> <div id="verification-status" class="text-center"> <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Verifying your email...</p> </div> </div>`} <!-- OTP Verification Form --> ${!token && renderTemplate`<div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"> <form id="otp-form" class="space-y-6"> <div> <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Email Address
</label> <input type="email" id="email" name="email" required class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="your@email.com" data-testid="email-input"> </div> <div> <label for="otp" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Verification Code
</label> <input type="text" id="otp" name="otp" required maxlength="6" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest" placeholder="000000" data-testid="otp-input"> </div> <div id="otp-message" class="hidden"></div> <button type="submit" class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" data-testid="verify-otp-btn">
Verify Email
</button> <div class="text-center"> <button type="button" id="resend-btn" class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" data-testid="resend-verification-btn">
Resend verification code
</button> </div> </form> </div>`} <div class="text-center"> <a href="/auth/login" class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
Back to Login
</a> </div> </div> </div> ` }), defineScriptVars({ token }));
}, "/app/frontend/src/pages/auth/verify-email.astro", void 0);

const $$file = "/app/frontend/src/pages/auth/verify-email.astro";
const $$url = "/auth/verify-email";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$VerifyEmail,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

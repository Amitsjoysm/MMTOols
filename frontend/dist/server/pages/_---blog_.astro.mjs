import { f as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderComponent, a as renderTemplate, h as defineScriptVars, F as Fragment, g as renderSlot, u as unescapeHTML } from '../chunks/astro/server_ngSGK97K.mjs';
import 'piccolore';
import merge from 'lodash.merge';
import { a as $$Button, $ as $$PageLayout } from '../chunks/PageLayout_DHnoqYNQ.mjs';
import { $ as $$Icon } from '../chunks/Logo_CA0law7c.mjs';
import { $ as $$Image } from '../chunks/Image_BhzUZ2n3.mjs';
import { $ as $$Tags } from '../chunks/Tags_D7m3cmo5.mjs';
import 'clsx';
/* empty css                                 */
import { f as getFormattedDate, c as getPermalink, d as getBlogPermalink, S as SITE, b as getCanonical } from '../chunks/permalinks_DwY3Cg8-.mjs';
import { h as findPostsByIds, i as getRelatedPosts, j as blogPostRobots, k as getStaticPathsBlogPost } from '../chunks/blog_D2J8Pj0v.mjs';
import { f as findImage } from '../chunks/Layout_fiUNp7WV.mjs';
import { $ as $$WidgetWrapper } from '../chunks/WidgetWrapper_D7lvtMl-.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$9 = createAstro("https://marketmindai.com");
const $$SocialShare = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$SocialShare;
  const { text, url, class: className = "inline-block" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(className, "class")}> <span class="align-super font-bold text-slate-500 dark:text-slate-400">Share:</span> <button class="ml-2 rtl:ml-0 rtl:mr-2" title="Twitter Share" data-aw-social-share="twitter"${addAttribute(url, "data-aw-url")}${addAttribute(text, "data-aw-text")}>${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-x", "class": "w-6 h-6 text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-slate-300" })} </button> <button class="ml-2 rtl:ml-0 rtl:mr-2" title="Facebook Share" data-aw-social-share="facebook"${addAttribute(url, "data-aw-url")}>${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-facebook", "class": "w-6 h-6 text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-slate-300" })} </button> <button class="ml-2 rtl:ml-0 rtl:mr-2" title="Linkedin Share" data-aw-social-share="linkedin"${addAttribute(url, "data-aw-url")}${addAttribute(text, "data-aw-text")}>${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-linkedin", "class": "w-6 h-6 text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-slate-300" })} </button> <button class="ml-2 rtl:ml-0 rtl:mr-2" title="Whatsapp Share" data-aw-social-share="whatsapp"${addAttribute(url, "data-aw-url")}${addAttribute(text, "data-aw-text")}>${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:brand-whatsapp", "class": "w-6 h-6 text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-slate-300" })} </button> <button class="ml-2 rtl:ml-0 rtl:mr-2" title="Email Share" data-aw-social-share="mail"${addAttribute(url, "data-aw-url")}${addAttribute(text, "data-aw-text")}>${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:mail", "class": "w-6 h-6 text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-slate-300" })} </button> </div>`;
}, "/app/frontend/src/components/common/SocialShare.astro", void 0);

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(raw || cooked.slice()) }));
var _a$2;
const $$Astro$8 = createAstro("https://marketmindai.com");
const $$LikeButton = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$LikeButton;
  const { contentSlug, contentType, initialLikeCount = 0, className = "" } = Astro2.props;
  const likeId = `like-${contentType}-${contentSlug}`;
  return renderTemplate(_a$2 || (_a$2 = __template$2(["", "<div", "", ' data-astro-cid-aruymhrl> <button class="like-button inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all group" data-testid="like-button" data-astro-cid-aruymhrl> <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-aruymhrl> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" data-astro-cid-aruymhrl></path> </svg> <span class="like-count text-sm font-medium text-gray-700 dark:text-gray-300" data-testid="like-count" data-astro-cid-aruymhrl> ', ' </span> </button> <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center auth-message hidden" data-astro-cid-aruymhrl>\nLogin to like\n</p> </div> <script>(function(){', "\n  // Dynamic API URL detection\n  function getApiBaseUrl() {\n    // Priority 1: Check environment variable\n    const envApiUrl = import.meta.env.PUBLIC_API_URL;\n    if (envApiUrl) {\n      return envApiUrl;\n    }\n    \n    // Priority 2: For Codespaces/Preview environments\n    if (typeof window !== 'undefined') {\n      const currentOrigin = window.location.origin;\n      if (currentOrigin.includes('preview.app.github.dev') || \n          currentOrigin.includes('github.dev') ||\n          currentOrigin.includes('preview.emergentagent.com')) {\n        return currentOrigin.replace(':3000', ':8001').replace('3000-', '8001-');\n      }\n    }\n    \n    // Priority 3: Default to localhost\n    return 'http://localhost:8001';\n  }\n  \n  const API_BASE_URL = getApiBaseUrl();\n  const isAuthenticated = !!localStorage.getItem('auth_token');\n  \n  const likeButton = document.querySelector(`#like-${contentType}-${contentSlug} .like-button`) as HTMLButtonElement;\n  const likeCount = document.querySelector(`#like-${contentType}-${contentSlug} .like-count`);\n  const authMessage = document.querySelector(`#like-${contentType}-${contentSlug} .auth-message`);\n  const heartIcon = likeButton?.querySelector('svg');\n\n  if (!isAuthenticated && authMessage) {\n    authMessage.classList.remove('hidden');\n  }\n\n  if (likeButton) {\n    likeButton.addEventListener('click', async () => {\n      if (!isAuthenticated) {\n        window.location.href = '/auth/login';\n        return;\n      }\n\n      try {\n        const token = localStorage.getItem('auth_token');\n        const response = await fetch(`${API_BASE_URL}/api/${contentType}s/${contentSlug}/like`, {\n          method: 'POST',\n          headers: {\n            'Authorization': `Bearer ${token}`,\n          },\n        });\n\n        if (response.ok) {\n          const data = await response.json();\n          \n          // Update count\n          if (likeCount) {\n            likeCount.textContent = data.like_count.toString();\n          }\n\n          // Toggle heart icon fill\n          if (heartIcon) {\n            if (data.liked) {\n              heartIcon.setAttribute('fill', 'currentColor');\n              heartIcon.classList.add('text-red-500');\n              heartIcon.classList.remove('text-gray-500', 'dark:text-gray-400');\n            } else {\n              heartIcon.setAttribute('fill', 'none');\n              heartIcon.classList.remove('text-red-500');\n              heartIcon.classList.add('text-gray-500', 'dark:text-gray-400');\n            }\n          }\n\n          // Animate button\n          likeButton.classList.add('scale-110');\n          setTimeout(() => likeButton.classList.remove('scale-110'), 200);\n        }\n      } catch (error) {\n        console.error('Error toggling like:', error);\n      }\n    });\n  }\n})();</script> "], ["", "<div", "", ' data-astro-cid-aruymhrl> <button class="like-button inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all group" data-testid="like-button" data-astro-cid-aruymhrl> <svg class="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-aruymhrl> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" data-astro-cid-aruymhrl></path> </svg> <span class="like-count text-sm font-medium text-gray-700 dark:text-gray-300" data-testid="like-count" data-astro-cid-aruymhrl> ', ' </span> </button> <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center auth-message hidden" data-astro-cid-aruymhrl>\nLogin to like\n</p> </div> <script>(function(){', "\n  // Dynamic API URL detection\n  function getApiBaseUrl() {\n    // Priority 1: Check environment variable\n    const envApiUrl = import.meta.env.PUBLIC_API_URL;\n    if (envApiUrl) {\n      return envApiUrl;\n    }\n    \n    // Priority 2: For Codespaces/Preview environments\n    if (typeof window !== 'undefined') {\n      const currentOrigin = window.location.origin;\n      if (currentOrigin.includes('preview.app.github.dev') || \n          currentOrigin.includes('github.dev') ||\n          currentOrigin.includes('preview.emergentagent.com')) {\n        return currentOrigin.replace(':3000', ':8001').replace('3000-', '8001-');\n      }\n    }\n    \n    // Priority 3: Default to localhost\n    return 'http://localhost:8001';\n  }\n  \n  const API_BASE_URL = getApiBaseUrl();\n  const isAuthenticated = !!localStorage.getItem('auth_token');\n  \n  const likeButton = document.querySelector(\\`#like-\\${contentType}-\\${contentSlug} .like-button\\`) as HTMLButtonElement;\n  const likeCount = document.querySelector(\\`#like-\\${contentType}-\\${contentSlug} .like-count\\`);\n  const authMessage = document.querySelector(\\`#like-\\${contentType}-\\${contentSlug} .auth-message\\`);\n  const heartIcon = likeButton?.querySelector('svg');\n\n  if (!isAuthenticated && authMessage) {\n    authMessage.classList.remove('hidden');\n  }\n\n  if (likeButton) {\n    likeButton.addEventListener('click', async () => {\n      if (!isAuthenticated) {\n        window.location.href = '/auth/login';\n        return;\n      }\n\n      try {\n        const token = localStorage.getItem('auth_token');\n        const response = await fetch(\\`\\${API_BASE_URL}/api/\\${contentType}s/\\${contentSlug}/like\\`, {\n          method: 'POST',\n          headers: {\n            'Authorization': \\`Bearer \\${token}\\`,\n          },\n        });\n\n        if (response.ok) {\n          const data = await response.json();\n          \n          // Update count\n          if (likeCount) {\n            likeCount.textContent = data.like_count.toString();\n          }\n\n          // Toggle heart icon fill\n          if (heartIcon) {\n            if (data.liked) {\n              heartIcon.setAttribute('fill', 'currentColor');\n              heartIcon.classList.add('text-red-500');\n              heartIcon.classList.remove('text-gray-500', 'dark:text-gray-400');\n            } else {\n              heartIcon.setAttribute('fill', 'none');\n              heartIcon.classList.remove('text-red-500');\n              heartIcon.classList.add('text-gray-500', 'dark:text-gray-400');\n            }\n          }\n\n          // Animate button\n          likeButton.classList.add('scale-110');\n          setTimeout(() => likeButton.classList.remove('scale-110'), 200);\n        }\n      } catch (error) {\n        console.error('Error toggling like:', error);\n      }\n    });\n  }\n})();</script> "])), maybeRenderHead(), addAttribute(`like-button-wrapper ${className}`, "class"), addAttribute(likeId, "id"), initialLikeCount, defineScriptVars({ contentSlug, contentType }));
}, "/app/frontend/src/components/ui/LikeButton.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$7 = createAstro("https://marketmindai.com");
const $$Comments = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Comments;
  const { contentSlug, contentType, className = "" } = Astro2.props;
  const commentId = `comments-${contentSlug}`;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", "<div", "", '> <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6" data-testid="comments-heading">\nComments\n</h3> <!-- Login prompt for non-authenticated users --> <div id="auth-prompt" class="hidden mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg"> <p class="text-gray-700 dark:text-gray-300">\nPlease <a href="/auth/login" class="text-blue-600 hover:text-blue-700 font-medium">login</a> to leave a comment.\n</p> </div> <!-- Comment Form --> <form id="comment-form" class="mb-8 hidden"> <textarea id="comment-content" rows="4" required placeholder="Share your thoughts..." class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" data-testid="comment-textarea"></textarea> <div class="mt-3 flex justify-between items-center"> <div id="comment-message" class="text-sm hidden"></div> <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" data-testid="submit-comment-btn">\nPost Comment\n</button> </div> </form> <!-- Comments List --> <div id="comments-list" class="space-y-6"> <div class="text-center py-8"> <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div> <p class="mt-2 text-gray-600 dark:text-gray-400">Loading comments...</p> </div> </div> </div> <script>(function(){', `
  // Dynamic API URL detection
  function getApiBaseUrl() {
    // Priority 1: Check environment variable
    const envApiUrl = import.meta.env.PUBLIC_API_URL;
    if (envApiUrl) {
      return envApiUrl;
    }
    
    // Priority 2: For Codespaces/Preview environments
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      if (currentOrigin.includes('preview.app.github.dev') || 
          currentOrigin.includes('github.dev') ||
          currentOrigin.includes('preview.emergentagent.com')) {
        return currentOrigin.replace(':3000', ':8001').replace('3000-', '8001-');
      }
    }
    
    // Priority 3: Default to localhost
    return 'http://localhost:8001';
  }
  
  const API_BASE_URL = getApiBaseUrl();
  
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('auth_token');
  const authPrompt = document.getElementById('auth-prompt');
  const commentForm = document.getElementById('comment-form') as HTMLFormElement;
  
  if (isAuthenticated && commentForm) {
    commentForm.classList.remove('hidden');
  } else if (authPrompt) {
    authPrompt.classList.remove('hidden');
  }

  // Load comments
  async function loadComments() {
    const commentsList = document.getElementById('comments-list');
    try {
      const response = await fetch(\`\${API_BASE_URL}/api/\${contentType}s/\${contentSlug}/comments\`);
      const comments = await response.json();

      if (comments.length === 0) {
        commentsList.innerHTML = \`
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        \`;
        return;
      }

      commentsList.innerHTML = comments.map(comment => \`
        <div class="comment bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm" data-testid="comment-item">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                \${comment.user_name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  \${comment.user_name}
                </p>
                <time class="text-xs text-gray-500 dark:text-gray-400">
                  \${new Date(comment.created_at).toLocaleDateString()}
                </time>
              </div>
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                \${comment.content}
              </p>
              \${comment.replies && comment.replies.length > 0 ? \`
                <div class="mt-4 ml-6 space-y-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  \${comment.replies.map(reply => \`
                    <div class="comment-reply">
                      <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0">
                          <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            \${reply.user_name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-1">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">
                              \${reply.user_name}
                            </p>
                            <time class="text-xs text-gray-500 dark:text-gray-400">
                              \${new Date(reply.created_at).toLocaleDateString()}
                            </time>
                          </div>
                          <p class="text-sm text-gray-700 dark:text-gray-300">
                            \${reply.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  \`).join('')}
                </div>
              \` : ''}
            </div>
          </div>
        </div>
      \`).join('');
    } catch (error) {
      console.error('Error loading comments:', error);
      commentsList.innerHTML = \`
        <div class="text-center py-8 text-red-600 dark:text-red-400">
          <p>Failed to load comments. Please try again later.</p>
        </div>
      \`;
    }
  }

  // Submit comment
  if (commentForm) {
    const messageDiv = document.getElementById('comment-message');
    
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const textarea = document.getElementById('comment-content') as HTMLTextAreaElement;
      const submitBtn = commentForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const content = textarea.value.trim();
      
      if (!content) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Posting...';
      messageDiv.classList.add('hidden');

      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(\`\${API_BASE_URL}/api/\${contentType}s/\${contentSlug}/comments\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${token}\`,
          },
          body: JSON.stringify({ content }),
        });

        if (response.ok) {
          messageDiv.className = 'text-sm text-green-600 dark:text-green-400';
          messageDiv.textContent = 'Comment posted successfully!';
          messageDiv.classList.remove('hidden');
          textarea.value = '';
          
          // Reload comments
          await loadComments();
          
          setTimeout(() => messageDiv.classList.add('hidden'), 3000);
        } else {
          throw new Error('Failed to post comment');
        }
      } catch (error) {
        messageDiv.className = 'text-sm text-red-600 dark:text-red-400';
        messageDiv.textContent = 'Failed to post comment. Please try again.';
        messageDiv.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Comment';
      }
    });
  }

  // Initial load
  loadComments();
})();</script>`], ["", "<div", "", '> <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6" data-testid="comments-heading">\nComments\n</h3> <!-- Login prompt for non-authenticated users --> <div id="auth-prompt" class="hidden mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg"> <p class="text-gray-700 dark:text-gray-300">\nPlease <a href="/auth/login" class="text-blue-600 hover:text-blue-700 font-medium">login</a> to leave a comment.\n</p> </div> <!-- Comment Form --> <form id="comment-form" class="mb-8 hidden"> <textarea id="comment-content" rows="4" required placeholder="Share your thoughts..." class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" data-testid="comment-textarea"></textarea> <div class="mt-3 flex justify-between items-center"> <div id="comment-message" class="text-sm hidden"></div> <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" data-testid="submit-comment-btn">\nPost Comment\n</button> </div> </form> <!-- Comments List --> <div id="comments-list" class="space-y-6"> <div class="text-center py-8"> <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div> <p class="mt-2 text-gray-600 dark:text-gray-400">Loading comments...</p> </div> </div> </div> <script>(function(){', `
  // Dynamic API URL detection
  function getApiBaseUrl() {
    // Priority 1: Check environment variable
    const envApiUrl = import.meta.env.PUBLIC_API_URL;
    if (envApiUrl) {
      return envApiUrl;
    }
    
    // Priority 2: For Codespaces/Preview environments
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      if (currentOrigin.includes('preview.app.github.dev') || 
          currentOrigin.includes('github.dev') ||
          currentOrigin.includes('preview.emergentagent.com')) {
        return currentOrigin.replace(':3000', ':8001').replace('3000-', '8001-');
      }
    }
    
    // Priority 3: Default to localhost
    return 'http://localhost:8001';
  }
  
  const API_BASE_URL = getApiBaseUrl();
  
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('auth_token');
  const authPrompt = document.getElementById('auth-prompt');
  const commentForm = document.getElementById('comment-form') as HTMLFormElement;
  
  if (isAuthenticated && commentForm) {
    commentForm.classList.remove('hidden');
  } else if (authPrompt) {
    authPrompt.classList.remove('hidden');
  }

  // Load comments
  async function loadComments() {
    const commentsList = document.getElementById('comments-list');
    try {
      const response = await fetch(\\\`\\\${API_BASE_URL}/api/\\\${contentType}s/\\\${contentSlug}/comments\\\`);
      const comments = await response.json();

      if (comments.length === 0) {
        commentsList.innerHTML = \\\`
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        \\\`;
        return;
      }

      commentsList.innerHTML = comments.map(comment => \\\`
        <div class="comment bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm" data-testid="comment-item">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                \\\${comment.user_name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  \\\${comment.user_name}
                </p>
                <time class="text-xs text-gray-500 dark:text-gray-400">
                  \\\${new Date(comment.created_at).toLocaleDateString()}
                </time>
              </div>
              <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                \\\${comment.content}
              </p>
              \\\${comment.replies && comment.replies.length > 0 ? \\\`
                <div class="mt-4 ml-6 space-y-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  \\\${comment.replies.map(reply => \\\`
                    <div class="comment-reply">
                      <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0">
                          <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            \\\${reply.user_name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-1">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">
                              \\\${reply.user_name}
                            </p>
                            <time class="text-xs text-gray-500 dark:text-gray-400">
                              \\\${new Date(reply.created_at).toLocaleDateString()}
                            </time>
                          </div>
                          <p class="text-sm text-gray-700 dark:text-gray-300">
                            \\\${reply.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  \\\`).join('')}
                </div>
              \\\` : ''}
            </div>
          </div>
        </div>
      \\\`).join('');
    } catch (error) {
      console.error('Error loading comments:', error);
      commentsList.innerHTML = \\\`
        <div class="text-center py-8 text-red-600 dark:text-red-400">
          <p>Failed to load comments. Please try again later.</p>
        </div>
      \\\`;
    }
  }

  // Submit comment
  if (commentForm) {
    const messageDiv = document.getElementById('comment-message');
    
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const textarea = document.getElementById('comment-content') as HTMLTextAreaElement;
      const submitBtn = commentForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const content = textarea.value.trim();
      
      if (!content) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Posting...';
      messageDiv.classList.add('hidden');

      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(\\\`\\\${API_BASE_URL}/api/\\\${contentType}s/\\\${contentSlug}/comments\\\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': \\\`Bearer \\\${token}\\\`,
          },
          body: JSON.stringify({ content }),
        });

        if (response.ok) {
          messageDiv.className = 'text-sm text-green-600 dark:text-green-400';
          messageDiv.textContent = 'Comment posted successfully!';
          messageDiv.classList.remove('hidden');
          textarea.value = '';
          
          // Reload comments
          await loadComments();
          
          setTimeout(() => messageDiv.classList.add('hidden'), 3000);
        } else {
          throw new Error('Failed to post comment');
        }
      } catch (error) {
        messageDiv.className = 'text-sm text-red-600 dark:text-red-400';
        messageDiv.textContent = 'Failed to post comment. Please try again.';
        messageDiv.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Comment';
      }
    });
  }

  // Initial load
  loadComments();
})();</script>`])), maybeRenderHead(), addAttribute(`comments-section ${className}`, "class"), addAttribute(commentId, "id"), defineScriptVars({ contentSlug, contentType }));
}, "/app/frontend/src/components/ui/Comments.astro", void 0);

const $$Astro$6 = createAstro("https://marketmindai.com");
const $$SinglePost = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$SinglePost;
  const { post, url } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="py-8 sm:py-16 lg:py-20 mx-auto"> <article> <header${addAttribute(post.image ? "intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade" : "intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade", "class")}> <div class="flex justify-between flex-col sm:flex-row max-w-3xl mx-auto mt-0 mb-2 px-4 sm:px-6 sm:items-center"> <p> ${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:clock", "class": "w-4 h-4 inline-block -mt-0.5 dark:text-gray-400" })} <time${addAttribute(String(post.publishDate), "datetime")} class="inline-block">${getFormattedDate(post.publishDate)}</time> ${post.author && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${" "}
· ${renderComponent($$result2, "Icon", $$Icon, { "name": "tabler:user", "class": "w-4 h-4 inline-block -mt-0.5 dark:text-gray-400" })} <span class="inline-block">${post.author}</span> ` })}`} ${post.category && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${" "}
·${" "}<a class="hover:underline inline-block"${addAttribute(getPermalink(post.category.slug, "category"), "href")}> ${post.category.title} </a> ` })}`} ${post.readingTime && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`
&nbsp;· <span>${post.readingTime}</span> min read
` })}`} </p> </div> <h1 class="px-4 sm:px-6 max-w-3xl mx-auto text-4xl md:text-5xl font-bold leading-tighter tracking-tighter font-heading"> ${post.title} </h1> <p class="max-w-3xl mx-auto mt-4 mb-8 px-4 sm:px-6 text-xl md:text-2xl text-muted dark:text-slate-400 text-justify"> ${post.excerpt} </p> ${post.image ? renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": post.image, "class": "max-w-full lg:max-w-[900px] mx-auto mb-6 sm:rounded-md bg-gray-400 dark:bg-slate-700", "widths": [400, 900], "sizes": "(max-width: 900px) 400px, 900px", "alt": post?.excerpt || "", "width": 900, "height": 506, "loading": "eager", "decoding": "async" })}` : renderTemplate`<div class="max-w-3xl mx-auto px-4 sm:px-6"> <div class="border-t dark:border-slate-700"></div> </div>`} </header> <div class="mx-auto px-6 sm:px-6 max-w-3xl prose prose-md lg:prose-xl dark:prose-invert dark:prose-headings:text-slate-300 prose-headings:font-heading prose-headings:leading-tighter prose-headings:tracking-tighter prose-headings:font-bold prose-a:text-primary dark:prose-a:text-blue-400 prose-img:rounded-md prose-img:shadow-lg mt-8 prose-headings:scroll-mt-[80px] prose-li:my-0"> ${renderSlot($$result, $$slots["default"])} </div> <div class="mx-auto px-6 sm:px-6 max-w-3xl mt-8 flex justify-between flex-col sm:flex-row"> ${renderComponent($$result, "PostTags", $$Tags, { "tags": post.tags, "class": "mr-5 rtl:mr-0 rtl:ml-5" })} ${renderComponent($$result, "SocialShare", $$SocialShare, { "url": url, "text": post.title, "class": "mt-5 sm:mt-1 align-middle text-gray-500 dark:text-slate-600" })} </div> <!-- Like Button --> <div class="mx-auto px-6 sm:px-6 max-w-3xl mt-8"> ${renderComponent($$result, "LikeButton", $$LikeButton, { "contentSlug": post.slug, "contentType": "blog", "className": "inline-block" })} </div> <!-- Comments Section --> <div class="mx-auto px-6 sm:px-6 max-w-3xl mt-12"> ${renderComponent($$result, "Comments", $$Comments, { "contentSlug": post.slug, "contentType": "blog" })} </div> </article> </section>`;
}, "/app/frontend/src/components/blog/SinglePost.astro", void 0);

const $$ToBlogLink = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="mx-auto px-6 sm:px-6 max-w-3xl pt-8 md:pt-4 pb-12 md:pb-20"> ${renderComponent($$result, "Button", $$Button, { "variant": "tertiary", "class": "px-3 md:px-3", "href": getBlogPermalink() }, { "default": ($$result2) => renderTemplate`${renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": "tabler:chevron-left", "class": "w-5 h-5 mr-1 -ml-1.5 rtl:-mr-1.5 rtl:ml-1" })}`} Back to Blog
` })} </div>`;
}, "/app/frontend/src/components/blog/ToBlogLink.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$5 = createAstro("https://marketmindai.com");
const $$BlogPostingStructuredData = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$BlogPostingStructuredData;
  const { post, url } = Astro2.props;
  const publishedDate = post.publishDate ? new Date(post.publishDate).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
  const modifiedDate = post.updateDate ? new Date(post.updateDate).toISOString() : publishedDate;
  const authorName = post.author || SITE.name;
  const authorSchema = {
    "@type": "Person",
    name: authorName,
    url: SITE.site
  };
  const publisherSchema = {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.site,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.site}/favicon.svg`
    }
  };
  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE.site
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE.site}/blog`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: url
      }
    ]
  };
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt || "",
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: authorSchema,
    publisher: publisherSchema,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    ...post.image && {
      image: {
        "@type": "ImageObject",
        url: typeof post.image === "string" ? post.image : post.image.src,
        ...typeof post.image !== "string" && {
          width: post.image.width,
          height: post.image.height
        }
      }
    },
    ...post.keywords && { keywords: post.keywords },
    ...post.category && {
      articleSection: typeof post.category === "string" ? post.category : post.category.title
    },
    ...post.tags && post.tags.length > 0 && {
      keywords: post.tags.join(", ")
    },
    inLanguage: "en-US",
    isPartOf: {
      "@type": "Blog",
      "@id": `${SITE.site}/blog#blog`,
      name: `${SITE.name} Blog`,
      publisher: publisherSchema
    }
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [blogPostingSchema, breadcrumbSchema]
  };
  return renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(structuredData)));
}, "/app/frontend/src/components/common/BlogPostingStructuredData.astro", void 0);

const $$Astro$4 = createAstro("https://marketmindai.com");
const $$GridItem = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$GridItem;
  const { post } = Astro2.props;
  const image = await findImage(post.image);
  const link = getPermalink(post.permalink, "post") ;
  return renderTemplate`${maybeRenderHead()}<article class="mb-6 transition intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade"> <div class="relative md:h-64 bg-gray-400 dark:bg-slate-700 rounded shadow-lg mb-6"> ${image && (link ? renderTemplate`<a${addAttribute(link, "href")}> ${renderComponent($$result, "Image", $$Image, { "src": image, "class": "w-full md:h-full rounded shadow-lg bg-gray-400 dark:bg-slate-700", "widths": [400, 900], "width": 400, "sizes": "(max-width: 900px) 400px, 900px", "alt": post.title, "aspectRatio": "16:9", "layout": "cover", "loading": "lazy", "decoding": "async" })} </a>` : renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": image, "class": "w-full md:h-full rounded shadow-lg bg-gray-400 dark:bg-slate-700", "widths": [400, 900], "width": 400, "sizes": "(max-width: 900px) 400px, 900px", "alt": post.title, "aspectRatio": "16:9", "layout": "cover", "loading": "lazy", "decoding": "async" })}`)} </div> <h3 class="text-xl sm:text-2xl font-bold leading-tight mb-2 font-heading dark:text-slate-300"> ${link ? renderTemplate`<a class="inline-block hover:text-primary dark:hover:text-blue-700 transition ease-in duration-200"${addAttribute(link, "href")}> ${post.title} </a>` : post.title} </h3> <p class="text-muted dark:text-slate-400 text-lg">${post.excerpt}</p> </article>`;
}, "/app/frontend/src/components/blog/GridItem.astro", void 0);

const $$Astro$3 = createAstro("https://marketmindai.com");
const $$Grid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Grid;
  const { posts } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="grid gap-6 row-gap-5 md:grid-cols-2 lg:grid-cols-4 -mb-6"> ${posts.map((post) => renderTemplate`${renderComponent($$result, "Item", $$GridItem, { "post": post })}`)} </div>`;
}, "/app/frontend/src/components/blog/Grid.astro", void 0);

const $$Astro$2 = createAstro("https://marketmindai.com");
const $$BlogHighlightedPosts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$BlogHighlightedPosts;
  const {
    title = await Astro2.slots.render("title"),
    linkText = "View all posts",
    linkUrl = getBlogPermalink(),
    information = await Astro2.slots.render("information"),
    postIds = [],
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  const posts = await findPostsByIds(postIds) ;
  return renderTemplate`${renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": classes?.container, "bg": bg }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="flex flex-col lg:justify-between lg:flex-row mb-8">${title && renderTemplate`<div class="md:max-w-sm"><h2 class="text-3xl font-bold tracking-tight sm:text-4xl sm:leading-none group font-heading mb-2">${unescapeHTML(title)}</h2>${linkText && linkUrl && renderTemplate`<a class="text-muted dark:text-slate-400 hover:text-primary transition ease-in duration-200 block mb-6 lg:mb-0"${addAttribute(linkUrl, "href")}>${linkText} »
</a>`}</div>`}${information && renderTemplate`<p class="text-muted dark:text-slate-400 lg:text-sm lg:max-w-md">${unescapeHTML(information)}</p>`}</div>${renderComponent($$result2, "Grid", $$Grid, { "posts": posts })}` })}` }`;
}, "/app/frontend/src/components/widgets/BlogHighlightedPosts.astro", void 0);

const $$Astro$1 = createAstro("https://marketmindai.com");
const $$RelatedPosts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$RelatedPosts;
  const { post } = Astro2.props;
  const relatedPosts = post.tags ? await getRelatedPosts(post, 4) : [];
  return renderTemplate`${renderTemplate`${renderComponent($$result, "BlogHighlightedPosts", $$BlogHighlightedPosts, { "classes": {
    container: "pt-0 lg:pt-0 md:pt-0 intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade"
  }, "title": "Related Posts", "linkText": "View All Posts", "linkUrl": getBlogPermalink(), "postIds": relatedPosts.map((post2) => post2.id) })}` }`;
}, "/app/frontend/src/components/blog/RelatedPosts.astro", void 0);

const $$Astro = createAstro("https://marketmindai.com");
const prerender = true;
const getStaticPaths = (async () => {
  return await getStaticPathsBlogPost();
});
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { post } = Astro2.props;
  const url = getCanonical(getPermalink(post.permalink, "post"));
  const image = await findImage(post.image);
  const seoTitle = post.metaTitle || post.title;
  const seoDescription = post.metaDescription || post.excerpt;
  const metadata = merge(
    {
      title: seoTitle,
      description: seoDescription,
      robots: {
        index: blogPostRobots?.index,
        follow: blogPostRobots?.follow
      },
      openGraph: {
        type: "article",
        ...image ? { images: [{ url: image, width: image?.width, height: image?.height }] } : {}
      }
    },
    { ...post?.metadata ? { ...post.metadata, canonical: post.metadata?.canonical || url } : {} }
  );
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "BlogPostingStructuredData", $$BlogPostingStructuredData, { "post": { ...post, image }, "url": url })} ${renderComponent($$result2, "SinglePost", $$SinglePost, { "post": { ...post, image }, "url": url }, { "default": async ($$result3) => renderTemplate`${post.Content ? renderTemplate`${renderComponent($$result3, "post.Content", post.Content, {})}` : renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate`${unescapeHTML(post.content || "")}` })}`}` })} ${renderComponent($$result2, "ToBlogLink", $$ToBlogLink, {})} ${renderComponent($$result2, "RelatedPosts", $$RelatedPosts, { "post": post })} ` })}`;
}, "/app/frontend/src/pages/[...blog]/index.astro", void 0);

const $$file = "/app/frontend/src/pages/[...blog]/index.astro";
const $$url = "/[...blog]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  getStaticPaths,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

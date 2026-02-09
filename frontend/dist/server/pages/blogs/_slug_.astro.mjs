import { f as createAstro, c as createComponent, a as renderTemplate, h as defineScriptVars, r as renderComponent, m as maybeRenderHead, b as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_Chl_MonH.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../chunks/PageLayout_BLdQrLIn.mjs';
import { s as ssrBlogsApi } from '../../chunks/ssr-api_CezTdN0q.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://marketmindai.com");
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  let blog = null;
  try {
    blog = await ssrBlogsApi.getBySlug(slug);
  } catch (error) {
    console.error("Error fetching blog:", error);
  }
  if (!blog) {
    return Astro2.redirect("/404");
  }
  const metadata = {
    title: blog.seo_title || `${blog.title} | MarketMindAI Blog`,
    description: blog.seo_description || blog.excerpt || blog.content.substring(0, 160),
    keywords: blog.seo_keywords || (blog.tags ? blog.tags.join(", ") : ""),
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.content.substring(0, 200),
      image: blog.featured_image,
      type: "article",
      article: {
        publishedTime: blog.published_at,
        author: blog.author_name,
        tags: blog.tags || []
      }
    }
  };
  const publishedDate = new Date(blog.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const processedContent = blog.content.split("\n").map((line) => {
    if (line.startsWith("# ")) {
      return `<h1 class="text-3xl font-bold mb-4 mt-8">${line.substring(2)}</h1>`;
    } else if (line.startsWith("## ")) {
      return `<h2 class="text-2xl font-bold mb-3 mt-6">${line.substring(3)}</h2>`;
    } else if (line.startsWith("### ")) {
      return `<h3 class="text-xl font-bold mb-2 mt-4">${line.substring(4)}</h3>`;
    } else if (line.startsWith("**") && line.endsWith("**")) {
      return `<p class="font-bold mb-2">${line.replace(/\*\*/g, "")}</p>`;
    } else if (line.trim() === "") {
      return "<br />";
    } else {
      return `<p class="mb-4">${line}</p>`;
    }
  }).join("\n");
  return renderTemplate(_a || (_a = __template(["", " <script>(function(){", `
  import { blogsApi } from '~/utils/api';

  async function init() {
    // Increment view count (client-side action)
    try {
      await blogsApi.incrementView(slug);
      console.log('View count incremented');
    } catch (error) {
      console.error('Error incrementing view:', error);
    }

    loadComments();
    setupLikeButton();
    checkAuth();
  }

  async function loadComments() {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;

    try {
      const comments = await blogsApi.getComments(slug);
      
      if (comments.length === 0) {
        commentsList.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center">No comments yet. Be the first to comment!</p>';
        return;
      }

      commentsList.innerHTML = comments.map((comment: any) => \`
        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4" data-testid="comment-\${comment.id}">
          <div class="flex items-center space-x-2 mb-2">
            <span class="font-medium text-gray-900 dark:text-white">\${comment.user_name}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              \${new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p class="text-gray-700 dark:text-gray-300">\${comment.content}</p>
        </div>
      \`).join('');
    } catch (error) {
      console.error('Error loading comments:', error);
      commentsList.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center">Failed to load comments.</p>';
    }
  }

  function setupLikeButton() {
    const likeButton = document.getElementById('like-button');
    const likeText = document.getElementById('like-text');
    const likeCount = document.getElementById('like-count');
    const blogLikes = document.getElementById('blog-likes');
    
    if (!likeButton) return;

    likeButton.addEventListener('click', async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/auth/login?redirect=/blogs/' + slug;
        return;
      }

      try {
        const result = await blogsApi.toggleLike(slug);
        
        if (likeCount) likeCount.textContent = result.like_count.toString();
        if (blogLikes) blogLikes.textContent = result.like_count + ' likes';
        if (likeText) likeText.textContent = result.liked ? 'Unlike' : 'Like';
        
        if (result.liked) {
          likeButton.classList.add('bg-red-50', 'border-red-500', 'text-red-600', 'dark:bg-red-900/20');
          likeButton.classList.remove('border-gray-300', 'text-gray-600');
        } else {
          likeButton.classList.remove('bg-red-50', 'border-red-500', 'text-red-600', 'dark:bg-red-900/20');
          likeButton.classList.add('border-gray-300', 'text-gray-600');
        }
      } catch (error) {
        console.error('Error toggling like:', error);
        alert('Failed to update like. Please try again.');
      }
    });
  }

  function checkAuth() {
    const token = localStorage.getItem('auth_token');
    const authRequired = document.getElementById('auth-required');
    const commentForm = document.getElementById('comment-form');

    if (token && commentForm) {
      commentForm.classList.remove('hidden');
      setupCommentForm();
    } else if (authRequired) {
      authRequired.classList.remove('hidden');
    }
  }

  function setupCommentForm() {
    const form = document.getElementById('comment-form') as HTMLFormElement;
    const textarea = document.getElementById('comment-content') as HTMLTextAreaElement;

    if (!form || !textarea) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const content = textarea.value.trim();
      if (!content) return;

      try {
        await blogsApi.createComment(slug, { content });
        textarea.value = '';
        await loadComments();
        alert('Comment posted successfully!');
      } catch (error) {
        console.error('Error posting comment:', error);
        alert('Failed to post comment. Please try again.');
      }
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();<\/script>`], ["", " <script>(function(){", `
  import { blogsApi } from '~/utils/api';

  async function init() {
    // Increment view count (client-side action)
    try {
      await blogsApi.incrementView(slug);
      console.log('View count incremented');
    } catch (error) {
      console.error('Error incrementing view:', error);
    }

    loadComments();
    setupLikeButton();
    checkAuth();
  }

  async function loadComments() {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;

    try {
      const comments = await blogsApi.getComments(slug);
      
      if (comments.length === 0) {
        commentsList.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center">No comments yet. Be the first to comment!</p>';
        return;
      }

      commentsList.innerHTML = comments.map((comment: any) => \\\`
        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4" data-testid="comment-\\\${comment.id}">
          <div class="flex items-center space-x-2 mb-2">
            <span class="font-medium text-gray-900 dark:text-white">\\\${comment.user_name}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              \\\${new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p class="text-gray-700 dark:text-gray-300">\\\${comment.content}</p>
        </div>
      \\\`).join('');
    } catch (error) {
      console.error('Error loading comments:', error);
      commentsList.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center">Failed to load comments.</p>';
    }
  }

  function setupLikeButton() {
    const likeButton = document.getElementById('like-button');
    const likeText = document.getElementById('like-text');
    const likeCount = document.getElementById('like-count');
    const blogLikes = document.getElementById('blog-likes');
    
    if (!likeButton) return;

    likeButton.addEventListener('click', async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/auth/login?redirect=/blogs/' + slug;
        return;
      }

      try {
        const result = await blogsApi.toggleLike(slug);
        
        if (likeCount) likeCount.textContent = result.like_count.toString();
        if (blogLikes) blogLikes.textContent = result.like_count + ' likes';
        if (likeText) likeText.textContent = result.liked ? 'Unlike' : 'Like';
        
        if (result.liked) {
          likeButton.classList.add('bg-red-50', 'border-red-500', 'text-red-600', 'dark:bg-red-900/20');
          likeButton.classList.remove('border-gray-300', 'text-gray-600');
        } else {
          likeButton.classList.remove('bg-red-50', 'border-red-500', 'text-red-600', 'dark:bg-red-900/20');
          likeButton.classList.add('border-gray-300', 'text-gray-600');
        }
      } catch (error) {
        console.error('Error toggling like:', error);
        alert('Failed to update like. Please try again.');
      }
    });
  }

  function checkAuth() {
    const token = localStorage.getItem('auth_token');
    const authRequired = document.getElementById('auth-required');
    const commentForm = document.getElementById('comment-form');

    if (token && commentForm) {
      commentForm.classList.remove('hidden');
      setupCommentForm();
    } else if (authRequired) {
      authRequired.classList.remove('hidden');
    }
  }

  function setupCommentForm() {
    const form = document.getElementById('comment-form') as HTMLFormElement;
    const textarea = document.getElementById('comment-content') as HTMLTextAreaElement;

    if (!form || !textarea) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const content = textarea.value.trim();
      if (!content) return;

      try {
        await blogsApi.createComment(slug, { content });
        textarea.value = '';
        await loadComments();
        alert('Comment posted successfully!');
      } catch (error) {
        console.error('Error posting comment:', error);
        alert('Failed to post comment. Please try again.');
      }
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();<\/script>`])), renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12"> <!-- Blog Content --> <article class="prose prose-lg dark:prose-invert max-w-none"> <!-- Header --> <header class="mb-8 not-prose"> <!-- Tags --> ${blog.tags && blog.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-4"> ${blog.tags.map((tag) => renderTemplate`<span class="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"> ${tag} </span>`)} </div>`} <!-- Title --> <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"> ${blog.title} </h1> <!-- Meta --> <div class="flex items-center space-x-6 text-gray-600 dark:text-gray-400"> <div class="flex items-center space-x-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> <span>${blog.author_name}</span> </div> <div class="flex items-center space-x-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> <span>${publishedDate}</span> </div> <div class="flex items-center space-x-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> <span>${blog.reading_time} min read</span> </div> </div> ${blog.is_ai_generated && renderTemplate`<div class="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-lg"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M13 7H7v6h6V7z"></path> <path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd"></path> </svg> <span class="text-sm font-medium">AI Generated Content</span> </div>`} </header> <!-- Featured Image --> ${blog.featured_image && renderTemplate`<div class="mb-8 rounded-lg overflow-hidden"> <img${addAttribute(blog.featured_image, "src")}${addAttribute(blog.title, "alt")} class="w-full h-auto" loading="eager"> </div>`} <!-- Content --> <div class="prose-content text-gray-700 dark:text-gray-300">${unescapeHTML(processedContent)}</div> <!-- Stats --> <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-gray-600 dark:text-gray-400 not-prose"> <div class="flex items-center space-x-6"> <span class="flex items-center space-x-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> <span id="view-count">${blog.view_count} views</span> </span> <span class="flex items-center space-x-2"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path> </svg> <span id="blog-likes">${blog.like_count} likes</span> </span> </div> <a href="/blogs" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
← Back to Blogs
</a> </div> </article> <!-- Like Button --> <div class="mt-8 text-center"> <button id="like-button"${addAttribute(blog.slug, "data-blog-slug")}${addAttribute(blog.like_count, "data-like-count")} class="inline-flex items-center space-x-2 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-red-500 dark:hover:text-red-400 transition-colors" data-testid="like-blog-btn"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path> </svg> <span id="like-text">Like</span> <span id="like-count" class="font-bold">${blog.like_count}</span> </button> </div> <!-- Comments Section --> <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"> <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h3> <!-- Auth required message (client-side) --> <div id="auth-required" class="hidden bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"> <p class="text-blue-800 dark:text-blue-200">
Please <a href="/auth/login" class="font-medium underline">login</a> to leave a comment.
</p> </div> <!-- Comment Form (client-side) --> <form id="comment-form" class="hidden mb-8"> <textarea id="comment-content" rows="4" placeholder="Share your thoughts..." class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" required></textarea> <button type="submit" class="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" data-testid="submit-comment-btn">
Post Comment
</button> </form> <!-- Comments List --> <div id="comments-list" class="space-y-6"> <p class="text-gray-500 dark:text-gray-400 text-center py-4">Loading comments...</p> </div> </div> </div> ` }), defineScriptVars({ slug, blogId: blog.id }));
}, "/app/frontend/src/pages/blogs/[slug].astro", void 0);

const $$file = "/app/frontend/src/pages/blogs/[slug].astro";
const $$url = "/blogs/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

import { f as createAstro, c as createComponent, a as renderTemplate, h as defineScriptVars, r as renderComponent, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Chl_MonH.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../../chunks/PageLayout_BLdQrLIn.mjs';
import { a as ssrToolsApi } from '../../chunks/ssr-api_CezTdN0q.mjs';
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
  let tool = null;
  let reviews = [];
  try {
    tool = await ssrToolsApi.getBySlug(slug);
    if (tool) {
      reviews = await ssrToolsApi.getReviews(tool.id, { limit: 10 });
    }
  } catch (error) {
    console.error("Error fetching tool:", error);
  }
  if (!tool) {
    return Astro2.redirect("/404");
  }
  const metadata = {
    title: tool.seo_title || `${tool.name} - AI Tool Review & Guide | MarketMindAI`,
    description: tool.seo_description || tool.short_description || tool.description.substring(0, 160),
    keywords: tool.seo_keywords || `${tool.name}, ai tool, ${tool.categories.map((c) => c.name).join(", ")}`,
    openGraph: {
      title: tool.name,
      description: tool.short_description || tool.description.substring(0, 200),
      image: tool.logo_url || tool.screenshot_url,
      type: "website"
    }
  };
  function getPricingClass(pricingType) {
    const classes = {
      free: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      freemium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      paid: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    };
    return classes[pricingType] || classes.paid;
  }
  return renderTemplate(_a || (_a = __template(["", " <script>(function(){", `
  import { toolsApi } from '~/utils/api';

  // Client-side interactivity
  let userLoggedIn = false;
  let selectedRating = 0;

  function init() {
    userLoggedIn = !!localStorage.getItem('auth_token');
    
    // Enable/disable comment form based on auth
    const commentInput = document.getElementById('comment-input') as HTMLTextAreaElement;
    const postCommentBtn = document.getElementById('post-comment-btn') as HTMLButtonElement;
    
    if (userLoggedIn && commentInput && postCommentBtn) {
      commentInput.disabled = false;
      commentInput.placeholder = 'Write a comment...';
      postCommentBtn.disabled = false;
    }
    
    loadComments();
    setupEventListeners();
  }

  async function loadComments() {
    try {
      const comments = await toolsApi.getComments(slug, { limit: 50 });
      const commentsList = document.getElementById('comments-list');
      
      if (!commentsList) return;
      
      if (comments.length === 0) {
        commentsList.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-8">No comments yet. Start the conversation!</p>';
        return;
      }
      
      commentsList.innerHTML = comments.map((comment: any) => \`
        <div class="border-b border-gray-200 dark:border-gray-700 last:border-0 py-4">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              \${comment.user_name.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <span class="font-medium text-gray-900 dark:text-white">\${comment.user_name}</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">\${new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <p class="text-gray-700 dark:text-gray-300">\${comment.content}</p>
            </div>
          </div>
        </div>
      \`).join('');
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }

  function setupEventListeners() {
    // Like button
    const likeBtn = document.getElementById('like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', async () => {
        if (!userLoggedIn) {
          window.location.href = '/auth/login?redirect=/tools/' + slug;
          return;
        }
        
        try {
          const result = await toolsApi.toggleLike(slug);
          const likeCount = document.getElementById('like-count');
          const sidebarLikeCount = document.getElementById('sidebar-like-count');
          
          if (likeCount) likeCount.textContent = result.like_count.toString();
          if (sidebarLikeCount) sidebarLikeCount.textContent = result.like_count.toString();
          
          if (result.liked) {
            likeBtn.classList.add('bg-red-100', 'dark:bg-red-900', 'text-red-700', 'dark:text-red-200');
            likeBtn.classList.remove('bg-gray-200', 'dark:bg-gray-700');
          } else {
            likeBtn.classList.remove('bg-red-100', 'dark:bg-red-900', 'text-red-700', 'dark:text-red-200');
            likeBtn.classList.add('bg-gray-200', 'dark:bg-gray-700');
          }
        } catch (error) {
          console.error('Error toggling like:', error);
        }
      });
    }

    // Write review button
    const writeReviewBtn = document.getElementById('write-review-btn');
    if (writeReviewBtn) {
      writeReviewBtn.addEventListener('click', () => {
        if (!userLoggedIn) {
          window.location.href = '/auth/login?redirect=/tools/' + slug;
          return;
        }
        document.getElementById('review-modal')?.classList.remove('hidden');
      });
    }

    // Post comment
    const postCommentBtn = document.getElementById('post-comment-btn');
    if (postCommentBtn) {
      postCommentBtn.addEventListener('click', async () => {
        const commentInput = document.getElementById('comment-input') as HTMLTextAreaElement;
        const content = commentInput?.value.trim();
        
        if (!content) {
          alert('Please write a comment');
          return;
        }
        
        try {
          await toolsApi.createComment(slug, { content });
          commentInput.value = '';
          await loadComments();
          alert('Comment posted successfully!');
        } catch (error) {
          console.error('Error posting comment:', error);
          alert('Failed to post comment. Please try again.');
        }
      });
    }

    setupReviewModal();
  }

  function setupReviewModal() {
    const modal = document.getElementById('review-modal');
    const cancelBtn = document.getElementById('cancel-review-btn');
    const reviewForm = document.getElementById('review-form') as HTMLFormElement;
    const ratingButtons = document.querySelectorAll('.rating-btn');

    if (!modal || !reviewForm) return;

    // Rating buttons
    ratingButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const rating = parseInt((btn as HTMLElement).getAttribute('data-rating') || '0');
        selectedRating = rating;
        document.getElementById('review-rating')?.setAttribute('value', rating.toString());
        
        ratingButtons.forEach((b, index) => {
          if (index < rating) {
            b.classList.remove('text-gray-300');
            b.classList.add('text-yellow-500');
          } else {
            b.classList.remove('text-yellow-500');
            b.classList.add('text-gray-300');
          }
        });
      });
    });

    cancelBtn?.addEventListener('click', () => {
      modal.classList.add('hidden');
      reviewForm.reset();
      selectedRating = 0;
      ratingButtons.forEach(b => {
        b.classList.remove('text-yellow-500');
        b.classList.add('text-gray-300');
      });
    });

    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (selectedRating === 0) {
        alert('Please select a rating');
        return;
      }
      
      const title = (document.getElementById('review-title') as HTMLInputElement)?.value;
      const content = (document.getElementById('review-content') as HTMLTextAreaElement)?.value;
      
      try {
        await toolsApi.createReview({
          tool_id: toolId,
          rating: selectedRating,
          title,
          content
        });
        
        modal.classList.add('hidden');
        reviewForm.reset();
        alert('Review submitted successfully! Page will reload.');
        window.location.reload();
      } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. You may have already reviewed this tool.');
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
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
  import { toolsApi } from '~/utils/api';

  // Client-side interactivity
  let userLoggedIn = false;
  let selectedRating = 0;

  function init() {
    userLoggedIn = !!localStorage.getItem('auth_token');
    
    // Enable/disable comment form based on auth
    const commentInput = document.getElementById('comment-input') as HTMLTextAreaElement;
    const postCommentBtn = document.getElementById('post-comment-btn') as HTMLButtonElement;
    
    if (userLoggedIn && commentInput && postCommentBtn) {
      commentInput.disabled = false;
      commentInput.placeholder = 'Write a comment...';
      postCommentBtn.disabled = false;
    }
    
    loadComments();
    setupEventListeners();
  }

  async function loadComments() {
    try {
      const comments = await toolsApi.getComments(slug, { limit: 50 });
      const commentsList = document.getElementById('comments-list');
      
      if (!commentsList) return;
      
      if (comments.length === 0) {
        commentsList.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-8">No comments yet. Start the conversation!</p>';
        return;
      }
      
      commentsList.innerHTML = comments.map((comment: any) => \\\`
        <div class="border-b border-gray-200 dark:border-gray-700 last:border-0 py-4">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              \\\${comment.user_name.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <span class="font-medium text-gray-900 dark:text-white">\\\${comment.user_name}</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">\\\${new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <p class="text-gray-700 dark:text-gray-300">\\\${comment.content}</p>
            </div>
          </div>
        </div>
      \\\`).join('');
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }

  function setupEventListeners() {
    // Like button
    const likeBtn = document.getElementById('like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', async () => {
        if (!userLoggedIn) {
          window.location.href = '/auth/login?redirect=/tools/' + slug;
          return;
        }
        
        try {
          const result = await toolsApi.toggleLike(slug);
          const likeCount = document.getElementById('like-count');
          const sidebarLikeCount = document.getElementById('sidebar-like-count');
          
          if (likeCount) likeCount.textContent = result.like_count.toString();
          if (sidebarLikeCount) sidebarLikeCount.textContent = result.like_count.toString();
          
          if (result.liked) {
            likeBtn.classList.add('bg-red-100', 'dark:bg-red-900', 'text-red-700', 'dark:text-red-200');
            likeBtn.classList.remove('bg-gray-200', 'dark:bg-gray-700');
          } else {
            likeBtn.classList.remove('bg-red-100', 'dark:bg-red-900', 'text-red-700', 'dark:text-red-200');
            likeBtn.classList.add('bg-gray-200', 'dark:bg-gray-700');
          }
        } catch (error) {
          console.error('Error toggling like:', error);
        }
      });
    }

    // Write review button
    const writeReviewBtn = document.getElementById('write-review-btn');
    if (writeReviewBtn) {
      writeReviewBtn.addEventListener('click', () => {
        if (!userLoggedIn) {
          window.location.href = '/auth/login?redirect=/tools/' + slug;
          return;
        }
        document.getElementById('review-modal')?.classList.remove('hidden');
      });
    }

    // Post comment
    const postCommentBtn = document.getElementById('post-comment-btn');
    if (postCommentBtn) {
      postCommentBtn.addEventListener('click', async () => {
        const commentInput = document.getElementById('comment-input') as HTMLTextAreaElement;
        const content = commentInput?.value.trim();
        
        if (!content) {
          alert('Please write a comment');
          return;
        }
        
        try {
          await toolsApi.createComment(slug, { content });
          commentInput.value = '';
          await loadComments();
          alert('Comment posted successfully!');
        } catch (error) {
          console.error('Error posting comment:', error);
          alert('Failed to post comment. Please try again.');
        }
      });
    }

    setupReviewModal();
  }

  function setupReviewModal() {
    const modal = document.getElementById('review-modal');
    const cancelBtn = document.getElementById('cancel-review-btn');
    const reviewForm = document.getElementById('review-form') as HTMLFormElement;
    const ratingButtons = document.querySelectorAll('.rating-btn');

    if (!modal || !reviewForm) return;

    // Rating buttons
    ratingButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const rating = parseInt((btn as HTMLElement).getAttribute('data-rating') || '0');
        selectedRating = rating;
        document.getElementById('review-rating')?.setAttribute('value', rating.toString());
        
        ratingButtons.forEach((b, index) => {
          if (index < rating) {
            b.classList.remove('text-gray-300');
            b.classList.add('text-yellow-500');
          } else {
            b.classList.remove('text-yellow-500');
            b.classList.add('text-gray-300');
          }
        });
      });
    });

    cancelBtn?.addEventListener('click', () => {
      modal.classList.add('hidden');
      reviewForm.reset();
      selectedRating = 0;
      ratingButtons.forEach(b => {
        b.classList.remove('text-yellow-500');
        b.classList.add('text-gray-300');
      });
    });

    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (selectedRating === 0) {
        alert('Please select a rating');
        return;
      }
      
      const title = (document.getElementById('review-title') as HTMLInputElement)?.value;
      const content = (document.getElementById('review-content') as HTMLTextAreaElement)?.value;
      
      try {
        await toolsApi.createReview({
          tool_id: toolId,
          rating: selectedRating,
          title,
          content
        });
        
        modal.classList.add('hidden');
        reviewForm.reset();
        alert('Review submitted successfully! Page will reload.');
        window.location.reload();
      } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. You may have already reviewed this tool.');
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();<\/script>`])), renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="tool-detail-container" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"> <!-- Back Button --> <div class="mb-6"> <a href="/tools" class="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path> </svg>
Back to Tools
</a> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <!-- Main Content (2/3) --> <div class="lg:col-span-2 space-y-8"> <!-- Tool Header --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"> <div class="flex items-start space-x-6"> ${tool.logo_url && renderTemplate`<img${addAttribute(tool.logo_url, "src")}${addAttribute(`${tool.name} logo`, "alt")} class="h-24 w-24 object-contain rounded-lg">`} <div class="flex-1"> <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2" data-testid="tool-title"> ${tool.name} </h1> <p class="text-xl text-gray-600 dark:text-gray-300 mb-4"> ${tool.short_description} </p> <div class="flex items-center space-x-4 text-sm flex-wrap gap-2"> <div class="flex items-center"> <span class="text-yellow-500 text-xl mr-1">★</span> <span class="text-gray-900 dark:text-white font-medium text-lg">${tool.rating.toFixed(1)}</span> <span class="text-gray-500 dark:text-gray-400 ml-1">(${tool.review_count} reviews)</span> </div> <span${addAttribute(`px-3 py-1 rounded-full text-sm font-medium ${getPricingClass(tool.pricing_type)}`, "class")}> ${tool.pricing_type.charAt(0).toUpperCase() + tool.pricing_type.slice(1)} </span> </div> </div> </div> <!-- Action Buttons --> <div class="mt-6 flex flex-wrap gap-3"> ${tool.url && renderTemplate`<a${addAttribute(tool.url, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" data-testid="visit-website-btn">
Visit Website
<svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg> </a>`} <!-- Interactive buttons (client-side hydration) --> <button id="like-btn"${addAttribute(tool.slug, "data-tool-slug")}${addAttribute(tool.like_count, "data-like-count")} class="inline-flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium" data-testid="like-tool-btn"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path> </svg> <span id="like-count">${tool.like_count}</span> </button> <button id="write-review-btn" class="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium" data-testid="write-review-btn"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path> </svg>
Write Review
</button> </div> </div> <!-- Description --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">About ${tool.name}</h2> <div class="prose dark:prose-invert max-w-none"> <p class="text-gray-700 dark:text-gray-300">${tool.description}</p> </div> </div> <!-- Features --> ${tool.features && tool.features.length > 0 && renderTemplate`<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2> <ul class="space-y-3"> ${tool.features.map((feature) => renderTemplate`<li class="flex items-start"> <svg class="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span class="text-gray-700 dark:text-gray-300">${feature}</span> </li>`)} </ul> </div>`} <!-- Pros and Cons --> ${(tool.pros && tool.pros.length > 0 || tool.cons && tool.cons.length > 0) && renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 gap-6"> ${tool.pros && tool.pros.length > 0 && renderTemplate`<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-xl font-bold text-green-600 dark:text-green-400 mb-4">Pros</h3> <ul class="space-y-2"> ${tool.pros.map((pro) => renderTemplate`<li class="flex items-start"> <span class="text-green-500 mr-2">✓</span> <span class="text-gray-700 dark:text-gray-300">${pro}</span> </li>`)} </ul> </div>`} ${tool.cons && tool.cons.length > 0 && renderTemplate`<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Cons</h3> <ul class="space-y-2"> ${tool.cons.map((con) => renderTemplate`<li class="flex items-start"> <span class="text-red-500 mr-2">✗</span> <span class="text-gray-700 dark:text-gray-300">${con}</span> </li>`)} </ul> </div>`} </div>`} <!-- Reviews Section (SSR) --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8" id="reviews-section"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reviews (${reviews.length})</h2> <div id="reviews-list" data-testid="reviews-list"> ${reviews.length === 0 ? renderTemplate`<p class="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>` : reviews.map((review) => renderTemplate`<div class="border-b border-gray-200 dark:border-gray-700 last:border-0 py-6"> <div class="flex items-start justify-between mb-2"> <div> <div class="flex items-center space-x-2 mb-1"> <span class="font-medium text-gray-900 dark:text-white">${review.user_name}</span> <span class="text-yellow-500">${"\u2605".repeat(review.rating)}${"\u2606".repeat(5 - review.rating)}</span> </div> ${review.title && renderTemplate`<h4 class="font-medium text-gray-900 dark:text-white mb-2">${review.title}</h4>`} </div> <span class="text-sm text-gray-500 dark:text-gray-400">${new Date(review.created_at).toLocaleDateString()}</span> </div> ${review.content && renderTemplate`<p class="text-gray-700 dark:text-gray-300 mb-3">${review.content}</p>`} ${review.pros && review.pros.length > 0 && renderTemplate`<div class="mb-2"> <span class="text-sm font-medium text-green-600 dark:text-green-400">Pros:</span> <ul class="text-sm text-gray-700 dark:text-gray-300 ml-4"> ${review.pros.map((pro) => renderTemplate`<li>• ${pro}</li>`)} </ul> </div>`} ${review.cons && review.cons.length > 0 && renderTemplate`<div> <span class="text-sm font-medium text-red-600 dark:text-red-400">Cons:</span> <ul class="text-sm text-gray-700 dark:text-gray-300 ml-4"> ${review.cons.map((con) => renderTemplate`<li>• ${con}</li>`)} </ul> </div>`} </div>`)} </div> </div> <!-- Comments Section (Client-side for interactivity) --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h2> <div class="mb-6" id="comment-form-container"> <textarea id="comment-input" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="Write a comment... (login required)" data-testid="comment-input" disabled></textarea> <button id="post-comment-btn" class="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50" data-testid="post-comment-btn" disabled>
Post Comment
</button> </div> <div id="comments-list" data-testid="comments-list"> <p class="text-gray-500 dark:text-gray-400 text-center py-4">Loading comments...</p> </div> </div> </div> <!-- Sidebar (1/3) --> <div class="space-y-6"> <!-- Quick Stats --> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3> <div class="space-y-3"> <div class="flex justify-between"> <span class="text-gray-600 dark:text-gray-400">Views</span> <span class="font-medium text-gray-900 dark:text-white">${tool.view_count.toLocaleString()}</span> </div> <div class="flex justify-between"> <span class="text-gray-600 dark:text-gray-400">Reviews</span> <span class="font-medium text-gray-900 dark:text-white">${tool.review_count}</span> </div> <div class="flex justify-between"> <span class="text-gray-600 dark:text-gray-400">Likes</span> <span class="font-medium text-gray-900 dark:text-white" id="sidebar-like-count">${tool.like_count}</span> </div> </div> </div> <!-- Categories --> ${tool.categories && tool.categories.length > 0 && renderTemplate`<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Categories</h3> <div class="flex flex-wrap gap-2"> ${tool.categories.map((cat) => renderTemplate`<a${addAttribute(`/tools?category=${cat.slug}`, "href")} class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"> ${cat.name} </a>`)} </div> </div>`} <!-- Pricing Details --> ${tool.pricing_details && Object.keys(tool.pricing_details).length > 0 && renderTemplate`<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Pricing</h3> <div class="space-y-2"> ${Object.entries(tool.pricing_details).map(([plan, price]) => renderTemplate`<div class="flex justify-between items-center"> <span class="text-gray-600 dark:text-gray-400 capitalize">${plan}:</span> <span class="font-medium text-gray-900 dark:text-white">${price}</span> </div>`)} </div> </div>`} <!-- Company Info --> ${(tool.about || tool.company_location || tool.started_on) && renderTemplate`<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"> <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Company Info</h3> <div class="space-y-3 text-sm"> ${tool.company_location && renderTemplate`<div> <span class="text-gray-600 dark:text-gray-400">Location:</span> <span class="text-gray-900 dark:text-white ml-2">${tool.company_location}</span> </div>`} ${tool.started_on && renderTemplate`<div> <span class="text-gray-600 dark:text-gray-400">Founded:</span> <span class="text-gray-900 dark:text-white ml-2">${tool.started_on}</span> </div>`} </div> </div>`} </div> </div> </div>  <div id="review-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Write a Review</h2> <form id="review-form" class="space-y-6"> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating *</label> <div class="flex space-x-2"> ${[1, 2, 3, 4, 5].map((rating) => renderTemplate`<button type="button"${addAttribute(rating, "data-rating")} class="rating-btn text-3xl text-gray-300 hover:text-yellow-500 transition-colors">★</button>`)} </div> <input type="hidden" id="review-rating" required> </div> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label> <input type="text" id="review-title" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="Summary of your experience"> </div> <div> <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review</label> <textarea id="review-content" rows="6" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="Share your experience with this tool..."></textarea> </div> <div class="flex items-center justify-end space-x-4"> <button type="button" id="cancel-review-btn" class="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
Cancel
</button> <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" data-testid="submit-review-btn">
Submit Review
</button> </div> </form> </div> </div> ` }), defineScriptVars({ slug, toolId: tool.id }));
}, "/app/frontend/src/pages/tools/[slug].astro", void 0);

const $$file = "/app/frontend/src/pages/tools/[slug].astro";
const $$url = "/tools/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

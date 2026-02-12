import { c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_ngSGK97K.mjs';
import 'piccolore';
import { $ as $$PageLayout } from '../chunks/PageLayout_DHnoqYNQ.mjs';
export { renderers } from '../renderers.mjs';

const $$AiBlogGenerator = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "AI Blog Generator - MarketMindAI",
    description: "Generate high-quality blog posts with AI"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <!-- Header --> <div class="mb-8"> <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
AI Blog Generator
</h1> <p class="text-lg text-gray-600 dark:text-gray-400">
Create engaging, SEO-optimized blog posts powered by AI
</p> </div> <!-- Blog Topics Suggestions --> <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 mb-8"> <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
Need inspiration? Try these topics:
</h2> <div id="topics-list" class="space-y-2"> <div class="text-center py-4"> <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div> </div> </div> </div> <!-- Generation Form --> <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"> <form id="generate-blog-form" class="space-y-6"> <div> <label for="topic" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Blog Topic *
</label> <input type="text" id="topic" name="topic" required placeholder="e.g., Best AI Tools for Content Marketing" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-testid="blog-topic-input"> </div> <div> <label for="keywords" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Keywords (comma-separated)
</label> <input type="text" id="keywords" name="keywords" placeholder="e.g., AI tools, content marketing, automation" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-testid="keywords-input"> </div> <div> <label for="tone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Tone
</label> <select id="tone" name="tone" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-testid="tone-select"> <option value="professional">Professional</option> <option value="casual">Casual</option> <option value="technical">Technical</option> <option value="friendly">Friendly</option> </select> </div> <div> <label for="length" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
Approximate Length
</label> <select id="length" name="length" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" data-testid="length-select"> <option value="short">Short (500-800 words)</option> <option value="medium" selected>Medium (800-1200 words)</option> <option value="long">Long (1200-2000 words)</option> </select> </div> <div id="form-message" class="hidden"></div> <button type="submit" class="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg" data-testid="generate-blog-btn">
Generate Blog Post
</button> </form> </div> <!-- Generated Blog Preview --> <div id="generated-blog" class="hidden mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"> <div class="flex items-center justify-between mb-6"> <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
Generated Blog Post
</h2> <button id="save-blog-btn" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium" data-testid="save-blog-btn">
Save to Drafts
</button> </div> <div id="blog-content" class="prose dark:prose-invert max-w-none"> <!-- Generated content will appear here --> </div> </div> </div> ` })} ${renderScript($$result, "/app/frontend/src/pages/ai-blog-generator.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/pages/ai-blog-generator.astro", void 0);

const $$file = "/app/frontend/src/pages/ai-blog-generator.astro";
const $$url = "/ai-blog-generator";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AiBlogGenerator,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

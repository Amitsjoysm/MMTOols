import { f as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute, u as unescapeHTML, F as Fragment } from '../chunks/astro/server_ngSGK97K.mjs';
import 'piccolore';
import { a as $$Button, $ as $$PageLayout } from '../chunks/PageLayout_DHnoqYNQ.mjs';
import { $ as $$Hero } from '../chunks/Hero_UxlylRES.mjs';
import { $ as $$WidgetWrapper } from '../chunks/WidgetWrapper_D7lvtMl-.mjs';
import { $ as $$ItemGrid } from '../chunks/ItemGrid_C-9RyqVj.mjs';
import { a as $$Headline, $ as $$CallToAction } from '../chunks/CallToAction_BIkrVF0g.mjs';
import { $ as $$Icon } from '../chunks/Logo_CA0law7c.mjs';
import { twMerge } from 'tailwind-merge';
import { $ as $$Image } from '../chunks/Image_BhzUZ2n3.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$4 = createAstro("https://marketmindai.com");
const $$Features = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Features;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline = await Astro2.slots.render("tagline"),
    items = [],
    columns = 2,
    defaultIcon,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-5xl ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline, "classes": classes?.headline })} ${renderComponent($$result2, "ItemGrid", $$ItemGrid, { "items": items, "columns": columns, "defaultIcon": defaultIcon, "classes": {
    container: "",
    title: "md:text-[1.3rem]",
    icon: "text-white bg-primary rounded-full w-10 h-10 p-2 md:w-12 md:h-12 md:p-3 mr-4 rtl:ml-4 rtl:mr-0",
    ...classes?.items ?? {}
  } })} ` })}`;
}, "/app/frontend/src/components/widgets/Features.astro", void 0);

const $$Astro$3 = createAstro("https://marketmindai.com");
const $$ItemGrid2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ItemGrid2;
  const { items = [], columns, defaultIcon = "", classes = {} } = Astro2.props;
  const {
    container: containerClass = "",
    // container: containerClass = "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    panel: panelClass = "",
    title: titleClass = "",
    description: descriptionClass = "",
    icon: defaultIconClass = "text-primary"
  } = classes;
  return renderTemplate`${items && items.length > 0 && renderTemplate`${maybeRenderHead()}<div${addAttribute(twMerge(
    `grid gap-8 gap-x-12 sm:gap-y-8 ${columns === 4 ? "lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2" : columns === 3 ? "lg:grid-cols-3 sm:grid-cols-2" : columns === 2 ? "sm:grid-cols-2 " : ""}`,
    containerClass
  ), "class")}>${items.map(({ title, description, icon, callToAction, classes: itemClasses = {} }) => renderTemplate`<div${addAttribute(twMerge(
    "relative flex flex-col intersect-once intersect-quarter intersect-no-queue motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade",
    panelClass,
    itemClasses?.panel
  ), "class")}>${(icon || defaultIcon) && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon || defaultIcon, "class": twMerge("mb-2 w-10 h-10", defaultIconClass, itemClasses?.icon) })}`}<div${addAttribute(twMerge("text-xl font-bold", titleClass, itemClasses?.title), "class")}>${title}</div>${description && renderTemplate`<p${addAttribute(twMerge("text-muted mt-2", descriptionClass, itemClasses?.description), "class")}>${unescapeHTML(description)}</p>`}${callToAction && renderTemplate`<div class="mt-2">${renderComponent($$result, "Button", $$Button, { ...callToAction })}</div>`}</div>`)}</div>`}`;
}, "/app/frontend/src/components/ui/ItemGrid2.astro", void 0);

const $$Astro$2 = createAstro("https://marketmindai.com");
const $$Features2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Features2;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline = await Astro2.slots.render("tagline"),
    items = [],
    columns = 3,
    defaultIcon,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-7xl mx-auto ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline, "classes": classes?.headline })} ${renderComponent($$result2, "ItemGrid2", $$ItemGrid2, { "items": items, "columns": columns, "defaultIcon": defaultIcon, "classes": {
    container: "gap-4 md:gap-6",
    panel: "rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur border border-[#ffffff29] bg-white dark:bg-slate-900 p-6",
    // panel:
    //   "text-center bg-page items-center md:text-left rtl:md:text-right md:items-start p-6 p-6 rounded-md shadow-xl dark:shadow-none dark:border dark:border-slate-800",
    icon: "w-12 h-12 mb-6 text-primary",
    ...classes?.items ?? {}
  } })} ` })}`;
}, "/app/frontend/src/components/widgets/Features2.astro", void 0);

const $$Astro$1 = createAstro("https://marketmindai.com");
const $$Stats = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Stats;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline,
    stats = [],
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-6xl mx-auto ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline })} ${maybeRenderHead()}<div class="flex flex-wrap justify-center -m-4 text-center"> ${stats && stats.map(({ amount, title: title2, icon }) => renderTemplate`<div class="p-4 md:w-1/4 sm:w-1/2 w-full min-w-[220px] text-center md:border-r md:last:border-none dark:md:border-slate-500 intersect-once motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade intersect-quarter"> ${icon && renderTemplate`<div class="flex items-center justify-center mx-auto mb-4 text-primary"> ${renderComponent($$result2, "Icon", $$Icon, { "name": icon, "class": "w-10 h-10" })} </div>`} ${amount && renderTemplate`<div class="font-heading text-primary text-[2.6rem] font-bold dark:text-white lg:text-5xl xl:text-6xl"> ${amount} </div>`} ${title2 && renderTemplate`<div class="text-sm font-medium uppercase tracking-widest text-gray-800 dark:text-slate-400 lg:text-base"> ${title2} </div>`} </div>`)} </div> ` })}`;
}, "/app/frontend/src/components/widgets/Stats.astro", void 0);

const $$Astro = createAstro("https://marketmindai.com");
const $$Content = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Content;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline,
    content = await Astro2.slots.render("content"),
    callToAction,
    items = [],
    columns,
    image = await Astro2.slots.render("image"),
    isReversed = false,
    isAfterContent = false,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-7xl mx-auto ${isAfterContent ? "pt-0 md:pt-0 lg:pt-0" : ""} ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline, "classes": {
    container: "max-w-xl sm:mx-auto lg:max-w-2xl",
    title: "text-4xl md:text-5xl font-bold tracking-tighter mb-4 font-heading",
    subtitle: "max-w-3xl mx-auto sm:text-center text-xl text-muted dark:text-slate-400"
  } })} ${maybeRenderHead()}<div class="mx-auto max-w-7xl p-4 md:px-8"> <div${addAttribute(`md:flex ${isReversed ? "md:flex-row-reverse" : ""} md:gap-16`, "class")}> <div class="md:basis-1/2 self-center"> ${content && renderTemplate`<div class="mb-12 text-lg dark:text-slate-400">${unescapeHTML(content)}</div>`} ${callToAction && renderTemplate`<div class="mt-[-40px] mb-8 text-primary"> ${renderComponent($$result2, "Button", $$Button, { "variant": "link", ...callToAction })} </div>`} ${renderComponent($$result2, "ItemGrid", $$ItemGrid, { "items": items, "columns": columns, "defaultIcon": "tabler:check", "classes": {
    container: `gap-y-4 md:gap-y-8`,
    panel: "max-w-none",
    title: "text-lg font-medium leading-6 dark:text-white ml-2 rtl:ml-0 rtl:mr-2",
    description: "text-muted dark:text-slate-400 ml-2 rtl:ml-0 rtl:mr-2",
    icon: "flex h-7 w-7 items-center justify-center rounded-full bg-green-600 dark:bg-green-700 text-gray-50 p-1",
    action: "text-lg font-medium leading-6 dark:text-white ml-2 rtl:ml-0 rtl:mr-2"
  } })} </div> <div aria-hidden="true" class="mt-10 md:mt-0 md:basis-1/2"> ${image && renderTemplate`<div class="relative m-auto max-w-4xl"> ${typeof image === "string" ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${unescapeHTML(image)}` })}` : renderTemplate`${renderComponent($$result2, "Image", $$Image, { "class": "mx-auto w-full rounded-lg bg-gray-500 shadow-lg", "width": 500, "height": 500, "widths": [400, 768], "sizes": "(max-width: 768px) 100vw, 432px", "layout": "responsive", ...image })}`} </div>`} </div> </div> </div> ` })}`;
}, "/app/frontend/src/components/widgets/Content.astro", void 0);

const prerender = true;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "MarketMindAI - Discover & Compare the Best AI Tools & Business Solutions",
    description: "Your ultimate directory for discovering, comparing, and reviewing AI tools and business solutions. Find the perfect tools with expert insights, user reviews, and side-by-side comparisons.",
    ignoreTitleTemplate: true
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "actions": [
    {
      variant: "primary",
      text: "Browse Tools",
      href: "/tools"
    },
    {
      text: "Read Blog",
      href: "/blog"
    }
  ] }, { "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate` ${maybeRenderHead()}<span class="font-semibold">MarketMindAI</span> is your comprehensive directory for finding, comparing, and reviewing AI tools and business solutions. Make informed decisions with expert insights and real user reviews.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`
Discover the <span class="text-accent dark:text-white">Best AI Tools</span> for Your Business
` })}` })}  ${renderComponent($$result2, "Stats", $$Stats, { "stats": [
    { title: "Tools Listed", amount: "500+" },
    { title: "User Reviews", amount: "10K+" },
    { title: "Categories", amount: "50+" },
    { title: "Monthly Visitors", amount: "100K+" }
  ] })}  ${renderComponent($$result2, "Features", $$Features, { "id": "features", "tagline": "Why Choose MarketMindAI", "title": "Everything You Need to Find the Perfect Tool", "subtitle": "Comprehensive features designed to help you discover, compare, and choose the best tools for your business needs.", "items": [
    {
      title: "Extensive Tool Directory",
      description: "Access hundreds of carefully curated AI tools and business solutions across multiple categories. From productivity to marketing, find everything in one place.",
      icon: "tabler:database"
    },
    {
      title: "Side-by-Side Comparisons",
      description: "Compare features, pricing, pros, and cons of multiple tools at once. Make data-driven decisions with clear, visual comparisons.",
      icon: "tabler:git-compare"
    },
    {
      title: "Verified User Reviews",
      description: "Read authentic reviews from real users. Get insights from those who have actually used the tools to understand real-world performance.",
      icon: "tabler:stars"
    },
    {
      title: "Expert Insights",
      description: "Access detailed analysis, best practices, and expert recommendations for each tool. Learn from industry professionals.",
      icon: "tabler:bulb"
    },
    {
      title: "Regular Updates",
      description: "Stay informed with the latest tool updates, new releases, and industry trends through our regularly updated blog.",
      icon: "tabler:refresh"
    },
    {
      title: "Smart Filtering",
      description: "Find exactly what you need with advanced filters. Search by category, pricing model, features, ratings, and more.",
      icon: "tabler:filter"
    }
  ] })}  ${renderComponent($$result2, "Content", $$Content, { "isReversed": true, "tagline": "Featured Categories", "title": "Explore Tools by Category", "items": [
    {
      title: "AI & Machine Learning",
      description: "Cutting-edge AI tools for automation, data analysis, and intelligent decision-making."
    },
    {
      title: "Productivity & Collaboration",
      description: "Boost team efficiency with project management, communication, and workflow tools."
    },
    {
      title: "Marketing & Sales",
      description: "Drive growth with tools for email marketing, CRM, social media, and analytics."
    },
    {
      title: "Development & Design",
      description: "Build better products with coding tools, design software, and testing platforms."
    }
  ] }, { "bg": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "bg" }, { "default": ($$result4) => renderTemplate` <div class="absolute inset-0 bg-blue-50 dark:bg-transparent"></div> ` })}`, "content": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "content" }, { "default": ($$result4) => renderTemplate` <h3 class="text-2xl font-bold tracking-tight dark:text-white sm:text-3xl mb-2">
Find Tools Tailored to Your Needs
</h3>
Browse through our carefully organized categories to discover tools that match your specific requirements.
` })}` })}  ${renderComponent($$result2, "Features2", $$Features2, { "title": "Most Popular Tools", "subtitle": "Discover the tools that businesses trust and love", "tagline": "Trending Now", "items": [
    {
      title: "ChatGPT",
      description: "Advanced AI chatbot for content creation, coding assistance, and more.",
      icon: "tabler:message-chatbot"
    },
    {
      title: "Notion",
      description: "All-in-one workspace for notes, docs, wikis, and project management.",
      icon: "tabler:notebook"
    },
    {
      title: "Figma",
      description: "Collaborative interface design tool for teams.",
      icon: "tabler:palette"
    },
    {
      title: "Zapier",
      description: "Automate workflows by connecting your favorite apps.",
      icon: "tabler:plug"
    },
    {
      title: "Slack",
      description: "Team communication platform for real-time collaboration.",
      icon: "tabler:messages"
    },
    {
      title: "HubSpot",
      description: "Complete CRM platform for marketing, sales, and service.",
      icon: "tabler:brand-google-analytics"
    }
  ] }, { "bg": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "bg" }, { "default": ($$result4) => renderTemplate` <div class="absolute inset-0 bg-blue-50 dark:bg-transparent"></div> ` })}` })}  ${renderComponent($$result2, "CallToAction", $$CallToAction, { "actions": [
    {
      variant: "primary",
      text: "Explore All Tools",
      href: "/tools"
    },
    {
      text: "Submit Your Tool",
      href: "/contact"
    }
  ] }, { "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate`
Start exploring our comprehensive directory of AI tools and business solutions.<br class="hidden md:inline">
Join thousands of businesses making smarter tool choices every day.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`
Ready to Find Your&nbsp;<br class="block sm:hidden"><span class="sm:whitespace-nowrap">Perfect Tool?</span> ` })}` })} ` })}`;
}, "/app/frontend/src/pages/index.astro", void 0);

const $$file = "/app/frontend/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

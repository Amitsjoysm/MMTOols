import { f as createAstro, c as createComponent, m as maybeRenderHead, u as unescapeHTML, a as renderTemplate, r as renderComponent, F as Fragment, b as addAttribute } from '../chunks/astro/server_ngSGK97K.mjs';
import 'piccolore';
import { a as $$Button, $ as $$PageLayout } from '../chunks/PageLayout_DHnoqYNQ.mjs';
import { $ as $$Icon } from '../chunks/Logo_CA0law7c.mjs';
import { a as $$Headline, $ as $$CallToAction } from '../chunks/CallToAction_BIkrVF0g.mjs';
import { $ as $$WidgetWrapper } from '../chunks/WidgetWrapper_D7lvtMl-.mjs';
import { $ as $$ItemGrid } from '../chunks/ItemGrid_C-9RyqVj.mjs';
import { twMerge } from 'tailwind-merge';
import { $ as $$Image } from '../chunks/Image_BhzUZ2n3.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$5 = createAstro("https://marketmindai.com");
const $$HeroText = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$HeroText;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline,
    content = await Astro2.slots.render("content"),
    callToAction = await Astro2.slots.render("callToAction"),
    callToAction2 = await Astro2.slots.render("callToAction2")
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="relative md:-mt-[76px] not-prose"> <div class="absolute inset-0 pointer-events-none" aria-hidden="true"></div> <div class="relative max-w-7xl mx-auto px-4 sm:px-6"> <div class="pt-0 md:pt-[76px] pointer-events-none"></div> <div class="py-12 md:py-20 pb-8 md:pb-8"> <div class="text-center max-w-5xl mx-auto"> ${tagline && renderTemplate`<p class="text-base text-secondary dark:text-blue-200 font-bold tracking-wide uppercase intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade">${unescapeHTML(tagline)}</p>`} ${title && renderTemplate`<h1 class="text-5xl md:text-6xl font-bold leading-tighter tracking-tighter mb-4 font-heading dark:text-gray-200 intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade">${unescapeHTML(title)}</h1>`} <div class="max-w-3xl mx-auto"> ${subtitle && renderTemplate`<p class="text-xl text-muted mb-6 dark:text-slate-300 intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade">${unescapeHTML(subtitle)}</p>`} <div class="max-w-xs sm:max-w-md m-auto flex flex-nowrap flex-col sm:flex-row sm:justify-center gap-4 intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade"> ${callToAction && renderTemplate`<div class="flex w-full sm:w-auto"> ${typeof callToAction === "string" ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(callToAction)}` })}` : renderTemplate`${renderComponent($$result, "Button", $$Button, { "variant": "primary", ...callToAction })}`} </div>`} ${callToAction2 && renderTemplate`<div class="flex w-full sm:w-auto"> ${typeof callToAction2 === "string" ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(callToAction2)}` })}` : renderTemplate`${renderComponent($$result, "Button", $$Button, { ...callToAction2 })}`} </div>`} </div> </div> ${content && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(content)}` })}`} </div> </div> </div> </section>`;
}, "/app/frontend/src/components/widgets/HeroText.astro", void 0);

const $$Astro$4 = createAstro("https://marketmindai.com");
const $$Pricing$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Pricing$1;
  const {
    title = "",
    subtitle = "",
    tagline = "",
    prices = [],
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-7xl mx-auto ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline })} ${maybeRenderHead()}<div class="flex items-stretch justify-center"> <div class="grid grid-cols-3 gap-4 dark:text-white sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"> ${prices && prices.map(({ title: title2, subtitle: subtitle2, price, period, items, callToAction, hasRibbon = false, ribbonTitle }) => renderTemplate`<div class="col-span-3 mx-auto flex w-full sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 intersect-once motion-safe:md:intersect:animate-fade motion-safe:md:opacity-0 intersect-quarter"> ${price && period && renderTemplate`<div class="rounded-lg backdrop-blur border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 shadow px-6 py-8 flex w-full max-w-sm flex-col justify-between text-center"> ${hasRibbon && ribbonTitle && renderTemplate`<div class="absolute right-[-5px] 2xl:right-[-8px] rtl:right-auto rtl:left-[-8px] rtl:2xl:left-[-10px] top-[-5px] 2xl:top-[-10px] z-[1] h-[100px] w-[100px] overflow-hidden text-right"> <span class="absolute top-[19px] right-[-21px] rtl:right-auto rtl:left-[-21px] block w-full rotate-45 rtl:-rotate-45 bg-green-700 text-center text-[10px] font-bold uppercase leading-5 text-white shadow-[0_3px_10px_-5px_rgba(0,0,0,0.3)] before:absolute before:left-0 before:top-full before:z-[-1] before:border-[3px] before:border-r-transparent before:border-b-transparent before:border-l-green-800 before:border-t-green-800 before:content-[''] after:absolute after:right-0 after:top-full after:z-[-1] after:border-[3px] after:border-l-transparent after:border-b-transparent after:border-r-green-800 after:border-t-green-800 after:content-['']"> ${ribbonTitle} </span> </div>`} <div class="px-2 py-0"> ${title2 && renderTemplate`<h3 class="text-center text-xl font-semibold uppercase leading-6 tracking-wider mb-2">${title2}</h3>`} ${subtitle2 && renderTemplate`<p class="font-light sm:text-lg text-gray-600 dark:text-slate-400">${subtitle2}</p>`} <div class="my-8"> <div class="flex items-center justify-center text-center mb-1"> <span class="text-5xl">$</span> <span class="text-6xl font-extrabold">${price}</span> </div> <span class="text-base leading-6 lowercase text-gray-600 dark:text-slate-400">${period}</span> </div> ${items && renderTemplate`<ul class="my-8 md:my-10 space-y-2 text-left"> ${items.map(
    ({ description, icon }) => description && renderTemplate`<li class="mb-1.5 flex items-start space-x-3 leading-7"> <div class="rounded-full bg-primary mt-1"> ${renderComponent($$result2, "Icon", $$Icon, { "name": icon ? icon : "tabler:check", "class": "w-5 h-5 font-bold p-1 text-white" })} </div> <span>${description}</span> </li>`
  )} </ul>`} </div> ${callToAction && renderTemplate`<div${addAttribute(`flex justify-center`, "class")}> ${typeof callToAction === "string" ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${unescapeHTML(callToAction)}` })}` : callToAction && callToAction.href && renderTemplate`${renderComponent($$result2, "Button", $$Button, { ...hasRibbon ? { variant: "primary" } : {}, ...callToAction })}`} </div>`} </div>`} </div>`)} </div> </div> ` })}`;
}, "/app/frontend/src/components/widgets/Pricing.astro", void 0);

const $$Astro$3 = createAstro("https://marketmindai.com");
const $$FAQs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$FAQs;
  const {
    title = "",
    subtitle = "",
    tagline = "",
    items = [],
    columns = 2,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-7xl mx-auto ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline })} ${renderComponent($$result2, "ItemGrid", $$ItemGrid, { "items": items, "columns": columns, "defaultIcon": "tabler:chevron-right", "classes": {
    container: `${columns === 1 ? "max-w-4xl" : ""} gap-y-8 md:gap-y-12`,
    panel: "max-w-none",
    icon: "flex-shrink-0 mt-1 w-6 h-6 text-primary"
  } })} ` })}`;
}, "/app/frontend/src/components/widgets/FAQs.astro", void 0);

const $$Astro$2 = createAstro("https://marketmindai.com");
const $$Timeline = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Timeline;
  const { items = [], classes = {}, defaultIcon } = Astro2.props;
  const {
    container: containerClass = "",
    panel: panelClass = "",
    title: titleClass = "",
    description: descriptionClass = "",
    icon: defaultIconClass = "text-primary dark:text-slate-200 border-primary dark:border-blue-700"
  } = classes;
  return renderTemplate`${items && items.length > 0 && renderTemplate`${maybeRenderHead()}<div${addAttribute(containerClass, "class")}>${items.map(({ title, description, icon, classes: itemClasses = {} }, index = 0) => renderTemplate`<div${addAttribute(twMerge(
    "flex intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade",
    panelClass,
    itemClasses?.panel
  ), "class")}><div class="flex flex-col items-center mr-4 rtl:mr-0 rtl:ml-4"><div><div class="flex items-center justify-center">${(icon || defaultIcon) && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon || defaultIcon, "class": twMerge("w-10 h-10 p-2 rounded-full border-2", defaultIconClass, itemClasses?.icon) })}`}</div></div>${index !== items.length - 1 && renderTemplate`<div class="w-px h-full bg-black/10 dark:bg-slate-400/50"></div>`}</div><div${addAttribute(`pt-1 ${index !== items.length - 1 ? "pb-8" : ""}`, "class")}>${title && renderTemplate`<p${addAttribute(twMerge("text-xl font-bold", titleClass, itemClasses?.title), "class")}>${unescapeHTML(title)}</p>`}${description && renderTemplate`<p${addAttribute(twMerge("text-muted mt-2", descriptionClass, itemClasses?.description), "class")}>${unescapeHTML(description)}</p>`}</div></div>`)}</div>`}`;
}, "/app/frontend/src/components/ui/Timeline.astro", void 0);

const $$Astro$1 = createAstro("https://marketmindai.com");
const $$Steps = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Steps;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline = await Astro2.slots.render("tagline"),
    items = [],
    image = await Astro2.slots.render("image"),
    isReversed = false,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-5xl ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div${addAttribute(["flex flex-col gap-8 md:gap-12", { "md:flex-row-reverse": isReversed }, { "md:flex-row": image }], "class:list")}> <div${addAttribute(["md:py-4 md:self-center", { "md:basis-1/2": image }, { "w-full": !image }], "class:list")}> ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline, "classes": {
    container: "text-left rtl:text-right",
    title: "text-3xl lg:text-4xl",
    ...classes?.headline ?? {}
  } })} ${renderComponent($$result2, "Timeline", $$Timeline, { "items": items, "classes": classes?.items })} </div> ${image && renderTemplate`<div class="relative md:basis-1/2"> ${typeof image === "string" ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${unescapeHTML(image)}` })}` : renderTemplate`${renderComponent($$result2, "Image", $$Image, { "class": "inset-0 object-cover object-top w-full rounded-md shadow-lg md:absolute md:h-full bg-gray-400 dark:bg-slate-700", "widths": [400, 768], "sizes": "(max-width: 768px) 100vw, 432px", "width": 432, "height": 768, "layout": "cover", "src": image?.src, "alt": image?.alt || "" })}`} </div>`} </div> ` })}`;
}, "/app/frontend/src/components/widgets/Steps.astro", void 0);

const $$Astro = createAstro("https://marketmindai.com");
const $$Features3 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Features3;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline = await Astro2.slots.render("tagline"),
    image,
    items = [],
    columns,
    defaultIcon,
    isBeforeContent,
    isAfterContent,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `${isBeforeContent ? "md:pb-8 lg:pb-12" : ""} ${isAfterContent ? "pt-0 md:pt-0 lg:pt-0" : ""} ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline, "classes": classes?.headline })} ${maybeRenderHead()}<div aria-hidden="true" class="aspect-w-16 aspect-h-7"> ${image && renderTemplate`<div class="w-full h-80 object-cover rounded-xl mx-auto bg-gray-500 shadow-lg"> ${typeof image === "string" ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${unescapeHTML(image)}` })}` : renderTemplate`${renderComponent($$result2, "Image", $$Image, { "class": "w-full h-80 object-cover rounded-xl mx-auto bg-gray-500 shadow-lg", "width": "auto", "height": 320, "widths": [400, 768], "layout": "fullWidth", ...image })}`} </div>`} </div> ${renderComponent($$result2, "ItemGrid", $$ItemGrid, { "items": items, "columns": columns, "defaultIcon": defaultIcon, "classes": {
    container: "mt-12",
    panel: "max-w-full sm:max-w-md",
    title: "text-lg font-semibold",
    description: "mt-0.5",
    icon: "flex-shrink-0 mt-1 text-primary w-6 h-6",
    ...classes?.items ?? {}
  } })} ` })}`;
}, "/app/frontend/src/components/widgets/Features3.astro", void 0);

const prerender = true;
const $$Pricing = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "Pricing"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "HeroText", $$HeroText, { "tagline": "Pricing", "title": "Stellar Pricing for Every Journey", "subtitle": "Choose the perfect plan that aligns with your cosmic goals." })}  ${renderComponent($$result2, "Prices", $$Pricing$1, { "title": "Our prices", "subtitle": "Only pay for what you need", "prices": [
    {
      title: "basic",
      subtitle: "Optimal choice for personal use",
      price: 29,
      period: "per month",
      items: [
        {
          description: "Etiam in libero, et volutpat"
        },
        {
          description: "Aenean ac nunc dolor tristique"
        },
        {
          description: "Cras scelerisque accumsan lib"
        },
        {
          description: "In hac habitasse"
        }
      ],
      callToAction: {
        target: "_blank",
        text: "Get started",
        href: "#"
      }
    },
    {
      title: "standard",
      subtitle: "Optimal choice for small teams",
      price: 69,
      period: "Per Month",
      items: [
        {
          description: "Proin vel laoreet"
        },
        {
          description: "Ut efficitur habitasse egestas"
        },
        {
          description: "Volutpat hac curabitur"
        },
        {
          description: "Pellentesque blandit ut nibh"
        },
        {
          description: "Donec fringilla sem"
        }
      ],
      callToAction: {
        target: "_blank",
        text: "Get started",
        href: "#"
      },
      hasRibbon: true,
      ribbonTitle: "popular"
    },
    {
      title: "premium",
      subtitle: "Optimal choice for companies",
      price: 199,
      period: "Per Month",
      items: [
        {
          description: "Curabitur suscipit risus"
        },
        {
          description: "Aliquam habitasse malesuada"
        },
        {
          description: "Suspendisse sit amet blandit"
        },
        {
          description: "Suspendisse auctor blandit dui"
        }
      ],
      callToAction: {
        target: "_blank",
        text: "Get started",
        href: "#"
      }
    }
  ] })}  ${renderComponent($$result2, "Features3", $$Features3, { "title": "Price-related features", "subtitle": "Discover the advantages of choosing our plans", "columns": 2, "items": [
    {
      title: "Tiered Pricing Plans",
      description: "Choose from a range of pricing plans designed to accommodate different budgets and requirements.",
      icon: "tabler:stairs"
    },
    {
      title: "Transparent Pricing",
      description: "Clearly displayed pricing details for each plan, with no hidden costs or unexpected charges.",
      icon: "tabler:flip-vertical"
    },
    {
      title: "Secure Payment Methods",
      description: "Secure payment gateways to protect your financial information during transactions.",
      icon: "tabler:shield-lock"
    },
    {
      title: "Instant Access",
      description: `Immediate access to your chosen plan's features and templates upon subscription.`,
      icon: "tabler:accessible"
    },
    {
      title: "Upgrade Value",
      description: "Upgrade to higher-tier plans to unlock more features and benefits for an enhanced experience.",
      icon: "tabler:chevrons-up"
    },
    {
      title: "24H support",
      description: "Questions answered via live chat, email or phone, every calendar day.",
      icon: "tabler:headset"
    }
  ], "classes": { container: "max-w-5xl" } })}  ${renderComponent($$result2, "Steps", $$Steps, { "title": "A guided journey from plans to creativity", "tagline": "simplified process", "isReversed": true, "items": [
    {
      title: "Explore plans",
      icon: "tabler:number-1"
    },
    {
      title: "Select a plan",
      icon: "tabler:number-2"
    },
    {
      title: "Sign Up / Log In",
      icon: "tabler:number-3"
    },
    {
      title: "Review order",
      icon: "tabler:number-4"
    },
    {
      title: "Enter payment details",
      icon: "tabler:number-5"
    },
    {
      title: "Confirmation",
      icon: "tabler:number-6"
    },
    {
      title: "Download and start using the template(s)",
      icon: "tabler:number-7"
    }
  ], "image": {
    src: "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
    alt: "Steps image"
  } })}  ${renderComponent($$result2, "FAQs", $$FAQs, { "title": "Pricing FAQs", "subtitle": "Choosing the right plan is important, and we're here to answer your questions. If you have queries about our pricing options, you're in the right place.", "columns": 1, "items": [
    {
      title: "Do the plans come with customer support?",
      description: "Absolutely, all plans include access to our dedicated customer support to assist you with any queries or concerns."
    },
    {
      title: "Is there a trial period for the different plans?",
      description: "Unfortunately, we don't offer trial periods for the plans. However, you can check out our demo section to preview the quality of our templates."
    },
    {
      title: "Can I switch between plans?",
      description: "Certainly! You can easily upgrade or downgrade your plan, at any time, to find the one that best suits your evolving requirements."
    },
    {
      title: "What payment methods do you accept?",
      description: "We accept major credit cards and online payment methods to ensure a convenient and secure transaction process."
    },
    {
      title: "Are there any hidden fees beyond the displayed cost?",
      description: "No, the subscription cost covers all the features and templates listed under each plan. There are no hidden fees or extra charges."
    }
  ] })}  ${renderComponent($$result2, "CallToAction", $$CallToAction, { "title": "Ready to boost your projects?", "subtitle": "Join our community of satisfied customers who have transformed their work with our templates.", "actions": [
    {
      variant: "primary",
      text: "Get started now",
      href: "/"
    }
  ] })} ` })}`;
}, "/app/frontend/src/pages/pricing.astro", void 0);

const $$file = "/app/frontend/src/pages/pricing.astro";
const $$url = "/pricing";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pricing,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

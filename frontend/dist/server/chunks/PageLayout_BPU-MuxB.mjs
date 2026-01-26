import { e as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, r as renderComponent, a as renderTemplate, g as renderSlot, z as spreadAttributes, F as Fragment, u as unescapeHTML, d as renderScript } from './astro/server_CiGCQnlW.mjs';
import 'piccolore';
import { $ as $$Layout } from './Layout_DlphmZvc.mjs';
import { $ as $$Icon, a as $$Logo } from './Logo_Ck10JEQV.mjs';
import { U as UI, t as trimSlash, g as getHomePermalink, b as getAsset, S as SITE, a as getPermalink, d as getBlogPermalink } from './permalinks_CQw00ZKc.mjs';
import 'clsx';
import { twMerge } from 'tailwind-merge';

const $$Astro$6 = createAstro("https://marketmindai.com");
const $$ToggleTheme = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$ToggleTheme;
  const {
    label = "Toggle between Dark and Light mode",
    class: className = "text-muted dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center",
    iconClass = "w-6 h-6",
    iconName = "tabler:sun"
  } = Astro2.props;
  return renderTemplate`${!(UI.theme.endsWith(":only")) && renderTemplate`${maybeRenderHead()}<button type="button"${addAttribute(className, "class")}${addAttribute(label, "aria-label")} data-aw-toggle-color-scheme>${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "class": iconClass })}</button>`}`;
}, "/app/frontend/src/components/common/ToggleTheme.astro", void 0);

const $$Astro$5 = createAstro("https://marketmindai.com");
const $$ToggleMenu = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$ToggleMenu;
  const {
    label = "Toggle Menu",
    class: className = "flex flex-col h-12 w-12 rounded justify-center items-center cursor-pointer group"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button type="button"${addAttribute(className, "class")}${addAttribute(label, "aria-label")} data-aw-toggle-menu> <span class="sr-only">${label}</span> ${renderSlot($$result, $$slots["default"], renderTemplate` <span aria-hidden="true" class="h-0.5 w-6 my-1 rounded-full bg-black dark:bg-white transition ease transform duration-200 opacity-80 group-[.expanded]:rotate-45 group-[.expanded]:translate-y-2.5"></span> <span aria-hidden="true" class="h-0.5 w-6 my-1 rounded-full bg-black dark:bg-white transition ease transform duration-200 opacity-80 group-[.expanded]:opacity-0"></span> <span aria-hidden="true" class="h-0.5 w-6 my-1 rounded-full bg-black dark:bg-white transition ease transform duration-200 opacity-80 group-[.expanded]:-rotate-45 group-[.expanded]:-translate-y-2.5"></span> `)} </button>`;
}, "/app/frontend/src/components/common/ToggleMenu.astro", void 0);

const $$Astro$4 = createAstro("https://marketmindai.com");
const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    variant = "secondary",
    target,
    text = Astro2.slots.render("default"),
    icon = "",
    class: className = "",
    type,
    ...rest
  } = Astro2.props;
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    tertiary: "btn btn-tertiary",
    link: "cursor-pointer hover:text-primary"
  };
  return renderTemplate`${type === "button" || type === "submit" || type === "reset" ? renderTemplate`${maybeRenderHead()}<button${addAttribute(type, "type")}${addAttribute(twMerge(variants[variant] || "", className), "class")}${spreadAttributes(rest)}>${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(text)}` })}${icon && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon, "class": "w-5 h-5 ml-1 -mr-1.5 rtl:mr-1 rtl:-ml-1.5 inline-block" })}`}</button>` : renderTemplate`<a${addAttribute(twMerge(variants[variant] || "", className), "class")}${spreadAttributes(target ? { target, rel: "noopener noreferrer" } : {})}${spreadAttributes(rest)}>${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(text)}` })}${icon && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon, "class": "w-5 h-5 ml-1 -mr-1.5 rtl:mr-1 rtl:-ml-1.5 inline-block" })}`}</a>`}`;
}, "/app/frontend/src/components/ui/Button.astro", void 0);

const $$Astro$3 = createAstro("https://marketmindai.com");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Header;
  const {
    id = "header",
    links = [],
    actions = [],
    isSticky = false,
    isDark = false,
    isFullWidth = false,
    showToggleTheme = false,
    showRssFeed = false,
    position = "center"
  } = Astro2.props;
  const currentPath = `/${trimSlash(new URL(Astro2.url).pathname)}`;
  return renderTemplate`${maybeRenderHead()}<header${addAttribute([
    { sticky: isSticky, relative: !isSticky, dark: isDark },
    "top-0 z-40 flex-none mx-auto w-full border-b border-gray-50/0 transition-[opacity] ease-in-out"
  ], "class:list")}${spreadAttributes(isSticky ? { "data-aw-sticky-header": true } : {})}${spreadAttributes(id ? { id } : {})} role="banner" itemscope itemtype="https://schema.org/WPHeader"> <div class="absolute inset-0"></div> <div${addAttribute([
    "relative text-default py-3 px-3 md:px-6 mx-auto w-full",
    {
      "md:flex md:justify-between": position !== "center"
    },
    {
      "md:grid md:grid-cols-3 md:items-center": position === "center"
    },
    {
      "max-w-7xl": !isFullWidth
    }
  ], "class:list")}> <div${addAttribute([{ "mr-auto rtl:mr-0 rtl:ml-auto": position === "right" }, "flex justify-between"], "class:list")}> <a class="flex items-center"${addAttribute(getHomePermalink(), "href")}> ${renderComponent($$result, "Logo", $$Logo, {})} </a> <div class="flex items-center md:hidden"> ${renderComponent($$result, "ToggleMenu", $$ToggleMenu, {})} </div> </div> <nav class="items-center w-full md:w-auto hidden md:flex md:mx-5 text-default overflow-y-auto overflow-x-hidden md:overflow-y-visible md:overflow-x-auto md:justify-self-center" aria-label="Main navigation"> <ul class="flex flex-col md:flex-row md:self-center w-full md:w-auto text-xl md:text-[0.9375rem] tracking-[0.01rem] font-medium md:justify-center"> ${links.map(({ text, href, links: links2 }) => renderTemplate`<li${addAttribute(links2?.length ? "dropdown" : "", "class")}> ${links2?.length ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <button type="button" class="hover:text-link dark:hover:text-white px-4 py-3 flex items-center whitespace-nowrap"> ${text}${" "} ${renderComponent($$result2, "Icon", $$Icon, { "name": "tabler:chevron-down", "class": "w-3.5 h-3.5 ml-0.5 rtl:ml-0 rtl:mr-0.5 hidden md:inline" })} </button> <ul class="dropdown-menu md:backdrop-blur-md dark:md:bg-dark rounded md:absolute pl-4 md:pl-0 md:hidden font-medium md:bg-white/90 md:min-w-[200px] drop-shadow-xl"> ${links2.map(({ text: text2, href: href2 }) => renderTemplate`<li> <a${addAttribute([
    "first:rounded-t last:rounded-b md:hover:bg-gray-100 hover:text-link dark:hover:text-white dark:hover:bg-gray-700 py-2 px-5 block whitespace-no-wrap",
    { "aw-link-active": href2 === currentPath }
  ], "class:list")}${addAttribute(href2, "href")}> ${text2} </a> </li>`)} </ul> ` })}` : renderTemplate`<a${addAttribute([
    "hover:text-link dark:hover:text-white px-4 py-3 flex items-center whitespace-nowrap",
    { "aw-link-active": href === currentPath }
  ], "class:list")}${addAttribute(href, "href")}> ${text} </a>`} </li>`)} </ul> </nav> <div${addAttribute([
    { "ml-auto rtl:ml-0 rtl:mr-auto": position === "left" },
    "hidden md:self-center md:flex items-center md:mb-0 fixed w-full md:w-auto md:static justify-end left-0 rtl:left-auto rtl:right-0 bottom-0 p-3 md:p-0 md:justify-self-end"
  ], "class:list")}> <div class="items-center flex justify-between w-full md:w-auto"> <div class="flex"> ${showToggleTheme && renderTemplate`${renderComponent($$result, "ToggleTheme", $$ToggleTheme, { "iconClass": "w-6 h-6 md:w-5 md:h-5 md:inline-block" })}`} ${showRssFeed && renderTemplate`<a class="text-muted dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center" aria-label="RSS Feed"${addAttribute(getAsset("/rss.xml"), "href")}> ${renderComponent($$result, "Icon", $$Icon, { "name": "tabler:rss", "class": "w-5 h-5" })} </a>`} </div> ${actions?.length ? renderTemplate`<span class="ml-4 rtl:ml-0 rtl:mr-4"> ${actions.map((btnProps) => renderTemplate`${renderComponent($$result, "Button", $$Button, { ...btnProps, "class": "ml-2 py-2.5 px-5.5 md:px-6 font-semibold shadow-none text-sm w-auto" })}`)} </span>` : ""} </div> </div> </div> </header>`;
}, "/app/frontend/src/components/widgets/Header.astro", void 0);

const $$Astro$2 = createAstro("https://marketmindai.com");
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Footer;
  const { socialLinks = [], secondaryLinks = [], links = [], footNote = "", theme = "light" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<footer${addAttribute([{ dark: theme === "dark" }, "relative border-t border-gray-200 dark:border-slate-800 not-prose"], "class:list")} role="contentinfo" itemscope itemtype="https://schema.org/WPFooter"> <div class="dark:bg-dark absolute inset-0 pointer-events-none" aria-hidden="true"></div> <div class="relative max-w-7xl mx-auto px-4 sm:px-6 dark:text-slate-300 intersect-once intersect-quarter intersect-no-queue motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade"> <div class="grid grid-cols-12 gap-4 gap-y-8 sm:gap-8 py-8 md:py-12"> <div class="col-span-12 lg:col-span-4"> <div class="mb-2"> <a class="inline-block font-bold text-xl"${addAttribute(getHomePermalink(), "href")}>${SITE?.name}</a> </div> <div class="text-sm text-muted flex gap-1"> ${secondaryLinks.map(({ text, href }, index) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${index !== 0 ? " \xB7 " : ""}<a class="text-muted hover:text-gray-700 dark:text-gray-400 hover:underline transition duration-150 ease-in-out"${addAttribute(href, "href")}>${unescapeHTML(text)}</a> ` })}`)} </div> </div> ${links.map(({ title, links: links2 }) => renderTemplate`<div class="col-span-6 md:col-span-3 lg:col-span-2"> <div class="dark:text-gray-300 font-medium mb-2">${title}</div> ${links2 && Array.isArray(links2) && links2.length > 0 && renderTemplate`<ul class="text-sm"> ${links2.map(({ text, href, ariaLabel }) => renderTemplate`<li class="mb-2"> <a class="text-muted hover:text-gray-700 hover:underline dark:text-gray-400 transition duration-150 ease-in-out"${addAttribute(href, "href")}${addAttribute(ariaLabel, "aria-label")}> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(text)}` })} </a> </li>`)} </ul>`} </div>`)} </div> <div class="md:flex md:items-center md:justify-between py-6 md:py-8"> ${socialLinks?.length ? renderTemplate`<ul class="flex mb-4 md:order-1 -ml-2 md:ml-4 md:mb-0 rtl:ml-0 rtl:-mr-2 rtl:md:ml-0 rtl:md:mr-4"> ${socialLinks.map(({ ariaLabel, href, text, icon }) => renderTemplate`<li> <a class="text-muted dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center"${addAttribute(ariaLabel, "aria-label")}${addAttribute(href, "href")}> ${icon && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon, "class": "w-5 h-5" })}`} ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(text)}` })} </a> </li>`)} </ul>` : ""} <div class="text-sm mr-4 dark:text-muted"> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(footNote)}` })} </div> </div> </div> </footer> <!-- Newsletter Section (Before Footer) --> ${renderSlot($$result, $$slots["newsletter"])}`;
}, "/app/frontend/src/components/widgets/Footer.astro", void 0);

const $$Astro$1 = createAstro("https://marketmindai.com");
const $$Newsletter = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Newsletter;
  const {
    title = "Subscribe to Our Newsletter",
    subtitle = "Get the latest updates on AI tools, expert insights, and industry trends delivered to your inbox.",
    tagline = "Stay Updated"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="bg-blue-600 dark:bg-blue-800 py-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-8"> ${tagline && renderTemplate`<p class="text-blue-100 dark:text-blue-200 text-sm font-semibold uppercase tracking-wide mb-2"> ${tagline} </p>`} <h2 class="text-3xl md:text-4xl font-bold text-white mb-4"> ${title} </h2> ${subtitle && renderTemplate`<p class="text-blue-100 dark:text-blue-200 text-lg max-w-2xl mx-auto"> ${subtitle} </p>`} </div> <form id="newsletter-form" class="max-w-xl mx-auto"> <div class="flex flex-col sm:flex-row gap-3"> <input type="email" id="newsletter-email" name="email" required placeholder="Enter your email address" class="flex-1 px-6 py-4 rounded-lg border-2 border-transparent focus:border-white focus:ring-2 focus:ring-white/50 text-gray-900 dark:text-white bg-white dark:bg-gray-800 transition-all" data-testid="newsletter-email-input"> <button type="submit" class="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl whitespace-nowrap" data-testid="newsletter-subscribe-btn">
Subscribe
</button> </div> <div id="newsletter-message" class="mt-4 hidden"></div> <p class="text-blue-100 dark:text-blue-200 text-xs mt-3 text-center">
We respect your privacy. Unsubscribe at any time.
</p> </form> </div> </section> ${renderScript($$result, "/app/frontend/src/components/widgets/Newsletter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/app/frontend/src/components/widgets/Newsletter.astro", void 0);

const headerData = {
  links: [
    {
      text: "Home",
      href: getPermalink("/")
    },
    {
      text: "Tools",
      links: [
        {
          text: "Browse All Tools",
          href: getPermalink("/tools")
        },
        {
          text: "Compare Tools",
          href: getPermalink("/tools/compare")
        },
        {
          text: "Featured Tools",
          href: getPermalink("/tools?featured=true")
        }
      ]
    },
    {
      text: "Blog",
      href: getBlogPermalink()
    },
    {
      text: "About",
      href: getPermalink("/about")
    },
    {
      text: "Contact",
      href: getPermalink("/contact")
    }
  ],
  actions: [
    {
      text: "Admin Dashboard",
      href: getPermalink("/admin"),
      variant: "secondary"
    },
    {
      text: "Submit Tool",
      href: getPermalink("/contact"),
      variant: "primary"
    }
  ]
};
const footerData = {
  links: [
    {
      title: "Explore",
      links: [
        { text: "All Tools", href: getPermalink("/tools") },
        { text: "Compare Tools", href: getPermalink("/tools/compare") },
        { text: "Blog", href: getBlogPermalink() },
        { text: "About Us", href: getPermalink("/about") }
      ]
    },
    {
      title: "Categories",
      links: [
        { text: "AI Tools", href: getPermalink("/tools?category=ai") },
        { text: "Productivity", href: getPermalink("/tools?category=productivity") },
        { text: "Marketing", href: getPermalink("/tools?category=marketing") },
        { text: "Development", href: getPermalink("/tools?category=development") }
      ]
    },
    {
      title: "Resources",
      links: [
        { text: "Submit a Tool", href: getPermalink("/contact") },
        { text: "Privacy Policy", href: getPermalink("/privacy") },
        { text: "Terms of Service", href: getPermalink("/terms") }
      ]
    },
    {
      title: "Connect",
      links: [
        { text: "Contact Us", href: getPermalink("/contact") },
        { text: "LinkedIn", href: "https://www.linkedin.com/company/marketmindai/" },
        { text: "Twitter", href: "https://twitter.com/marketmindai" }
      ]
    }
  ],
  secondaryLinks: [
    { text: "Terms", href: getPermalink("/terms") },
    { text: "Privacy Policy", href: getPermalink("/privacy") }
  ],
  socialLinks: [
    { ariaLabel: "LinkedIn", icon: "tabler:brand-linkedin", href: "https://www.linkedin.com/company/marketmindai/" },
    { ariaLabel: "Twitter", icon: "tabler:brand-x", href: "https://twitter.com/marketmindai" },
    { ariaLabel: "Facebook", icon: "tabler:brand-facebook", href: "https://facebook.com/marketmindai" }
  ],
  footNote: `
    <span class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm"></span>
    © ${(/* @__PURE__ */ new Date()).getFullYear()} <a class="text-blue-600 underline dark:text-muted" href="https://marketmindai.com">MarketMindAI</a>. All rights reserved.
  `
};

const $$Astro = createAstro("https://marketmindai.com");
const $$PageLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PageLayout;
  const { metadata } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["header"], renderTemplate` ${renderComponent($$result2, "Header", $$Header, { ...headerData, "isSticky": true, "showRssFeed": true, "showToggleTheme": true })} `)} ${maybeRenderHead()}<main id="main-content" role="main" itemprop="mainContentOfPage"> ${renderSlot($$result2, $$slots["default"])} </main> ${renderComponent($$result2, "Newsletter", $$Newsletter, {})} ${renderSlot($$result2, $$slots["footer"], renderTemplate` ${renderComponent($$result2, "Footer", $$Footer, { ...footerData })} `)} ` })}`;
}, "/app/frontend/src/layouts/PageLayout.astro", void 0);

export { $$PageLayout as $, $$Button as a };

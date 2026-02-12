import { f as createAstro, c as createComponent, m as maybeRenderHead, b as addAttribute, u as unescapeHTML, a as renderTemplate, r as renderComponent, F as Fragment } from './astro/server_ngSGK97K.mjs';
import 'piccolore';
import { $ as $$WidgetWrapper } from './WidgetWrapper_D7lvtMl-.mjs';
import 'clsx';
import { twMerge } from 'tailwind-merge';
import { a as $$Button } from './PageLayout_DHnoqYNQ.mjs';

const $$Astro$1 = createAstro("https://marketmindai.com");
const $$Headline = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Headline;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline,
    classes = {}
  } = Astro2.props;
  const {
    container: containerClass = "max-w-3xl",
    title: titleClass = "text-3xl md:text-4xl ",
    subtitle: subtitleClass = "text-xl"
  } = classes;
  return renderTemplate`${(title || subtitle || tagline) && renderTemplate`${maybeRenderHead()}<div${addAttribute(twMerge("mb-8 md:mx-auto md:mb-12 text-center", containerClass), "class")}>${tagline && renderTemplate`<p class="text-base text-secondary dark:text-blue-200 font-bold tracking-wide uppercase">${unescapeHTML(tagline)}</p>`}${title && renderTemplate`<h2${addAttribute(twMerge("font-bold leading-tighter tracking-tighter font-heading text-heading text-3xl", titleClass), "class")}>${unescapeHTML(title)}</h2>`}${subtitle && renderTemplate`<p${addAttribute(twMerge("mt-4 text-muted", subtitleClass), "class")}>${unescapeHTML(subtitle)}</p>`}</div>`}`;
}, "/app/frontend/src/components/ui/Headline.astro", void 0);

const $$Astro = createAstro("https://marketmindai.com");
const $$CallToAction = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CallToAction;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline = await Astro2.slots.render("tagline"),
    actions = await Astro2.slots.render("actions"),
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-6xl mx-auto ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-3xl mx-auto text-center p-6 rounded-md shadow-xl dark:shadow-none dark:border dark:border-slate-600"> ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline, "classes": {
    container: "mb-0 md:mb-0",
    title: "text-4xl md:text-4xl font-bold tracking-tighter mb-4 font-heading",
    subtitle: "text-xl text-muted dark:text-slate-400"
  } })} ${actions && renderTemplate`<div class="max-w-xs sm:max-w-md m-auto flex flex-nowrap flex-col sm:flex-row sm:justify-center gap-4 mt-6"> ${Array.isArray(actions) ? actions.map((action) => renderTemplate`<div class="flex w-full sm:w-auto"> ${renderComponent($$result2, "Button", $$Button, { ...action || {}, "class": "w-full sm:mb-0" })} </div>`) : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${unescapeHTML(actions)}` })}`} </div>`} </div> ` })}`;
}, "/app/frontend/src/components/widgets/CallToAction.astro", void 0);

export { $$CallToAction as $, $$Headline as a };

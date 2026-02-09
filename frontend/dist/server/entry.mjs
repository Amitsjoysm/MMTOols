import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_ChAkj0b8.mjs';
import { manifest } from './manifest_CbMg4WfT.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/admin/analytics.astro.mjs');
const _page4 = () => import('./pages/admin/blogs.astro.mjs');
const _page5 = () => import('./pages/admin/categories.astro.mjs');
const _page6 = () => import('./pages/admin/claims.astro.mjs');
const _page7 = () => import('./pages/admin/contacts.astro.mjs');
const _page8 = () => import('./pages/admin/free-tools.astro.mjs');
const _page9 = () => import('./pages/admin/login.astro.mjs');
const _page10 = () => import('./pages/admin/newsletter.astro.mjs');
const _page11 = () => import('./pages/admin/reviews.astro.mjs');
const _page12 = () => import('./pages/admin/seo.astro.mjs');
const _page13 = () => import('./pages/admin/tools.astro.mjs');
const _page14 = () => import('./pages/admin/users.astro.mjs');
const _page15 = () => import('./pages/admin.astro.mjs');
const _page16 = () => import('./pages/ai-blog-generator.astro.mjs');
const _page17 = () => import('./pages/auth/forgot-password.astro.mjs');
const _page18 = () => import('./pages/auth/login.astro.mjs');
const _page19 = () => import('./pages/auth/register.astro.mjs');
const _page20 = () => import('./pages/auth/reset-password.astro.mjs');
const _page21 = () => import('./pages/auth/verify-email.astro.mjs');
const _page22 = () => import('./pages/blogs/_slug_.astro.mjs');
const _page23 = () => import('./pages/blogs.astro.mjs');
const _page24 = () => import('./pages/contact.astro.mjs');
const _page25 = () => import('./pages/free-tools.astro.mjs');
const _page26 = () => import('./pages/pricing.astro.mjs');
const _page27 = () => import('./pages/privacy.astro.mjs');
const _page28 = () => import('./pages/rss.xml.astro.mjs');
const _page29 = () => import('./pages/terms.astro.mjs');
const _page30 = () => import('./pages/tools/compare.astro.mjs');
const _page31 = () => import('./pages/tools/_slug_.astro.mjs');
const _page32 = () => import('./pages/tools.astro.mjs');
const _page33 = () => import('./pages/user/claimed-tools.astro.mjs');
const _page34 = () => import('./pages/user/dashboard.astro.mjs');
const _page35 = () => import('./pages/_---blog_/_category_/_---page_.astro.mjs');
const _page36 = () => import('./pages/_---blog_/_tag_/_---page_.astro.mjs');
const _page37 = () => import('./pages/_---blog_/_---page_.astro.mjs');
const _page38 = () => import('./pages/index.astro.mjs');
const _page39 = () => import('./pages/_---blog_.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/admin/analytics.astro", _page3],
    ["src/pages/admin/blogs.astro", _page4],
    ["src/pages/admin/categories.astro", _page5],
    ["src/pages/admin/claims.astro", _page6],
    ["src/pages/admin/contacts.astro", _page7],
    ["src/pages/admin/free-tools.astro", _page8],
    ["src/pages/admin/login.astro", _page9],
    ["src/pages/admin/newsletter.astro", _page10],
    ["src/pages/admin/reviews.astro", _page11],
    ["src/pages/admin/seo.astro", _page12],
    ["src/pages/admin/tools.astro", _page13],
    ["src/pages/admin/users.astro", _page14],
    ["src/pages/admin/index.astro", _page15],
    ["src/pages/ai-blog-generator.astro", _page16],
    ["src/pages/auth/forgot-password.astro", _page17],
    ["src/pages/auth/login.astro", _page18],
    ["src/pages/auth/register.astro", _page19],
    ["src/pages/auth/reset-password.astro", _page20],
    ["src/pages/auth/verify-email.astro", _page21],
    ["src/pages/blogs/[slug].astro", _page22],
    ["src/pages/blogs/index.astro", _page23],
    ["src/pages/contact.astro", _page24],
    ["src/pages/free-tools.astro", _page25],
    ["src/pages/pricing.astro", _page26],
    ["src/pages/privacy.md", _page27],
    ["src/pages/rss.xml.ts", _page28],
    ["src/pages/terms.md", _page29],
    ["src/pages/tools/compare.astro", _page30],
    ["src/pages/tools/[slug].astro", _page31],
    ["src/pages/tools/index.astro", _page32],
    ["src/pages/user/claimed-tools.astro", _page33],
    ["src/pages/user/dashboard.astro", _page34],
    ["src/pages/[...blog]/[category]/[...page].astro", _page35],
    ["src/pages/[...blog]/[tag]/[...page].astro", _page36],
    ["src/pages/[...blog]/[...page].astro", _page37],
    ["src/pages/index.astro", _page38],
    ["src/pages/[...blog]/index.astro", _page39]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///app/frontend/dist/client/",
    "server": "file:///app/frontend/dist/server/",
    "host": true,
    "port": 3000,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };

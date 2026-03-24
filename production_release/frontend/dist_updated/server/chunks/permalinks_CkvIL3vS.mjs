import slugify from 'limax';

const SITE = {"name":"MarketMindAI","site":"https://marketmindai.com","base":"/","googleSiteVerificationId":false};
                    const I18N = {"language":"en","textDirection":"ltr"};
                    const METADATA = {"title":{"default":"MarketMindAI - Discover & Compare AI Tools & Business Solutions","template":"%s | MarketMindAI"},"description":"MarketMindAI is your ultimate directory for discovering, comparing, and reviewing AI tools and business solutions. Find the perfect tools for your business needs with expert insights and user reviews.","openGraph":{"type":"website","site_name":"MarketMindAI","images":[{"url":"~/assets/images/default.png","width":1200,"height":628}]},"twitter":{"handle":"@marketmindai","site":"@marketmindai","cardType":"summary_large_image"}};
                    const APP_BLOG = {"post":{"permalink":"/blogs/%slug%"},"list":{"pathname":"blogs"},"category":{"pathname":"category"},"tag":{"pathname":"tag"}};
                    const UI = {"theme":"system"};

const trim = (str = "", ch) => {
  let start = 0, end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

const trimSlash = (s) => trim(trim(s, "/"));
const createPath = (...params) => {
  const paths = params.map((el) => trimSlash(el)).filter((el) => !!el).join("/");
  return "/" + paths + ("");
};
const BASE_PATHNAME = SITE.base;
const cleanSlug = (text = "") => trimSlash(text).split("/").map((slug) => slugify(slug)).join("/");
const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname);
const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);
const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || "tag";
trimSlash(APP_BLOG?.post?.permalink);
const getCanonical = (path = "") => {
  const url = String(new URL(path, SITE.site));
  if (path && url.endsWith("/")) {
    return url.slice(0, -1);
  }
  return url;
};
const getPermalink = (slug = "", type = "page") => {
  let permalink;
  if (slug.startsWith("https://") || slug.startsWith("http://") || slug.startsWith("://") || slug.startsWith("#") || slug.startsWith("javascript:")) {
    return slug;
  }
  switch (type) {
    case "home":
      permalink = getHomePermalink();
      break;
    case "blog":
      permalink = getBlogPermalink();
      break;
    case "asset":
      permalink = getAsset(slug);
      break;
    case "category":
      permalink = createPath(CATEGORY_BASE, trimSlash(slug));
      break;
    case "tag":
      permalink = createPath(TAG_BASE, trimSlash(slug));
      break;
    case "post":
      permalink = createPath(trimSlash(slug));
      break;
    case "page":
    default:
      permalink = createPath(slug);
      break;
  }
  return definitivePermalink(permalink);
};
const getHomePermalink = () => getPermalink("/");
const getBlogPermalink = () => getPermalink(BLOG_BASE);
const getAsset = (path) => "/" + [BASE_PATHNAME, path].map((el) => trimSlash(el)).filter((el) => !!el).join("/");
const definitivePermalink = (permalink) => createPath(BASE_PATHNAME, permalink);

export { I18N as I, METADATA as M, SITE as S, UI as U, getCanonical as a, getAsset as b, getPermalink as c, getHomePermalink as g, trimSlash as t };

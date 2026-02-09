import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Tools',
      links: [
        {
          text: 'Browse All Tools',
          href: getPermalink('/tools'),
        },
        {
          text: 'Compare Tools',
          href: getPermalink('/tools/compare'),
        },
        {
          text: 'Featured Tools',
          href: getPermalink('/tools?featured=true'),
        },
      ],
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
  actions: [
    { 
      text: 'Login', 
      href: getPermalink('/auth/login'),
      variant: 'secondary',
      id: 'auth-button'  // Will be dynamically updated by client-side JS
    },
    { 
      text: 'Submit Tool', 
      href: getPermalink('/contact'),
      variant: 'primary'
    }
  ],
};

export const footerData = {
  links: [
    {
      title: 'Explore',
      links: [
        { text: 'All Tools', href: getPermalink('/tools') },
        { text: 'Compare Tools', href: getPermalink('/tools/compare') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'About Us', href: getPermalink('/about') },
      ],
    },
    {
      title: 'Categories',
      links: [
        { text: 'AI Tools', href: getPermalink('/tools?category=ai') },
        { text: 'Productivity', href: getPermalink('/tools?category=productivity') },
        { text: 'Marketing', href: getPermalink('/tools?category=marketing') },
        { text: 'Development', href: getPermalink('/tools?category=development') },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Submit a Tool', href: getPermalink('/contact') },
        { text: 'Privacy Policy', href: getPermalink('/privacy') },
        { text: 'Terms of Service', href: getPermalink('/terms') },
      ],
    },
    {
      title: 'Connect',
      links: [
        { text: 'Contact Us', href: getPermalink('/contact') },
        { text: 'LinkedIn', href: 'https://www.linkedin.com/company/marketmindai/' },
        { text: 'Twitter', href: 'https://twitter.com/marketmindai' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/marketmindai/' },
    { ariaLabel: 'Twitter', icon: 'tabler:brand-x', href: 'https://twitter.com/marketmindai' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://facebook.com/marketmindai' },
  ],
  footNote: `
    <span class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm"></span>
    © ${new Date().getFullYear()} <a class="text-blue-600 underline dark:text-muted" href="https://marketmindai.com">MarketMindAI</a>. All rights reserved.
  `,
};

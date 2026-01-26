import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Services',
      links: [
        {
          text: 'Cloud Solutions & Migration',
          href: getPermalink('/cloud-solutions'),
        },
        {
          text: 'Web Development & SEO',
          href: getPermalink('/web-development'),
        },
        {
          text: 'AI & Business Automation',
          href: getPermalink('/ai-automation'),
        },
        {
          text: 'Microsoft 365 / G Suite Licenses',
          href: getPermalink('/microsoft-365-licenses'),
        },
        {
          text: 'SEO Services',
          href: getPermalink('/seo-services'),
        },
      ],
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
  actions: [
    { 
      text: 'Get Started', 
      href: getPermalink('/contact'),
      variant: 'primary'
    }
  ],
};

export const footerData = {
  links: [
    {
      title: 'Services',
      links: [
        { text: 'Cloud Solutions', href: getPermalink('/cloud-solutions') },
        { text: 'Web Development', href: getPermalink('/web-development') },
        { text: 'AI Automation', href: getPermalink('/ai-automation') },
        { text: 'Microsoft 365', href: getPermalink('/microsoft-365-licenses') },
        { text: 'SEO Services', href: getPermalink('/seo-services') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About Us', href: getPermalink('/about') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Privacy Policy', href: getPermalink('/privacy') },
        { text: 'Terms of Service', href: getPermalink('/terms') },
      ],
    },
    {
      title: 'Contact',
      links: [
        { text: 'Email: info@techresona.com', href: 'mailto:info@techresona.com' },
        { text: 'Phone: +91 7517402788', href: 'tel:+917517402788' },
        { text: 'Kharadi, Pune 411047', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/techresona-services/' },
    { ariaLabel: 'Twitter', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
  ],
  footNote: `
    <span class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm"></span>
    © ${new Date().getFullYear()} <a class="text-blue-600 underline dark:text-muted" href="https://techresona.com">TechResona Pvt Ltd</a>. All rights reserved.
  `,
};

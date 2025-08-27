export type NavLink = { href: string; label: string };
export type SocialLink = { href: string; label: string };

const fallbackName = "Mahardika";
const fallbackAccent = "indigo";

export const site = {
  name: process.env.NEXT_PUBLIC_APP_NAME || fallbackName,
  accent: process.env.NEXT_PUBLIC_ACCENT || fallbackAccent,
  nav: [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "Docs" },
    { href: "/dashboard", label: "Dashboard" },
  ] as NavLink[],
  footer: [
    { href: "/docs", label: "Docs" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ] as NavLink[],
  social: [
    { href: "https://x.com/", label: "Twitter" },
    { href: "https://github.com/", label: "GitHub" },
  ] as SocialLink[],
};

export type PricingTier = {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    priceMonthly: 0,
    priceYearly: 0,
    features: ["Up to 3 policies", "Basic analytics", "Email support"],
    cta: "Get started",
  },
  {
    name: "Pro",
    priceMonthly: 29,
    priceYearly: 290,
    features: [
      "Unlimited policies",
      "Payments & loyalty",
      "Priority support",
    ],
    cta: "Start trial",
    highlighted: true,
  },
  {
    name: "Business",
    priceMonthly: 79,
    priceYearly: 790,
    features: ["SLA", "SAML SSO", "Dedicated support"],
    cta: "Contact sales",
  },
];




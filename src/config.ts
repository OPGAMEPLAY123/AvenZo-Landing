/**
 * Central, configurable links. Set them in `.env` (see `.env.example`).
 * Any link left empty is handled gracefully: the button shows a short
 * "coming soon" message instead of navigating to a dead URL.
 *
 * AvenZo never fakes login, payments or cashback tracking — those live on
 * whatever platform these URLs point to.
 */
const env = import.meta.env;

/** AvenZo store: where Login, Get Started and Start Shopping lead. Override in .env if needed. */
const STORE = 'https://store.avenzoopg.in';

export const config = {
  shopUrl: env.VITE_SHOP_URL || STORE,
  loginUrl: env.VITE_LOGIN_URL || STORE,
  signupUrl: env.VITE_SIGNUP_URL || STORE,
  opgUrl: env.VITE_OPG_URL ?? '',
  contactEmail: env.VITE_CONTACT_EMAIL ?? '',
  socials: [
    { name: 'Instagram', url: env.VITE_INSTAGRAM_URL ?? '' },
    { name: 'X', url: env.VITE_X_URL ?? '' },
    { name: 'YouTube', url: env.VITE_YOUTUBE_URL ?? '' },
    { name: 'LinkedIn', url: env.VITE_LINKEDIN_URL ?? '' },
  ],
} as const;

export const copy = {
  offer: '₹100',
  offerLabel: 'FIRST PURCHASE CASHBACK',
  disclaimer:
    'Cashback is not guaranteed. It depends on offer eligibility, merchant confirmation and the applicable offer terms.',
  shopSoon: 'AvenZo offers are launching soon. Please check back shortly.',
  loginSoon: 'Accounts are opening soon. Please check back shortly.',
};

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOP_URL?: string;
  readonly VITE_LOGIN_URL?: string;
  readonly VITE_SIGNUP_URL?: string;
  readonly VITE_OPG_URL?: string;
  readonly VITE_INSTAGRAM_URL?: string;
  readonly VITE_X_URL?: string;
  readonly VITE_YOUTUBE_URL?: string;
  readonly VITE_LINKEDIN_URL?: string;
  readonly VITE_CONTACT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    OPENAI_API_KEY: string;
    STRIPE_SECRET_KEY: string;
    RAZORPAY_KEY_ID: string;
    RAZORPAY_KEY_SECRET: string;
    ALIPAY_APP_ID: string;
    ALIPAY_PRIVATE_KEY: string;
    JAZZCASH_MERCHANT_ID: string;
    JAZZCASH_PASSWORD: string;
    JAZZCASH_INTEGRITY_SALT: string;
    NEXT_PUBLIC_MAP_TILE_URL: string;
    NEXT_PUBLIC_BASE_URL: string;
  }
}


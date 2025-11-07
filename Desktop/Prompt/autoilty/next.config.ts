import type { NextConfig } from "next";
import { createTranslator } from "@i18next/next";
import createNextIntlPlugin from "@i18next/next/plugin";
import withPWA from "next-pwa";

const locales = ["en", "fr", "hi", "ur", "zh", "bn"] as const;

const translator = createTranslator({
  resources: {},
  lng: "en",
  fallbackLng: "en"
});

const intlPlugin = createNextIntlPlugin({
  supportedLngs: locales,
  fallbackLng: "en",
  defaultNS: "common"
});

const pwa = withPWA({
  dest: "public",
  register: true,
  scope: "/",
  swSrc: "src/service-worker.ts",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/autoilty-osm\.fly\.dev\/tiles\//,
      handler: "CacheFirst",
      options: {
        cacheName: "osm-tiles",
        expiration: {
          maxEntries: 400,
          maxAgeSeconds: 60 * 60 * 24 * 30
        }
      }
    },
    {
      urlPattern: /^https:\/\/.+\.(png|jpg|jpeg|svg|webp|avif)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "image-cache"
      }
    }
  ]
});

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb"
    },
    turbo: {
      rules: {
        "*.tsx": {
          loaders: ["@swc/loader"]
        }
      }
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "autoilty-supabase-storage.imgix.net"
      },
      {
        protocol: "https",
        hostname: "autoilty-osm.fly.dev"
      }
    ]
  },
  i18n: {
    locales: Array.from(locales),
    defaultLocale: "en",
    localeDetection: true
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload"
        },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value:
            "geolocation=(self), payment=(self), microphone=(), camera=(), interest-cohort=()"
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.razorpay.com https://static.alipayobjects.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https://autoilty-supabase-storage.imgix.net https://autoilty-osm.fly.dev",
            "connect-src 'self' https://autoilty.supabase.co https://api.stripe.com https://api.razorpay.com https://openapi.alipay.com https://sandbox.jazzcash.com.pk wss://autoilty.supabase.co",
            "font-src 'self' https://fonts.gstatic.com",
            "frame-src https://js.stripe.com https://checkout.razorpay.com https://render.alipay.com",
            "worker-src 'self' blob:"
          ].join("; ")
        }
      ]
    }
  ],
  rewrites: async () => [
    {
      source: "/maps/:path*",
      destination: "https://autoilty-osm.fly.dev/:path*"
    }
  ]
};

export default intlPlugin(pwa(config));


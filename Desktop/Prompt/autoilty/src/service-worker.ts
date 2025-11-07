/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.pathname.startsWith("/maps/"),
  new CacheFirst({
    cacheName: "osm-tiles",
    matchOptions: {
      ignoreSearch: true
    },
    plugins: []
  })
);

registerRoute(
  ({ request }) => request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "image-assets"
  })
);

registerRoute(
  ({ request }) => request.destination === "document",
  new NetworkFirst({
    cacheName: "pages",
    networkTimeoutSeconds: 3
  })
);

registerRoute(
  ({ url }) => url.origin === process.env.NEXT_PUBLIC_SUPABASE_URL,
  new NetworkFirst({
    cacheName: "supabase-api"
  })
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});




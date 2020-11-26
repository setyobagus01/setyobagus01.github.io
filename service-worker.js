importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

if (workbox) console.log(`Workbox berhasil dimuat`);
else console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute(
  [
    { url: "/", revision: "1" },
    { url: "/manifest.json", revision: "1" },
    { url: "/assets/icons/icon.png", revision: "1" },
    { url: "/assets/icons/maskable_icon.png", revision: "1" },
    { url: "/assets/icons/icon196x196.png", revision: "1" },
    { url: "/assets/icons/icon196x196_maksable.png", revision: "1" },
    { url: "/nav.html", revision: "1" },
    { url: "/listleague.html", revision: "1" },
    { url: "/league.html", revision: "1" },
    { url: "/index.html", revision: "1" },
    { url: "/tabs.html", revision: "1" },
    { url: "/pages/home.html", revision: "1" },
    { url: "/pages/saved.html", revision: "1" },
    { url: "/pages/league/match.html", revision: "1" },
    { url: "/pages/league/standings.html", revision: "1" },
    { url: "/css/main.css", revision: "1" },
    { url: "/css/responsive.css", revision: "1" },
    { url: "/css/materialize.min.css", revision: "1" },
    { url: "/css/materialize.css", revision: "1" },
    { url: "/js/materialize.min.js", revision: "1" },
    { url: "/js/app.js", revision: "1" },
    { url: "/js/api.js", revision: "1" },
    { url: "/js/db.js", revision: "1" },
    { url: "/js/idb.js", revision: "1" },
    { url: "/js/push.js", revision: "1" },
    { url: "/js/league.js", revision: "1" },
    { url: "/js/node.js", revision: "1" },
    { url: "/js/sw-register.js", revision: "1" },
    { url: "/js/materialize.js", revision: "1" },
  ],
  {
    ignoreURLParametersMatching: [/.*/],
  }
);

workbox.routing.registerRoute(
  new RegExp("https://api.football-data.org/v2"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "base_url",
  })
);

workbox.routing.registerRoute(
  new RegExp("https://fonts.googleapis.com"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  new RegExp("https://fonts.gstatic.com"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "material-icon",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

self.addEventListener("push", (event) => {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  let options = {
    body: body,
    icon: "img/notification.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});

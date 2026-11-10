/* Radio Clubhouse PWA service worker.
 * Caches only the static site shell. Never intercepts the live stream,
 * HLS segments, the live stage/chat API, or the anonymous /rooms/hb ping — those go straight to the network
 * so playback and low-latency stay untouched.
 */
var CACHE = "rc-shell-v6";
var PRECACHE = [
  "/",
  "/index.html",
  "/config.js",
  "/manifest.webmanifest",
  "/vendor/hls.min.js",
  "/vendor/fonts/Vazirmatn-Regular.woff2",
  "/assets/logo.jpg",
  "/assets/favicon.jpg",
  "/assets/favicon-32.png",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/assets/icon-maskable-512.png",
  "/assets/apple-touch-icon.png",
  "/apple-touch-icon.png",
  "/favicon.ico"
];

var LIVE_HOSTS = [
  "clubhouse-mini.tail4a3417.ts.net"
];

function shouldBypass(url, request) {
  var host = url.hostname.toLowerCase();
  var path = url.pathname.toLowerCase();
  var href = url.href.toLowerCase();
  for (var i = 0; i < LIVE_HOSTS.length; i++) {
    if (host === LIVE_HOSTS[i] || host.endsWith("." + LIVE_HOSTS[i])) return true;
  }
  if (host.endsWith(".ts.net")) return true;
  if (/\.(m3u8|ts|m4s|aac|mp3|m4a)(\?|$)/i.test(url.pathname)) return true;
  if (path.indexOf(".m3u8") !== -1 || path.indexOf("/hls/") !== -1 || path.indexOf("/rooms/") !== -1) return true;
  if (path === "/hb" || path.indexOf("/hb") !== -1) return true;
  if (/\/(meta\.json|chat)\b/.test(path)) return true;
  if (href.indexOf("clubhouse-mini.tail4a3417.ts.net") !== -1) return true;
  var dest = request.destination;
  if (dest === "audio" || dest === "video") return true;
  return false;
}

function isNetworkFirst(url, request) {
  if (request.mode === "navigate" || request.destination === "document") return true;
  var path = url.pathname;
  if (path === "/" || path === "/index.html" || path.endsWith("/index.html")) return true;
  if (path.endsWith("/config.js") || path === "/config.js") return true;
  return false;
}

function isShellAsset(url) {
  var path = url.pathname;
  for (var i = 0; i < PRECACHE.length; i++) {
    if (path === PRECACHE[i]) return true;
  }
  return false;
}

function networkFirst(request) {
  return fetch(request).then(function (res) {
    if (res && res.ok) {
      var copy = res.clone();
      caches.open(CACHE).then(function (cache) {
        cache.put(request, copy);
      }).catch(function () {});
    }
    return res;
  }).catch(function () {
    return caches.match(request).then(function (cached) {
      if (cached) return cached;
      if (request.mode === "navigate" || request.destination === "document") {
        return caches.match("/index.html").then(function (page) {
          return page || caches.match("/");
        });
      }
      if (new URL(request.url).pathname.endsWith("config.js")) {
        return caches.match("/config.js");
      }
      return Promise.reject(new Error("offline"));
    });
  });
}

function cacheFirst(request) {
  return caches.match(request).then(function (cached) {
    if (cached) return cached;
    return fetch(request).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) {
          cache.put(request, copy);
        }).catch(function () {});
      }
      return res;
    });
  });
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE) return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;
  var url;
  try { url = new URL(request.url); } catch (e) { return; }

  // Live stream / HLS / stage / chat: do not intercept.
  if (shouldBypass(url, request)) return;

  // Only handle same-origin static shell. Everything else goes to the network.
  if (url.origin !== self.location.origin) return;

  if (isNetworkFirst(url, request)) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (isShellAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
});

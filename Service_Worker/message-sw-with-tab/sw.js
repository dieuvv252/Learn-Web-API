const version = 2;
let staticName = `staticCache-${version}`;
let dynamicCache = "dynamicCache";
let fontCache = "fontCache";
let imgCache = `imgCache-${version}`;

let assets = [
  "/",
  "/index.html",
  "/css/index.css",
  "/js/index.js",
  "/404.html",
];
let assetsImg = ["/img/192.png", "/img/a.png", "/img/b.png", "/img/c.png"];

const objCache = {
  async preCache() {
    try {
      const cache = await caches.open(staticName);
      const cacheImage = await caches.open(imgCache);
      /**
       * addAll() = fetch() + put()
       */
      await cache.addAll(assets);
      await cacheImage.addAll(assetsImg);

      return await self.skipWaiting();
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * Delete cache
   */
  async deleteCacheOld() {
    try {
      const keys = await caches.keys();
      const arrKeyNotMatch = keys.filter(
        (key) => key != staticName && key != imgCache
      );

      arrKeyNotMatch.map((key) => caches.delete(key));
    } catch (error) {
      console.log("Delete old cache failed", error);
    }
  },

  async fetchURL(req) {
    try {
      const fetchResponse = await fetch(req);

      if (fetchResponse.status === 404) {
        return await caches.match("/404.html");
      }

      if (fetchResponse?.ok && fetchResponse?.status < 400) {
        const cache = await caches.open(staticName);
        await cache.put(req, fetchResponse.clone());
      }
      return fetchResponse;
    } catch (error) {
      const cacheResponse = await caches.match(req);
      if (cacheResponse?.ok && cacheResponse?.status < 400) {
        return cacheResponse;
      }

      return await caches.match("/404.html");
    }
  },
};

self.addEventListener("install", async (ev) => {
  /**
   * Đây là sự kiện chuẩn bị khi service worker được acitvate
   * Chuẩn bị các dữ liệu cache
   */
  try {
    await ev.waitUntil(objCache.preCache());
  } catch (error) {
    console.log("failed to updated : ", staticName);
  }
});

self.addEventListener("activate", async (ev) => {
  try {
    await ev.waitUntil(objCache.deleteCacheOld());
    await ev.waitUntil(clients.claim());
  } catch (error) {
    console.log(error);
  }
});

self.addEventListener("fetch", async (ev) => {
  try {
    await ev.respondWith(objCache.fetchURL(ev.request));
  } catch (error) {
    console.log(error);
  }
});

self.addEventListener("message", async (ev) => {
  const data = ev.data;
  const clientId = ev.source.id;
  // console.log({ ev });
  console.log("ServiceWorker recevied", { data }, { clientId });

  if ("addPerson" in data) {
    const msg = "thanks. pretend i did something action";
    sendMessage(
      {
        code: 0,
        message: msg,
      },
      clientId
    );
  }

  if ("otherAction" in data) {
    const msg = "Hola";
    sendMessage({
      code: 0,
      message: msg,
    });
  }
});

const sendMessage = async (msg, clientId) => {
  let allClients = [];

  if (clientId) {
    const client = await clients.get(clientId);
    allClients.push(client);
  } else {
    allClients = await clients.matchAll({ includeUnControlled: true });
  }

  return Promise.all(
    allClients.map((client) => {
      console.log("postMessage", msg, "to", "clientId", clientId);

      return client.postMessage(msg);
    })
  );
};

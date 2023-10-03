// b1 : dang ki service worker
const App = {
  SW: null,
  cachingName: "assetsCache1",
  init() {
    // if ("serviceWorker" in navigator) {
    //   navigator.serviceWorker
    //     .register("./sw.js", {
    //       scope: "/",
    //     })
    //     .then((registration) => {
    //       this.SW =
    //         registration.installing ||
    //         registration.waiting ||
    //         registration.active;
    //       console.log("Service worker registered");
    //     });
    //   // Kiem tra page do co service worker khong--> sự kiện xảy ra khi trình duyệt sử dụng 1 service worker mới
    //   if (navigator.serviceWorker.controller) {
    //     console.log("Service worker installed");
    //   }
    // Register to handler detect when a new or updated  service worker is installed and activated
    // navigator.serviceWorker.oncontrollerchange = (ev) => {
    //   console.log("New Service worker Activated");
    // };
    // remove / unregister service worker
    // navigator.serviceWorker.getRegistrations().then((regs) => {
    //   console.log({ regs });
    //   for (let reg of regs) {
    //     reg.unregister().then((isUnReg) => {
    //       console.log(isUnReg);
    //     });
    //   }
    // });
    // } else {
    //   console.log("Service worker not supported");
    // }
    this.startCaching();
    document
      .getElementById("btn-delete")
      .addEventListener("click", App.deleteCaching);
  },
  startCaching() {
    // open a caching and saved some reponse
    return caches
      .open(App.cachingName)
      .then((cache) => {
        console.log(`Cached ${App.cachingName} was opended`);

        let urlString = "/img/nodejs.png?id=one";
        cache.add(urlString); // add = fetch + put

        let url = new URL("http://127.0.0.1:5500/img/database-design.png?two");
        cache.add(url);

        let req = new Request("/img/regex-cheatsheet.jpg?id=three");
        cache.add(req);

        cache.keys().then((keys) => {
          keys.forEach((key, index) => {
            console.log({ index }, { key });
          });
        });

        return cache;
      })
      .then((cache) => {
        // kiem tra cache da co hay chua - check if cache exits
        caches.has(App.cachingName).then((hasCache) => {
          console.log(`${App.cachingName} = ${hasCache}`);
        });

        // search file in cache
        // cache.match() - cache.matchAll()
        // caches.match() - look in all cache
        let urlString = "/img/database-design-supa.png";
        return caches.match(urlString).then((resCache) => {
          if (
            resCache &&
            resCache.status < 400 &&
            resCache.headers.has("content-type") &&
            resCache.headers.get("content-type").match(/^image\//i)
          ) {
            //not an error if not found
            console.log("found in cache");
            console.log({ resCache });

            return resCache;
          } else {
            console.log("not in cache");
            return fetch(urlString).then((fetchRes) => {
              console.log(fetchRes);
              if (!fetchRes.ok) throw fetchRes.statusText;
              // clone() fetch valid in cache
              cache.put(urlString, fetchRes.clone());
              return fetchRes;
            });
          }
        });
      })
      .then((responseCache) => {
        console.log({ responseCache });
        document.querySelector("output").textContent = responseCache.url;
        return responseCache.blob();
      })
      .then((blob) => {
        let url = URL.createObjectURL(blob);
        let img = document.createElement("img");
        img.src = url;
        document.querySelector("output").append(img);
      });
  },
  deleteCaching() {
    // delete a response from the cache
    // caches.open(App.cachingName).then((cache) => {
    //   let url = "/img/nodejs.png?id=one";
    //   cache.delete(url).then((isDeleted) => {
    //     console.log(isDeleted);
    //   });
    // });
    // delete entire cache
    caches.delete(App.cachingName).then((isDeleted) => {
      console.log(isDeleted);
    });
  },
};

document.addEventListener("DOMContentLoaded", App.init());

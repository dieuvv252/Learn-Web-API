const version = 1;

self.addEventListener("install", (ev) => {
  // ServiceWorker installed
  // Extendable Event
  //   self.skipWaiting(); //skip waiting to activate but the page not used new service worker
  console.log("Installed");
});

self.addEventListener("activate", (ev) => {
  // When the service worker has been activated to replace an old one
  console.log("Activated - this worker not used  util page reloads ");
  // claim meaing the html use new service worker
  clients
    .claim()
    .then(() => {
      console.log(
        "the service worker has claimed all page so they use new service worker"
      );
    })
    .catch((err) => {
      console.log(err);
    });
});

self.addEventListener("fetch", (ev) => {
  //  ev.request each time the webpage asks for any resource
  console.log("fetch request for ", ev.request.url, "from", ev.clientId);
});

self.addEventListener("message", (ev) => {
  // message from webapp : ev.data
});

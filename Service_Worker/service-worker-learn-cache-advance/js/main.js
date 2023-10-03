const app = {
  async init() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("./sw.js", {
          scope: "/",
        });

        if (registration.installing) {
          console.log("serviceWorker installing");
        } else if (registration.waiting) {
          console.log("ServiceWorker installed");
        } else if (registration.active) {
          console.log("ServiceWorker active");
        }
      } catch (error) {}
    } else {
      console.log("ServiceWorker not supported");
    }
  },

  addImg() {
    const img = document.createElement("img");
    img.src = "/img/a.png?id=one";
    document.querySelector(".title").appendChild(img);
  },
};

document.addEventListener("DOMContentLoaded", async () => {
  await app.init();
  document.querySelector(".title button").addEventListener("click", app.addImg);
});

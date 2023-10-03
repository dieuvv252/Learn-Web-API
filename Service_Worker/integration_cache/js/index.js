const App = {
  player: null,
  async init() {
    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.register("./sw.js", {
          scope: "/",
        });

        switch (
          registration.active
            ? "active"
            : registration.waiting
            ? "waiting"
            : "installing"
        ) {
          case "active":
            console.log("SW active...");
            break;

          case "waiting":
            console.log("SW waiting...");
            break;

          case "installing":
            console.log("SW installing...");
            break;
        }

        // check new service worker
        if (navigator.serviceWorker.oncontrollerchange) {
          console.log("New service worker activated");
        }

        this.player = videojs("my-video", {
          controls: true,
          autoplay: true,
          muted: true,
          loop: true,
          preload: "auto",
        });
      } else {
        console.log("ServiceWorker Not Supported");
      }
    } catch (error) {
      console.log(error);
    }
  },

  async getCacheSize() {
    /**
     * Let's see how much storage we are using
     *
     */
    if ("storage" in navigator) {
      /**
       * Get total storage and current page
       */
      if ("estimate" in navigator.storage) {
        const { usage, quota } = await navigator.storage.estimate();
        const useKB = parseInt(usage / 1024);
        const quotaKB = parseInt(quota / 1024);

        console.log(`using ${useKB} kb of ${quotaKB} kb`);
      }
    } else {
      console.log("Storage API No Supported");
    }
  },

  addImage() {
    const img = document.createElement("img");
    img.src = "/img/a.png?id=1";
    document.querySelector(".title").appendChild(img);
  },
};

document.addEventListener("DOMContentLoaded", async () => {
  await App.init();
  await App.getCacheSize();
});

document.querySelector("#add-img").addEventListener("click", App.addImage);

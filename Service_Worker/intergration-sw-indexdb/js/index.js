const App = {
  DB: null,
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

        /**
         * Listen for message from service worker
         */

        navigator.serviceWorker.addEventListener("message", App.onMessage);
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

        // console.log(`using ${useKB} kb of ${quotaKB} kb`);
      }
    } else {
      console.log("Storage API No Supported");
    }
  },

  saveColor(event) {
    event.preventDefault();

    const name = document.getElementById("nameForm");
    const color = document.getElementById("color");

    const person = {
      id: Date.now(),
      name: name.value,
      color: color.value,
    };
    //  otherAction: "hello"
    App.sendMessage({ addPerson: person });
  },

  /**
   * Send some structure-cloneable to service worker
   */
  sendMessage(msg) {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(msg);
    }
  },

  onMessage({ data }) {
    /**
     * Get a message from service worker
     */
    console.log("Web page receving ", data);

    /**
     * clear form
     * */
    if ("savedPerson" in data) {
      App.showPeople();
      document.getElementById("nameForm").value = "";
    }
  },

  /**
   * Show people in indexdb
   */

  showPeople() {
    try {
      if (!App.DB) {
        App.openDB();
      }

      const tx = App.DB.transaction("colorStore", "readonly");
      const store = tx.objectStore("colorStore");

      let req = store.getAll();

      req.onsuccess = (ev) => {
        const list = document.getElementById("people");
        const ppl = ev.target.result;
        list.innerHTML = ppl
          .map((person) => {
            console.log("show", person);
            return `<li data-id="${person.id}">${person.name}
              <p>${person.color}</p>
            </li>`;
          })
          .join("\n");
      };
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * Open indexdb
   * */
  openDB() {
    const req = indexedDB.open("colorDb");

    req.onsuccess = (ev) => {
      console.log("open db success");
      App.DB = ev.target.result;
      if (App.DB.objectStoreNames.contains("colorStore")) {
        App.showPeople();
      }
    };

    req.error = (err) => {
      console.log(err);
      /** Not calling show people */
    };
  },
};

document.addEventListener("DOMContentLoaded", async () => {
  await App.init();
  await App.getCacheSize();
  App.openDB();
});

document.getElementById("btnSave").addEventListener("click", App.saveColor);

const App = {
  init() {
    dbInstance.openDB();
    domInstance.init();
  },
};

const domInstance = {
  getEleById(id) {
    return document.getElementById(id) ?? null;
  },

  getValueEle(id) {
    return document.getElementById(id).value ?? null;
  },

  renderUI(data) {
    const ulElment = domInstance.getEleById("list");
    ulElment.innerHTML = "";
    data.sort().forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `${item.id} --> ${item.name} <button class ='btn-delete' data-id=${item.id}>delete</button>`;
      ulElment.appendChild(li);
    });

    /**
     * Add event to btn-delete
     */

    domInstance.eventDomAsync();
  },

  init() {
    this.eventDomSync();
  },

  eventDomSync() {
    const btnAdd = domInstance.getEleById("btn-add");

    btnAdd.addEventListener("click", (event) => {
      event.preventDefault();
      const nameInput = domInstance.getValueEle("form-name");
      const idInput = domInstance.getValueEle("form-id");

      dbInstance.addDataToStore(
        dbInstance.nameStore,
        {
          id: idInput,
          name: nameInput,
        },
        this.renderUI
      );
    });
  },

  eventDomAsync() {
    const listBtnDelete = document.querySelectorAll(".btn-delete");

    listBtnDelete.forEach((btnEle) => {
      btnEle.addEventListener("click", (ev) => {
        const id = ev.target.dataset.id;
        dbInstance.deleteDataFromStore(
          dbInstance.nameStore,
          id,
          domInstance.renderUI
        );
      });
    });
  },
};

const dbInstance = {
  version: 26,
  dbName: "TestDB",
  nameStore: "name",
  customerStore: "customer",
  db: null,

  openDB() {
    /**
     * Call open() return an IDBRequest object
     * request is a instance IDBRequest
     */

    const request = indexedDB.open(this.dbName, this.version);

    request.onerror = (ev) => {
      console.error("Error database ", ev);
    };

    /**
     *  ev.target.result is a instance IDBRequest
     */
    request.onsuccess = (ev) => {
      console.log("w");
      this.db = ev.target.result;

      this.getAllData(domInstance.renderUI, this.nameStore);
    };

    /**
     * Trigger when new version database
     */
    request.onupgradeneeded = (ev) => {
      console.log("wa");
      console.log("new version of ", this.dbName, "release ", this.version);
      this.db = ev.target.result;

      /**
       * Need delete objectStore from old version
       */
      if (this.db.objectStoreNames.contains("name")) {
        this.deleteObjectStoreInDB(this.nameStore);
      }

      /**
       * Create objectStore from old version
       * Can add objectStore and delete objectStore not used
       */

      this.db.createObjectStore(this.nameStore, {
        keyPath: "id",
      });
    };
  },

  /**
   * Delete objectStore in indexdb
   * @param {String} name
   */
  deleteObjectStoreInDB(name) {
    this.db.deleteObjectStore(name);
  },

  /**
   * Add Data to store
   * @param {String} nameStore
   * @param {Array} data
   */

  addDataToStore(nameStore, data, callback) {
    if (this.db) {
      /**
       * Open a transaction
       */
      const transaction = this.db.transaction(nameStore, "readwrite");

      /**
       * Get store transaction
       */
      const objStore = transaction.objectStore(nameStore);

      /**
       * Trigger event transaction
       * @param {*} event
       */
      transaction.onerror = (event) => {
        console.log("transaction add error", event);
      };
      transaction.oncomplete = (event) => {
        console.log("transaction add success");
      };

      /**
       * Add data to object store
       */

      const req = objStore.add(data);

      req.onerror = (event) => {
        console.log("add error");
      };

      req.onsuccess = (event) => {
        console.log("add success");
        this.getAllData(callback, nameStore);
      };
    }
  },

  /**
   *  Get all data from name store
   * @param {String} nameStore
   * @returns
   */
  getAllData(callback, nameStore) {
    if (this.db && this.db.objectStoreNames.contains(nameStore)) {
      const transaction = this.db.transaction(nameStore, "readonly");
      const objStore = transaction.objectStore(nameStore);

      const req = objStore.getAll();

      req.onsuccess = (event) => {
        const data = event.target.result;

        callback(data);
        console.log("get all success");
      };

      req.onerror = (event) => {
        console.log("get all error", event);
      };
    }
  },

  deleteDataFromStore(nameStore, keyId, callback) {
    if (this.db) {
      const transaction = this.db.transaction(nameStore, "readwrite");
      const objStore = transaction.objectStore(nameStore);

      const req = objStore.delete(keyId);

      req.onsuccess = (event) => {
        console.log("delete  success");
        this.getAllData(callback, nameStore);
      };

      req.onerror = (event) => {
        console.log("delete error", event);
      };
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

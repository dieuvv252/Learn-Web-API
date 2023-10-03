export default class DatabaseIndex {
  constructor(nameDb, version, nameStore) {
    this.nameDb = nameDb;
    this.version = version;
    this.nameStore = nameStore;
    this.db = null;
  }

  /**
   * Open a new connection to the database
   */
  openDb() {
    const requestOpenDb = indexedDB.open(this.nameDb, this.version);

    requestOpenDb.onsuccess = (ev) => {
      console.log("open success");
      this.db = ev.target.result;
    };

    requestOpenDb.onerror = (ev) => {
      console.error("Error opening database", ev.target.error);
    };

    requestOpenDb.onupgradeneeded = (ev) => {
      console.log("new version database updated");
      this.db = ev.target.result;

      if (this.db.objectStoreNames.contains(this.nameStore)) {
        this.deleteObjectStore(this.nameStore);
      }

      this.createStoreDb(this.nameStore);
    };
  }

  /**
   * Create a new object store in the database
   * @param {String} name
   * @returns IDBObjectStore
   */
  createStoreDb(name) {
    return this.db.createObjectStore(name, {
      keyPath: "id",
    });
  }

  /**
   * Delete an object store from the database
   * @param {String} name
   * @returns void
   */
  deleteItemStoreDb(name) {
    return this.db.deleteObjectStore(name);
  }

  addItemToStore(data, passNameStore) {
    if (this.db) {
      const transaction = this.db.transaction(passNameStore, "readwrite");

      const objStore = transaction.objectStore(passNameStore);

      const requestAdd = objStore.add(data);

      requestAdd.onsuccess = (ev) => {
        console.log("add success");
      };

      requestAdd.onerror = (ev) => {
        console.log("error");
      };
    }
  }
}

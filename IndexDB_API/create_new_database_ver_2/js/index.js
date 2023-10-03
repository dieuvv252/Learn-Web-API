import DOMAPI from "./dom.js";

class MainThread {
  constructor() {
    this.domAPI = new DOMAPI();
  }

  init() {
    console.log("app init");
    this.domAPI.init();
  }
}

const app = new MainThread();

app.init();

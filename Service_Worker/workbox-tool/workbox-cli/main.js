document.addEventListener("DOMContentLoaded", async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.register("./sw.js", {
      scope: "/",
    });
  } else {
    console.log("Not Supported");
  }
});

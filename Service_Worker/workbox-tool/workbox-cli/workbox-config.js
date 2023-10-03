module.exports = {
  globDirectory: ".",
  globPatterns: ["**/assets/*.css", "**/index.html"],
  // swSrc: "./custom-serviceworker.js",
  swDest: "./sw.js",
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};

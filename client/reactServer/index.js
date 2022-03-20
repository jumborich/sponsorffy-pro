// Enable jsx parsing using babel
require("ignore-styles");

require("@babel/register")({
  "ignore":[/(node_modules)/],
  "presets":[["@babel/preset-react", {"runtime": "automatic"}], "@babel/preset-env"],
  plugins:[
    // "@babel/syntax-dynamic-import",
    // "dynamic-import-node"
  ]
});


// Import server
require("./server");


process.on('unhandledRejection', (reason, promise) => {
  // console.log('Unhandled rejection at ', promise, `reason: ${reason}`)
  process.exit(1)
});

process.on('uncaughtException', err => {
  // console.log(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})
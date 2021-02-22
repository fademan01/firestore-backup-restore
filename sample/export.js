const { backup, backups, initializeApp } = require("firestore-export-import");
const serviceAccount = require("./serviceAccountKey.json");
const fs = require("fs");
// Initiate Firebase App
// appName is optional, you can omit it.
const appName = "[DEFAULT]";
initializeApp(serviceAccount, appName);
const options = {
  docsFromEachCollection: 10, // limit number of documents when exporting
  refs: ["refKey"], // reference Path
};
// Start exporting your data
backup("test", options).then((data) =>
  //   console.log(JSON.stringify(data))
  //   const fs = require('fs')
  fs.writeFileSync("./cookies1.json", JSON.stringify(data, null, 2))
);

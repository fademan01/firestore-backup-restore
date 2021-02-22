// In your index.js
const { initializeApp, restore } = require("firestore-export-import");
const serviceAccount = require("./serviceAccountKey.json");

// Initiate Firebase App
// appName is optional, you can omit it.
const appName = "[DEFAULT]";
initializeApp(serviceAccount, appName);

// Start importing your data
// The array of date, location and reference fields are optional
restore("./local.json", {
  autoParseDates: true,
  geos: ["location", "locations"],
  refs: ["refKey", "arrayRef"],
});

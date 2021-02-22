"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backups = exports.restore = exports.backup = exports.admin = exports.initializeApp = void 0;
var admin = __importStar(require("firebase-admin"));
exports.admin = admin;
var restoreService = __importStar(require("./import"));
var backupService = __importStar(require("./export"));
/**
 * Initialize Firebase App
 *
 * @param {object} serviceAccount
 * @param {string} name
 */
var initializeApp = function (serviceAccount, name) {
    if (name === void 0) { name = '[DEFAULT]'; }
    if (admin.apps.length === 0 ||
        (admin.apps.length > 0 && admin.app().name !== name)) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: serviceAccount['databaseURL'],
        }, name);
        admin.firestore().settings({ timestampsInSnapshots: true });
    }
    return true;
};
exports.initializeApp = initializeApp;
/**
 * Backup data from firestore
 *
 * @param {string} collectionName
 * @param {IExportOptions} options
 * @return {json}
 */
var backup = function (collectionName, options) {
    return backupService.backup(collectionName, options);
};
exports.backup = backup;
/**
 * Restore data to firestore
 * @param fileName
 * @param options
 */
var restore = function (fileName, options) {
    if (options === void 0) { options = {}; }
    return restoreService.restore(fileName, options);
};
exports.restore = restore;
/**
 * Get all collections data
 * @param {Array<string>} collectionNameArray
 * @param {IExportOptions} options
 */
var backups = function (collectionNameArray, options) {
    if (collectionNameArray === void 0) { collectionNameArray = []; }
    return backupService.getAllCollections(collectionNameArray, options);
};
exports.backups = backups;
//# sourceMappingURL=index.js.map
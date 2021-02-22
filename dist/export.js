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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backup = exports.getAllCollections = void 0;
var admin = __importStar(require("firebase-admin"));
var helper_1 = require("./helper");
/**
 * Get data from all collections
 * Suggestion from jcummings2 and leningsv
 * @param {Array<string>} collectionNameArray
 */
var getAllCollections = function (collectionNameArray, options) { return __awaiter(void 0, void 0, void 0, function () {
    var db, snap, paths, promises, value, all;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = admin.firestore();
                return [4 /*yield*/, db.listCollections()];
            case 1:
                snap = _a.sent();
                paths = collectionNameArray;
                if (paths.length === 0) {
                    // get all collections
                    snap.forEach(function (collection) { return paths.push(collection.path); });
                }
                promises = [];
                paths.forEach(function (segment) {
                    var result = exports.backup(segment, options);
                    promises.push(result);
                });
                return [4 /*yield*/, Promise.all(promises)];
            case 2:
                value = _a.sent();
                all = Object.assign.apply(Object, __spread([{}], value));
                return [2 /*return*/, all];
        }
    });
}); };
exports.getAllCollections = getAllCollections;
/**
 * Backup data from firestore
 *
 * @param {string} collectionName
 * @returns {Promise<any>}
 */
var backup = function (collectionName, options) { return __awaiter(void 0, void 0, void 0, function () {
    function addElement(ElementList, element) {
        var newList = Object.assign(ElementList, element);
        return newList;
    }
    var db, data, documents, docs, docs_1, docs_1_1, doc, subCollections, _a, _b, refKey, _c, _d, val, subCollections_1, subCollections_1_1, subCol, subColData, e_1_1, e_2_1, error_1;
    var e_2, _e, e_3, _f, e_4, _g, e_1, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _j.trys.push([0, 17, , 18]);
                db = admin.firestore();
                data = {};
                data[collectionName] = {};
                return [4 /*yield*/, db.collection(collectionName).get()];
            case 1:
                documents = _j.sent();
                docs = (options === null || options === void 0 ? void 0 : options.docsFromEachCollection) > 0
                    ? documents.docs.slice(0, options === null || options === void 0 ? void 0 : options.docsFromEachCollection)
                    : documents.docs;
                _j.label = 2;
            case 2:
                _j.trys.push([2, 14, 15, 16]);
                docs_1 = __values(docs), docs_1_1 = docs_1.next();
                _j.label = 3;
            case 3:
                if (!!docs_1_1.done) return [3 /*break*/, 13];
                doc = docs_1_1.value;
                return [4 /*yield*/, doc.ref.listCollections()];
            case 4:
                subCollections = _j.sent();
                data[collectionName][doc.id] = doc.data();
                if (options === null || options === void 0 ? void 0 : options.refs) {
                    try {
                        for (_a = (e_3 = void 0, __values(options === null || options === void 0 ? void 0 : options.refs)), _b = _a.next(); !_b.done; _b = _a.next()) {
                            refKey = _b.value;
                            if (refKey.indexOf('.') > -1) {
                                helper_1.traverseObjects(data, function (value) {
                                    var _a;
                                    if (((_a = value.constructor) === null || _a === void 0 ? void 0 : _a.name) !== 'DocumentReference') {
                                        return null;
                                    }
                                    return helper_1.getPath(value);
                                });
                            }
                            else {
                                if (data[collectionName][doc.id][refKey]) {
                                    if (Array.isArray(data[collectionName][doc.id][refKey])) {
                                        try {
                                            for (_c = (e_4 = void 0, __values(data[collectionName][doc.id][refKey])), _d = _c.next(); !_d.done; _d = _c.next()) {
                                                val = _d.value;
                                                data[collectionName][doc.id][refKey] = helper_1.getPath(val);
                                            }
                                        }
                                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                        finally {
                                            try {
                                                if (_d && !_d.done && (_g = _c.return)) _g.call(_c);
                                            }
                                            finally { if (e_4) throw e_4.error; }
                                        }
                                    }
                                    else if (typeof data[collectionName][doc.id][refKey].path === 'string') {
                                        data[collectionName][doc.id][refKey] =
                                            data[collectionName][doc.id][refKey].path;
                                    }
                                }
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
                data[collectionName][doc.id]['subCollection'] = {};
                _j.label = 5;
            case 5:
                _j.trys.push([5, 10, 11, 12]);
                subCollections_1 = (e_1 = void 0, __values(subCollections)), subCollections_1_1 = subCollections_1.next();
                _j.label = 6;
            case 6:
                if (!!subCollections_1_1.done) return [3 /*break*/, 9];
                subCol = subCollections_1_1.value;
                return [4 /*yield*/, exports.backup(collectionName + "/" + doc.id + "/" + subCol.id, options)];
            case 7:
                subColData = _j.sent();
                data[collectionName][doc.id]['subCollection'] = addElement(data[collectionName][doc.id]['subCollection'], subColData);
                _j.label = 8;
            case 8:
                subCollections_1_1 = subCollections_1.next();
                return [3 /*break*/, 6];
            case 9: return [3 /*break*/, 12];
            case 10:
                e_1_1 = _j.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 11:
                try {
                    if (subCollections_1_1 && !subCollections_1_1.done && (_h = subCollections_1.return)) _h.call(subCollections_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 12:
                docs_1_1 = docs_1.next();
                return [3 /*break*/, 3];
            case 13: return [3 /*break*/, 16];
            case 14:
                e_2_1 = _j.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 16];
            case 15:
                try {
                    if (docs_1_1 && !docs_1_1.done && (_e = docs_1.return)) _e.call(docs_1);
                }
                finally { if (e_2) throw e_2.error; }
                return [7 /*endfinally*/];
            case 16: return [2 /*return*/, data];
            case 17:
                error_1 = _j.sent();
                console.error(error_1);
                throw new Error(error_1);
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.backup = backup;
//# sourceMappingURL=export.js.map
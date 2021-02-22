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
Object.defineProperty(exports, "__esModule", { value: true });
exports.restore = void 0;
var fs = __importStar(require("fs"));
var admin = __importStar(require("firebase-admin"));
var helper_1 = require("./helper");
/**
 * Restore data to firestore
 *
 * @param {string} fileName
 * @param {IImportOptions} options
 */
var restore = function (fileName, options) {
    var db = admin.firestore();
    return new Promise(function (resolve, reject) {
        if (typeof fileName === 'object') {
            var dataObj = fileName;
            updateCollection(db, dataObj, options)
                .then(function () {
                resolve({
                    status: true,
                    message: 'Collection successfully imported!',
                });
            })
                .catch(function (error) {
                reject({ status: false, message: error.message });
            });
        }
        else {
            fs.readFile(fileName, 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                    reject({ status: false, message: err.message });
                }
                // Turn string from file to an Array
                var dataObj = JSON.parse(data);
                updateCollection(db, dataObj, options)
                    .then(function () {
                    resolve({
                        status: true,
                        message: 'Collection successfully imported!',
                    });
                })
                    .catch(function (error) {
                    reject({ status: false, message: error.message });
                });
            });
        }
    }).catch(function (error) { return console.error(error); });
};
exports.restore = restore;
/**
 * Update data to firestore
 *
 * @param {any} db
 * @param {object} dataObj
 * @param {IImportOptions} options
 */
var updateCollection = function (db, dataObj, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var subCollectionNameList, _a, _b, _i, index, collectionName, _c, _d, _e, doc, specificsubcollection, docId, result, subCollectionsExist, _f, _g, _h, index_1, subCollections, revivedSubCollection, subCollectionPath, e_1_1, result, subCollectionsExist, _j, _k, _l, index_2, subCollections, revivedSubCollection, subCollectionPath, e_2_1;
        var e_1, _m, e_2, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    subCollectionNameList = ['provinces', 'districts', 'wards', 'streets', 'projects'];
                    _a = [];
                    for (_b in dataObj)
                        _a.push(_b);
                    _i = 0;
                    _p.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 24];
                    index = _a[_i];
                    collectionName = index;
                    _c = [];
                    for (_d in dataObj[index])
                        _c.push(_d);
                    _e = 0;
                    _p.label = 2;
                case 2:
                    if (!(_e < _c.length)) return [3 /*break*/, 23];
                    doc = _c[_e];
                    if (!dataObj[index].hasOwnProperty(doc)) return [3 /*break*/, 22];
                    specificsubcollection = index.split("/");
                    docId = Array.isArray(dataObj[index]) && subCollectionNameList.includes(specificsubcollection[specificsubcollection.length - 1]) ? convertToPascalCase(dataObj[index][doc].name) : doc;
                    console.log('Array.isArray(dataObj[index]) :', Array.isArray(dataObj[index]));
                    if (!!Array.isArray(dataObj[index])) return [3 /*break*/, 13];
                    result = subCollectionNameList.filter(function (word) { return dataObj[index][word]; });
                    return [4 /*yield*/, result.map(function (x) {
                            var subCol = dataObj[index][x];
                            delete dataObj[index][x];
                            return subCol;
                        })];
                case 3:
                    subCollectionsExist = _p.sent();
                    return [4 /*yield*/, startUpdating(db, collectionName, docId, dataObj[index][doc], options)];
                case 4:
                    _p.sent();
                    if (!(subCollectionsExist.length > 0)) return [3 /*break*/, 12];
                    _p.label = 5;
                case 5:
                    _p.trys.push([5, 10, 11, 12]);
                    _f = (e_1 = void 0, __values(subCollectionsExist.entries())), _g = _f.next();
                    _p.label = 6;
                case 6:
                    if (!!_g.done) return [3 /*break*/, 9];
                    _h = __read(_g.value, 2), index_1 = _h[0], subCollections = _h[1];
                    revivedSubCollection = {};
                    subCollectionPath = collectionName + "/" + docId + "/" + result[index_1];
                    if (!(result[index_1] != "projects")) return [3 /*break*/, 8];
                    revivedSubCollection[subCollectionPath] = subCollections;
                    console.log('sub:', subCollectionsExist, result[index_1], "before1:", revivedSubCollection, subCollectionPath);
                    return [4 /*yield*/, updateCollection(db, revivedSubCollection, options)];
                case 7:
                    _p.sent();
                    _p.label = 8;
                case 8:
                    _g = _f.next();
                    return [3 /*break*/, 6];
                case 9: return [3 /*break*/, 12];
                case 10:
                    e_1_1 = _p.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 11:
                    try {
                        if (_g && !_g.done && (_m = _f.return)) _m.call(_f);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 12: return [3 /*break*/, 22];
                case 13:
                    result = subCollectionNameList.filter(function (word) { return dataObj[index][doc][word]; });
                    console.log("12", result);
                    subCollectionsExist = result.map(function (x) {
                        var subCol = dataObj[index][doc][x];
                        delete dataObj[index][doc][x];
                        return subCol;
                    });
                    return [4 /*yield*/, startUpdating(db, collectionName, docId, dataObj[index][doc], options)];
                case 14:
                    _p.sent();
                    if (!(subCollectionsExist.length > 0)) return [3 /*break*/, 22];
                    _p.label = 15;
                case 15:
                    _p.trys.push([15, 20, 21, 22]);
                    _j = (e_2 = void 0, __values(subCollectionsExist.entries())), _k = _j.next();
                    _p.label = 16;
                case 16:
                    if (!!_k.done) return [3 /*break*/, 19];
                    _l = __read(_k.value, 2), index_2 = _l[0], subCollections = _l[1];
                    revivedSubCollection = {};
                    subCollectionPath = collectionName + "/" + docId + "/" + result[index_2];
                    if (!(result[index_2] != "projects")) return [3 /*break*/, 18];
                    revivedSubCollection[subCollectionPath] = subCollections;
                    console.log('sub1:', subCollectionsExist, result[index_2], "before3:", revivedSubCollection, subCollectionPath);
                    return [4 /*yield*/, updateCollection(db, revivedSubCollection, options)];
                case 17:
                    _p.sent();
                    _p.label = 18;
                case 18:
                    _k = _j.next();
                    return [3 /*break*/, 16];
                case 19: return [3 /*break*/, 22];
                case 20:
                    e_2_1 = _p.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 22];
                case 21:
                    try {
                        if (_k && !_k.done && (_o = _j.return)) _o.call(_j);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 22:
                    _e++;
                    return [3 /*break*/, 2];
                case 23:
                    _i++;
                    return [3 /*break*/, 1];
                case 24: return [2 /*return*/];
            }
        });
    });
};
/**
 * Write data to database
 * @param db
 * @param collectionName
 * @param docId
 * @param data
 * @param options
 */
var startUpdating = function (db, collectionName, docId, data, options) {
    // Update date value
    if (options.dates && options.dates.length > 0) {
        options.dates.forEach(function (date) {
            if (data.hasOwnProperty(date)) {
                // check type of the date
                if (Array.isArray(data[date])) {
                    data[date] = data[date].map(function (d) { return helper_1.makeTime(d); });
                }
                else {
                    data[date] = helper_1.makeTime(data[date]);
                }
            }
            // Check for nested date
            if (date.indexOf('.') > -1) {
                helper_1.traverseObjects(data, function (value) {
                    if (!value.hasOwnProperty('_seconds')) {
                        return null;
                    }
                    return helper_1.makeTime(value);
                });
            }
        });
    }
    if (options.autoParseDates) {
        helper_1.parseAndConvertDates(data);
    }
    // reference key
    if (options.refs && options.refs.length > 0) {
        options.refs.forEach(function (ref) {
            if (data.hasOwnProperty(ref)) {
                // check type of the reference
                if (Array.isArray(data[ref])) {
                    data[ref] = data[ref].map(function (ref) { return db.doc(ref); });
                }
                else {
                    data[ref] = db.doc(data[ref]);
                }
            }
        });
    }
    // Enter geo value
    if (options.geos && options.geos.length > 0) {
        options.geos.forEach(function (geo) {
            if (data.hasOwnProperty(geo)) {
                // array of geo locations
                if (Array.isArray(data[geo])) {
                    data[geo] = data[geo].map(function (geoValues) { return helper_1.makeGeoPoint(geoValues); });
                }
                else {
                    data[geo] = helper_1.makeGeoPoint(data[geo]);
                }
            }
            if (geo.indexOf('.') > -1) {
                helper_1.traverseObjects(data, function (value) {
                    if (!value.hasOwnProperty('_latitude')) {
                        return null;
                    }
                    return helper_1.makeGeoPoint(value);
                });
            }
        });
    }
    return new Promise(function (resolve, reject) {
        db.collection(collectionName)
            .doc(docId)
            .set(data)
            .then(function () {
            console.log(docId + " was successfully added to firestore!");
            resolve({
                status: true,
                message: docId + " was successfully added to firestore!",
            });
        })
            .catch(function (error) {
            console.log(error);
            reject({
                status: false,
                message: error.message,
            });
        });
    });
};
//# sourceMappingURL=import.js.map
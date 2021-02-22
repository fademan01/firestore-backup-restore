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
exports.parseAndConvertDates = exports.traverseObjects = exports.getPath = exports.makeTime = exports.makeGeoPoint = void 0;
var admin = __importStar(require("firebase-admin"));
var makeGeoPoint = function (geoValues) {
    if (!geoValues._latitude || !geoValues._longitude) {
        return null;
    }
    return new admin.firestore.GeoPoint(geoValues._latitude, geoValues._longitude);
};
exports.makeGeoPoint = makeGeoPoint;
/**
 * Convert time array in a Date object
 * @param firebaseTimestamp
 */
var makeTime = function (firebaseTimestamp) {
    if (!firebaseTimestamp || !firebaseTimestamp._seconds) {
        return null;
    }
    return new Date(firebaseTimestamp._seconds * 1000);
};
exports.makeTime = makeTime;
var getPath = function (obj) {
    if (obj && typeof obj.path === 'string') {
        return obj.path;
    }
    return obj;
};
exports.getPath = getPath;
/**
 * Check if the parameter is an Object
 * @param test
 */
var isObject = function (test) {
    return (test === null || test === void 0 ? void 0 : test.constructor) === Object;
};
/**
 * Check if the parameter is an Object
 * @param test
 */
var isArray = function (test) {
    return Array.isArray(test);
};
/**
 * Traverse given data, until there is no sub node anymore
 * Executes the callback function for every sub node found
 * @param data
 * @param callback
 */
var traverseObjects = function (data, callback) {
    var e_1, _a;
    var _b;
    try {
        for (var _c = __values(Object.entries(data)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
            if (!isObject(value) &&
                !isArray(value) &&
                ((_b = value.constructor) === null || _b === void 0 ? void 0 : _b.name) !== 'DocumentReference') {
                continue;
            }
            var checkResult = callback(value);
            if (checkResult) {
                data[key] = checkResult;
                continue;
            }
            exports.traverseObjects(data[key], callback);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
exports.traverseObjects = traverseObjects;
var parseAndConvertDates = function (data) {
    exports.traverseObjects(data, function (value) {
        var isTimeStamp = typeof value === 'object' &&
            value.hasOwnProperty('_seconds') &&
            value.hasOwnProperty('_nanoseconds');
        if (isTimeStamp) {
            return exports.makeTime(value);
        }
        return null;
    });
};
exports.parseAndConvertDates = parseAndConvertDates;
//# sourceMappingURL=helper.js.map
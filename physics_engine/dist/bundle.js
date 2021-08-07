/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Canvas.ts":
/*!***********************!*\
  !*** ./src/Canvas.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var light = "#efefef";
var dark = "#101010";
var Canvas = /** @class */ (function () {
    function Canvas(theme) {
        this.POINT_OPTS = {
            fillStyleDark: "#efefef",
            fillStyleLight: "#101010",
            radius: 5,
        };
        this.theme = theme === undefined ? "dark" : theme;
        var canvas = document.getElementById("screen");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.backgroundColor = this.theme === "dark" ? dark : light;
        this.ctx = canvas.getContext("2d");
    }
    Canvas.prototype.getPointFillStyle = function () {
        return this.POINT_OPTS[this.theme === "dark" ? "fillStyleDark" : "fillStyleLight"];
    };
    Canvas.prototype.drawPoint = function (pt, opts) {
        if (opts === void 0) { opts = {}; }
        var fillStyle = opts.fillStyle === undefined ? this.getPointFillStyle() : opts.fillStyle;
        var radius = opts.radius === undefined ? this.POINT_OPTS.radius : opts.radius;
        var x = pt.x, y = pt.y;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        this.ctx.fillStyle = fillStyle;
        this.ctx.fill();
    };
    Canvas.prototype.drawPoints = function (pts) {
        var _this = this;
        pts.forEach(function (pt) { return _this.drawPoint(pt); });
    };
    Canvas.prototype.drawLine = function () {
    };
    Canvas.prototype.drawLines = function () {
    };
    return Canvas;
}());
exports.default = Canvas;


/***/ }),

/***/ "./src/Point.ts":
/*!**********************!*\
  !*** ./src/Point.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var helpers_1 = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.copy = function () {
        return new Point(this.x, this.y);
    };
    Point.prototype.pointAlg = function (A, algFn) {
        this.x = algFn(this.x, A.x);
        this.y = algFn(this.y, A.y);
        return this;
    };
    Point.prototype.add = function (A) {
        return this.pointAlg(A, helpers_1.addFn);
    };
    Point.prototype.sub = function (A) {
        return this.pointAlg(A, helpers_1.subFn);
    };
    Point.pointAlg = function (A, B, algFn) {
        return new Point(algFn(A.x, B.x), algFn(A.y, B.y));
    };
    Point.add = function (A, B) {
        return Point.pointAlg(A, B, helpers_1.addFn);
    };
    Point.sub = function (A, B) {
        return Point.pointAlg(A, B, helpers_1.subFn);
    };
    return Point;
}());
exports.default = Point;


/***/ }),

/***/ "./src/Vector.ts":
/*!***********************!*\
  !*** ./src/Vector.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var helpers_1 = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
var helpers_2 = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
var params = ['x', 'y', 'z'];
var Vector = /** @class */ (function () {
    function Vector(x, y, z) {
        this.h = 1;
        this.x = x === undefined ? 0 : x;
        this.y = y === undefined ? 0 : y;
        this.z = z === undefined ? 0 : z;
    }
    Vector.prototype.copy = function () {
        return new Vector(this.x, this.y, this.z);
    };
    Vector.prototype.log = function () {
        var _this = this;
        var Obj = { x: 0, y: 0, z: 0, h: 0 };
        params.forEach(function (p) {
            Obj[p] = _this[p];
        });
        console.log(Obj);
    };
    Vector.prototype.vectorAlg = function (A, algFn) {
        var _this = this;
        if (typeof A === "number") {
            params.forEach(function (p) {
                _this[p] = algFn(_this[p], A);
            });
        }
        else {
            params.forEach(function (p) {
                _this[p] = algFn(_this[p], A[p]);
            });
        }
        return this;
    };
    Vector.prototype.add = function (A) { return this.vectorAlg(A, helpers_1.addFn); };
    Vector.prototype.sub = function (A) { return this.vectorAlg(A, helpers_1.subFn); };
    Vector.prototype.mul = function (a) { return this.vectorAlg(a, helpers_1.mulFn); };
    Vector.prototype.div = function (a) { return this.vectorAlg(a, helpers_1.divFn); };
    Vector.prototype.addScaled = function (A, s) {
        return this.add(Vector.mul(A, s));
    };
    Vector.prototype.vectorBool = function (A, boolFn) {
        var _this = this;
        var res = true;
        params.forEach(function (p) { return res && (res = boolFn(_this[p], A[p])); });
        return res;
    };
    Vector.prototype.eq = function (A) { return this.vectorBool(A, helpers_2.eqFn); };
    Vector.prototype.gt = function (A) { return this.vectorBool(A, helpers_2.gtFn); };
    Vector.prototype.lt = function (A) { return this.vectorBool(A, helpers_2.ltFn); };
    Vector.prototype.geq = function (A) { return this.vectorBool(A, helpers_2.geqFn); };
    Vector.prototype.leq = function (A) { return this.vectorBool(A, helpers_2.leqFn); };
    Vector.prototype.dot = function (A) {
        var _this = this;
        var sum = 0;
        params.forEach(function (p) {
            sum += _this[p] * A[p];
        });
        return sum;
    };
    Vector.prototype.cross = function (A) {
        return new Vector(this.y * A.z - this.z * A.y, this.z * A.x - this.x * A.z, this.x * A.y - this.y * A.x);
    };
    Vector.prototype.magnitude = function () {
        var _this = this;
        var sum = 0;
        params.forEach(function (p) {
            sum += _this[p] * _this[p];
        });
        return Math.sqrt(sum);
    };
    Vector.prototype.squareMagniture = function () {
        var _this = this;
        var sum = 0;
        params.forEach(function (p) {
            sum += _this[p] * _this[p];
        });
        return sum;
    };
    Vector.prototype.normalize = function () {
        var m = this.magnitude();
        return this.div(m);
    };
    Vector.prototype.invert = function () {
        var _this = this;
        params.forEach(function (p) {
            _this[p] *= -1;
        });
        return this;
    };
    Vector.vectorAlg = function (A, B, algFn) {
        if (typeof B === "number") {
            return new Vector(algFn(A.x, B), algFn(A.y, B), algFn(A.z, B));
        }
        else {
            return new Vector(algFn(A.x, B.x), algFn(A.y, B.y), algFn(A.z, B.z));
        }
    };
    Vector.add = function (A, B) { return Vector.vectorAlg(A, B, helpers_1.addFn); };
    Vector.sub = function (A, B) { return Vector.vectorAlg(A, B, helpers_1.subFn); };
    Vector.mul = function (A, B) { return Vector.vectorAlg(A, B, helpers_1.mulFn); };
    Vector.div = function (A, B) { return Vector.vectorAlg(A, B, helpers_1.divFn); };
    Vector.addScaled = function (A, B, s) {
        return Vector.add(A, Vector.mul(B, s));
    };
    Vector.vectorBool = function (A, B, boolFn) {
        var res = true;
        params.forEach(function (p) { return res && (res = boolFn(A[p], B[p])); });
        return res;
    };
    Vector.eq = function (A, B) { return Vector.vectorBool(A, B, helpers_2.eqFn); };
    Vector.gt = function (A, B) { return Vector.vectorBool(A, B, helpers_2.gtFn); };
    Vector.lt = function (A, B) { return Vector.vectorBool(A, B, helpers_2.ltFn); };
    Vector.geq = function (A, B) { return Vector.vectorBool(A, B, helpers_2.geqFn); };
    Vector.leq = function (A, B) { return Vector.vectorBool(A, B, helpers_2.leqFn); };
    return Vector;
}());
exports.default = Vector;


/***/ }),

/***/ "./src/helpers.ts":
/*!************************!*\
  !*** ./src/helpers.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clockWise = exports.divFn = exports.mulFn = exports.subFn = exports.addFn = exports.ltFn = exports.gtFn = exports.geqFn = exports.leqFn = exports.eqFn = void 0;
// helpers
var eqFn = function (a, b) { return a === b; };
exports.eqFn = eqFn;
var leqFn = function (a, b) { return a <= b; };
exports.leqFn = leqFn;
var geqFn = function (a, b) { return a >= b; };
exports.geqFn = geqFn;
var gtFn = function (a, b) { return a > b; };
exports.gtFn = gtFn;
var ltFn = function (a, b) { return a < b; };
exports.ltFn = ltFn;
// algebraic functions
var addFn = function (a, b) { return a + b; };
exports.addFn = addFn;
var subFn = function (a, b) { return a - b; };
exports.subFn = subFn;
var mulFn = function (a, b) { return a * b; };
exports.mulFn = mulFn;
var divFn = function (a, b) { return a / b; };
exports.divFn = divFn;
// sort points in clockwise direction
var clockWise = function (a, b) { return (Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x)); };
exports.clockWise = clockWise;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Canvas_1 = __importDefault(__webpack_require__(/*! ./Canvas */ "./src/Canvas.ts"));
var Point_1 = __importDefault(__webpack_require__(/*! ./Point */ "./src/Point.ts"));
var Vector_1 = __importDefault(__webpack_require__(/*! ./Vector */ "./src/Vector.ts"));
var newRand = function (n) { return Math.floor(Math.random() * n); };
window.onload = function () {
    var num = 500;
    var canvas = new Canvas_1.default();
    var pts = (new Array(20)).fill(0).map(function (p) { return new Point_1.default(newRand(num), newRand(num)); });
    canvas.drawPoints(pts);
    var x = new Vector_1.default(1, 0, 0);
    var y = new Vector_1.default(0, 1, 0);
    var z = new Vector_1.default(0, 0, 1);
    Vector_1.default.add(x, y).log();
    Vector_1.default.sub(y, x).log();
    x.cross(y).log();
    y.cross(z).log();
    z.cross(x).log();
    console.log(x.dot(y));
    console.log(Vector_1.default.add(x, y).dot(y));
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map
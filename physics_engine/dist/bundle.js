/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Canvas.ts":
/*!***********************!*\
  !*** ./src/Canvas.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
// import Point from "./Point";
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
        this.canvas = document.getElementById("screen");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.backgroundColor = this.theme === "dark" ? dark : light;
        this.ctx = this.canvas.getContext("2d");
        // window.addEventListener("resize", function(this:Canvas) {
        // 	this.canvas.width = window.innerWidth;
        // 	this.canvas.height = window.innerHeight;
        // }.bind(this));
    }
    Canvas.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    Canvas.prototype.getPointFillStyle = function () {
        return this.POINT_OPTS[this.theme === "dark" ? "fillStyleDark" : "fillStyleLight"];
    };
    Canvas.prototype.drawPoint = function (pt, opts) {
        if (opts === void 0) { opts = {}; }
        var fillStyle = opts.fillStyle === undefined ? this.getPointFillStyle() : opts.fillStyle;
        var radius = opts.radius === undefined ? this.POINT_OPTS.radius : opts.radius;
        var x = pt.x, y = pt.y;
        this.ctx.beginPath();
        this.ctx.arc(x, this.canvas.height - y, radius, 0, 2 * Math.PI, true);
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

/***/ "./src/Particle.ts":
/*!*************************!*\
  !*** ./src/Particle.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Vector_1 = __importDefault(__webpack_require__(/*! ./Vector */ "./src/Vector.ts"));
var Particle = /** @class */ (function () {
    function Particle(mass, p, v, a, damping) {
        this._damping = 0.995;
        this._inverseMass = 0;
        if (mass === 0)
            throw new Error("Partice cannot have mass 0");
        if (mass !== undefined)
            this._inverseMass = 1 / mass;
        this.position = p === undefined ? new Vector_1.default() : p;
        this.velocity = v === undefined ? new Vector_1.default() : v;
        this.acceleration = a === undefined ? new Vector_1.default() : a;
        if (damping !== undefined)
            this._damping = damping;
    }
    Particle.prototype.copy = function () {
        return new Particle(1 / this._inverseMass, this.position.copy(), this.velocity.copy(), this.acceleration.copy(), this._damping);
    };
    Particle.prototype.setMass = function (m) {
        if (m === 0)
            throw new Error("Partice cannot have mass 0");
        this._inverseMass = 1 / m;
    };
    Object.defineProperty(Particle.prototype, "inverseMass", {
        get: function () {
            return this._inverseMass;
        },
        set: function (value) {
            this._inverseMass = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Particle.prototype, "damping", {
        get: function () {
            return this._damping;
        },
        set: function (value) {
            this._damping = value;
        },
        enumerable: false,
        configurable: true
    });
    Particle.prototype.integrate = function (t, f) {
        if (t === 0)
            throw new Error("Time difference cannot be 0");
        this.position.addScaled(this.velocity, t); // add here a * (t^2 / 2) if necessary
        if (this.position.y <= 100) {
            this.position.y = 100;
            this.velocity.y *= -0.8;
            this.acceleration.y *= -0.8;
        }
        var resAcceleration = Vector_1.default.addScaled(this.acceleration, f, this._inverseMass);
        this.velocity.addScaled(resAcceleration, t);
        this.velocity.mul(Math.pow(this._damping, t));
    };
    return Particle;
}());
exports.default = Particle;


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
    Vector.prototype.mul = function (A) { return this.vectorAlg(A, helpers_1.mulFn); };
    Vector.prototype.addScaled = function (A, s) {
        return this.add(Vector.mul(A, s));
    };
    Vector.prototype.div = function (A) {
        if (A === 0) {
            throw new Error("Division by zero");
        }
        return this.vectorAlg(A, helpers_1.divFn);
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
    Vector.addScaled = function (A, B, s) {
        return Vector.add(A, Vector.mul(B, s));
    };
    Vector.div = function (A, B) {
        if (B === 0) {
            throw new Error("Division by zero");
        }
        return Vector.vectorAlg(A, B, helpers_1.divFn);
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
exports.newRand = exports.clockWise = exports.divFn = exports.mulFn = exports.subFn = exports.addFn = exports.ltFn = exports.gtFn = exports.geqFn = exports.leqFn = exports.eqFn = void 0;
// condition functions
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
// rgn
var newRand = function (n) { return Math.floor(Math.random() * n); };
exports.newRand = newRand;


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
var Particle_1 = __importDefault(__webpack_require__(/*! ./Particle */ "./src/Particle.ts"));
var Vector_1 = __importDefault(__webpack_require__(/*! ./Vector */ "./src/Vector.ts"));
var t = 1000 / 150;
var intervalPtr1 = null;
var intervalPtr2 = null;
var getX = function (i, n, r, x) {
    return x + r * Math.cos(2 * Math.PI * i / n);
};
var getY = function (i, n, r, y) {
    return y + r * Math.sin(2 * Math.PI * i / n);
};
var getRandomColor = function () {
    var tmp = Math.random();
    if (tmp < 0.2) {
        return "#f00";
    }
    else if (tmp < 0.4) {
        return "#0f0";
    }
    else if (tmp < 0.6) {
        return "#00f";
    }
    else if (tmp < 0.8) {
        return "#f0f";
    }
    else {
        return "#ff0";
    }
};
var midX = Math.floor(1000);
var n = 300;
var r = 2;
var y = 120;
var cnt = 0;
window.onload = function () {
    setTimeout(function () {
        console.log("Start");
        var canvas = new Canvas_1.default();
        var i = 400;
        var parts1 = (new Array(n)).fill(0).map(function (p, i) {
            return new Particle_1.default(10, new Vector_1.default(getX(i, n, r, midX), getY(i, n, r, y)), new Vector_1.default(0, 1000), new Vector_1.default(0, 1100));
        });
        var parts2 = (new Array(n)).fill(0).map(function (p) {
            return new Particle_1.default(10, new Vector_1.default(i, 1000 + i), new Vector_1.default(220 - (i -= 10), 1));
        });
        intervalPtr1 = setInterval(function () {
            game(canvas, parts2);
            fireWorks(canvas, parts1);
        }, t);
    }, 2000);
};
var explode = false;
var didExplode = false;
var applyEx = function (p, midY) {
    var phi = Math.atan2(p.position.y - midY, p.position.x - midX);
    p.velocity.x = 100 * Math.cos(phi) + Math.random() * 100 + Number(Math.random() > 0.6) * 100;
    p.velocity.y = 100 * Math.sin(phi) + Math.random() * 100 + Number(Math.random() > 0.6) * 100;
    p.acceleration.x = 0;
    p.acceleration.y /= 1.3;
};
var G = (new Vector_1.default(0, -1000)).mul(10);
var fireWorks = function (canvas, particles) {
    ++cnt;
    // canvas.clear();
    var mid = particles.reduce(function (acc, curr) {
        return acc + curr.position.y;
    }, 0) / n;
    for (var i = 0; i < particles.length; ++i) {
        if (intervalPtr1 !== null && particles[i].position.y <= 100) {
            console.log("End", cnt);
            clearInterval(intervalPtr1);
        }
        if (!didExplode && particles[i].position.y >= 1000) {
            explode = true;
            didExplode = true;
        }
        if (explode) {
            applyEx(particles[i], mid);
        }
        particles[i].integrate(t / 1000, G);
        canvas.drawPoint({
            x: particles[i].position.x,
            y: particles[i].position.y
        }, {
            fillStyle: didExplode ? getRandomColor() : undefined,
            radius: 2
        });
    }
    if (explode) {
        explode = false;
    }
};
var game = function (canvas, particles) {
    canvas.clear();
    canvas.drawPoint({ x: 500, y: 500 }, { radius: 10, fillStyle: "#f00" });
    for (var i = 0; i < particles.length; ++i) {
        particles[i].integrate(t / 1000, G);
        canvas.drawPoint({
            x: particles[i].position.x,
            y: particles[i].position.y
        });
        // console.log({
        // 	x: particles[i].velocity.x,
        // 	y: particles[i].velocity.y
        // })
        if (particles[i].position.x >= canvas.canvas.width - 100 && intervalPtr2 !== null) {
            console.log("End");
            clearInterval(intervalPtr2);
        }
    }
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
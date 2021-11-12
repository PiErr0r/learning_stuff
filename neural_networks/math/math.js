const { M, V } = require("../math_data");
const { isV, isM, isA } = require('./is');
const { MIN, MAX } = require('./constants');

module.exports = (() => ({
	// TODO: error handling
	dot: function (a, b) {
		if (isV(a) || isM(a))
		return a.dot(b);
	},

	// TODO: write better randomization algorithm that one JS uses, it is too deterministic
	randn: function(a, b) {
		return this.zeros(a, b, () => (Math.random() -0.5) * 2)
	},

	ones: function(a, b) {
		return this.zeros(a, b, () => 1);
	},

	eye: function(a) {
		return this.zeros(a, a, (_, j, i) => i === j ? 1 : 0);
	},

	zeros: function(a, b = 0, fn = (n) => n) {
		if (b === 0) b = a;
		return a > 1 && b > 1
			? new M(a, b).apply(fn)
			: new V(Math.max(a, b)).apply(fn);
	},

	linspace: function(start, end, num = 50) {
		const dx = (end - start) / num;
		return new V(new Array(num).fill(0).map((_, i) => start + dx * i));
	},

	range: function (start, end) {
		return new V(new Array(end - start).fill(0).map((_, i) => start + i));
	},

	sum: function(m) {
		if (isV(m) || isM(m))
			return m.sum();
		else if (isA(m))
			return (new V(m)).sum();
		else
			throw new Error("Not container")
	},

	max: function(m, axis = null) {
		if (isV(m) || isM(m)) 
			return m.max();
		else if (isA(m))
			return Math.max(...m);
		else
			throw new Error("Not container")
	},

	clip: function(m) {
		return new (isV(m) ? V : isM(m) ? M : null)
			(m.apply((n) => Math.max(n, MIN)).apply((n) => Math.min(n, MAX)));
	},

	mean: function(m) {
		if (isV(m) || isM(m)) {
			return m.mean();
		} else if (isA(m)) {
			return this.sum(m) / m.length;
		} else {
			throw new Error("Not container")
		}
	},

	log: function(m) {
		if (isV(m) || isM(m)) {
			return m.apply(Math.log)
		} else if (isA(m)) {
			return m.map(Math.log);
		} else {
			throw new Error("Not container");
		}
	}

}))();
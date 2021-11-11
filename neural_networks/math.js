const { M, V } = require("./math_data");

function isVector(v) {
	return Array.isArray(v) && v.length && !Array.isArray(v[0]);
}

function logName(name) {
	console.error(`[ERROR] ${name}.`);
}

function IsVectorException(txt, val) {
	logName(arguments.callee.name);
	throw new Error(`dot(a, b): ${txt} is not a vector! ${txt} = ${val}`);
}

function VectorLengthException(a, b) {
	logName(arguments.callee.name);
	throw new Error(`dot(a, b): length of a (${a.length}) doesn't match length of b (${b.length})`);
}



module.exports = (() => ({
	// TODO: error handling
	dot: function (a, b) {
		return a.dot(b);
	},

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
		return a > 1 && b > 1
			? new M(new Array(a).fill(0).map((r, i) => new Array(b).fill(0).map((c, j) => fn(c, j, i))))
			: new V(new Array(Math.max(a, b)).fill(0).map(fn));
	},

	linspace(start, end, num = 50) {
		const dx = (end - start) / num;
		return new V(new Array(num).fill(0).map((_, i) => start + dx * i));
	},

	range(start, end) {
		return new V(new Array(end - start).fill(0).map((_, i) => start + i));
	}

}))();
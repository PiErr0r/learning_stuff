const { M, V } = require("./math_data");
const math = require("./math");

module.exports = (() => ({
	spiralData: function(points, classes) {
		const X = math.zeros(points * classes, 2);
		const Y = math.zeros(points * classes);
		console.log(X.dim())
		for (let i = 0; i < classes; ++ i) {
			const ix = math.range(points * i, points * (i + 1));
			const r = math.linspace(0, 1, points);
			const t = math.linspace(i * 4, (i + 1) * 4, points).add(math.randn(points).dot(0.2));
			for (let j = points * i; j < points * (i + 1); ++j) {
				const ix = j - points * i;
				X.d[j][0] = r.d[ix] * Math.sin(t.d[ix] * 2.5);
				X.d[j][1] = r.d[ix] * Math.cos(t.d[ix] * 2.5);
				Y.d[j] = i;
			}
		}
		return [X, Y];
	}
}))();
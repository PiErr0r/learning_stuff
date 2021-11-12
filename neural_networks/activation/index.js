const { V, M } = require('../math_data');
const math = require('../math');

const isV = (a) => (a instanceof V);
const isM = (a) => (a instanceof M);

const _step = (x) => x > 0 ? 1 : 0;
const _ReLU = (x) => x > 0 ? x : 0;
const _sigm = (x) => (1 / (1 + Math.exp(-x)));

module.exports = (() => ({
	step: (x) => isV(x) || isM(x) ? x.apply(_step) : _step(x),
	ReLU: (x) => isV(x) || isM(x) ? x.apply(_ReLU) : _ReLU(x),
	sigmoid: (x) => isV(x) || isM(x) ? x.apply(_sigm) : _sigm(x),
	softMax: (x) => {
		if (isV(x)) {
			const mx = math.max(x);
			x = x.apply((n) => n - mx);
			const E = x.apply(Math.exp);
			const s = E.sum();
			return E.apply((n) => n / s);

		} else if (isM(x)) {
			const mx = x.max(1);
			x = x.add(mx.neg());
			const E = x.apply(Math.exp);
			const s = E.sum(1);
			return E.apply((n, i) => n / s[i]);
			
		} else {
			// TODO: better error handling
			throw new Error("No container")
		}
	}
}))();
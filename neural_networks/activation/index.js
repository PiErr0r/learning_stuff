const { V, M } = require('../math_data');
const { isV, isM } = require('../math');

const __delta = (x) => x === 0 ? Infinity : 0;
const __ddelta = (x) => 0;
const _delta = (x) => isV(x) || isM(x) ? x.apply(__delta) : __delta(x);
_delta.d = (x) => isV(x) || isM(x) ? x.apply(__ddelta) : __ddelta(x);

const __step = (x) => x > 0 ? 1 : 0;
const _step = (x) => isV(x) || isM(x) ? x.apply(__step) : __step(x);
_step.d = _delta;

const __ReLU = (x) => x > 0 ? x : 0;
const _ReLU = (x) => isV(x) || isM(x) ? x.apply(__ReLU) : __ReLU(x)
_ReLU.d = _step;

const __sigm = (x) => (1 / (1 + Math.exp(-x)));
const __dsigm = (x) => (-Math.exp(-x) / (1 + Math.exp(-x)) ** 2);
const _sigm = (x) => isV(x) || isM(x) ? x.apply(__sigm) : __sigm(x);
_sigm.d = (x) => isV(x) || isM(x) ? x.apply(__dsigm) : __dsigm(x);

const _softmax = (x) => {
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
_softmax.d = () => {};

module.exports = (() => ({
	step: _step,
	ReLU: _ReLU,
	sigmoid: _sigm,
	softMax: _softmax,
}))();
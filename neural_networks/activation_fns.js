module.exports = (() => ({
	step: (x) => x > 0 ? 1 : 0,
	rectLin: (x) => x > 0 ? x : 0,
	sigmoid: (x) => (1 / (1 + Math.exp(-x))),
}))();
const { M, V } = require("../math_data");

module.exports = {
	isV: (v) => v instanceof V,
	isM: (m) => m instanceof M,
	isA: (a) => Array.isArray(a),
};

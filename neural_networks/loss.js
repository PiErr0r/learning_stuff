const math = require("./math");

class Loss {
	calculate(output, y) {
		const losses = this.forward(output, y);
		return math.mean(losses);
	}
}

class CategoricalCrossEntropy extends Loss {
	// constructor(yPred, yTrue) {
	// 	super(yPred, yTrue);
	// }
	forward(yPred, yTrue) {
		const clipped = math.clip(yPred);
		let conf;
		if (math.isV(yTrue)) {
			conf = clipped.index(yTrue);
		} else if (math.isM(yTrue)) {
			conf = clipped.dot(yTrue, true).sum(1);
		} else {
			// TODO
			throw new Error("MAKE GOOD ERRORS");
		}

		return math.log(conf).neg();
	}
}

module.exports.Loss = {
	CategoricalCrossEntropy
}
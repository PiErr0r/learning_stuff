const math = require("../math");
const { M, V } = require("../math_data");

class Dense {
	#biases = [];
	#weights = [];
	output = [];
	constructor(nInputs, nNeurons) {
		this.#weights = math.randn(nInputs, nNeurons);
		this.#biases = math.zeros(1, nNeurons);
	}

	set biases(b) {
		// TODO some checks
		this.#biases = b;
	}

	forward(inputs) {
		this.output = inputs.dot(this.#weights).add(this.#biases);
	}
}

module.exports = {
	Dense
}
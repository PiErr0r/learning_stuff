const math = require("../math");
const { M, V } = require("../math_data");

class Layer {
	weights = [];
	biases = [];
	output = [];
	constructor(nInputs, nNeurons) {
		this.weights = math.randn(nInputs, nNeurons);
		this.biases = math.zeros(1, nNeurons);
	}

	forward(inputs) {
		this.output = inputs.dot(this.weights).add(this.biases);
	}
}

module.exports = {
	Layer
}
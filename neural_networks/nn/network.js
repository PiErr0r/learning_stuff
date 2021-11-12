const { V } = require('../math_data');
const fns = require('../activation');
const { Layer } = require('./')

class Network {
	layers = [];
	activations = [];
	output = [];
	constructor(layerDefs) {
		layerDefs.forEach(ld => {
			this.layers.push(new Layer[ ld.layer ](ld.inputs, ld.neurons));
			this.activations.push(fns[ ld.activation ])
		});
	}

	calculate(inputs) {
		let newInputs = inputs;
		for (let i = 0; i < this.layers.length; ++i) {
			this.layers[i].forward(newInputs);
			const out = this.activations[i]( this.layers[i].output );
			newInputs = out;
		}
		this.output = newInputs;
	}
}

module.exports = { 
	Network 
}
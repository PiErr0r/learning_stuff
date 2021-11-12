const { M, V } = require("./math_data");
const math = require('./math');
const { Layer, Network } = require("./nn");
const D = require('./data');
const fns = require('./activation');
const { Loss } = require('./loss');
const { accuracy } = require('./accuracy');

const X = new M([
	[1, 2, 3, 2.5],
	[2, 5, -1, 2],
	[-1.5, 2.7, 3.3, -0.8]
]);

const Y = new M([
	[.7, .1, .2],
	[.1, .5, .4],
	[.02, .9, .08]
]);

const main = () => {
	const lds = [
		{ layer: "Dense", activation: "softMax", inputs: 2, neurons: 3 },
		{ layer: "Dense", activation: "softMax", inputs: 3, neurons: 3 },
	];
	const [X, Y] = D.spiralData(100, 3);
	const L = new Loss.CategoricalCrossEntropy();
	for (let i = 0; i<5; ++i) {
		const NN = new Network(lds);
		NN.calculate(X);
		const accy = accuracy(NN.output, Y);
		console.log("accy: ", (accy * 100).toFixed(4) + "%");
		console.log("loss: ", L.calculate(NN.output, Y).toFixed(4));
		// console.log(predictions.slice(290), Y.slice(290))
	}
}

const main6 = () => {
	const yt = new V([0, 1, 1]);
	const yt2 = new M([[1,0,0],[0,1,0],[0,1,0]]);
	const L = new Loss.CategoricalCrossEntropy();
	console.log(L.calculate(Y, yt))
	console.log(L.calculate(Y, yt2))
}

const main5 = () => {
	const [X, Y] = D.spiralData(100, 3);
	const layer1 = new Layer.Dense(2, 3);
	const layer2 = new Layer.Dense(3, 3);
	layer1.forward(X);
	layer2.forward(fns.softMax(layer1.output));
	const out = fns.softMax(layer2.output.slice(0, 5));
	const L = new Loss.CategoricalCrossEntropy();
	// console.log(out.dim(), Y.dim(), Y)
	console.log(L.calculate(out, Y))
}

const main4 = () => {
	const out = new M([
		[4.8, 1.21, 2.385],
		[8.9, -1.81, 0.2],
		[1.41, 1.051, 0.026]
	]);
	console.log(fns.softMax(out), fns.softMax(out).sum());
}

const main3 = () => {
	const [X, Y] = D.spiralData(100, 3);

	// // console.log('!!',X)
	const layer1 = new Layer.Dense(X[0].length, 5);
	const layer2 = new Layer.Dense(5, 2);

	layer1.forward(X);
	// console.log(layer1.output)


	layer2.forward(layer1.output.apply(fns.rectLin))
	console.log(layer2.output)
}



const main2 = () => {
	const weights = new M([
		[0.2, 0.8, -0.5, 1], 
		[0.5, -0.91, 0.26, -0.5], 
		[-0.26, -0.27, 0.17, 0.87]
	]);

	const biases = new V([2, 3, 0.5]);

	const w2 = new M([
		[0.1, -0.14, .5],
		[-.5, .12, -.33],
		[-.44, .73, -.13]
	]);

	const biases2 = new V([-1, 2, -.5]);

	const layer_out = inputs.dot(weights.T()).add(biases);

	// console.log(layer_out.dot(w2.T()).add(biases2))
	console.log(math.eye(5))
}

main();
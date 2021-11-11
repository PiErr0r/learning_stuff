const { M, V } = require("./math_data");
const math = require('./math');
const { Layer } = require("./nn");
const D = require('./data');
const fns = require('./activation_fns');

// const X = new M([
// 	[1, 2, 3, 2.5],
// 	[2, 5, -1, 2],
// 	[-1.5, 2.7, 3.3, -0.8]
// ]);

const [X, Y] = D.spiralData(100, 3);

// console.log('!!',X)
const layer1 = new Layer(X.d[0].length, 5);
const layer2 = new Layer(5, 2);

layer1.forward(X);
// console.log(layer1.output)

console.log(layer1.output.apply(fns.rectLin))

// layer2.forward(layer1.output)
// console.log(layer2.output)


/*
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
*/

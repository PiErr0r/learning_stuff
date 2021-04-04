/*
	Add: (+ a b)
	Sub: (- a b)
	Mul: (* a b)
	Div: (/ a b)
	Nst: (+ (* a b) (/ (- c d) e f))
*/

const {
	between,
	choice,
	digits,
	lazy,
	sequenceOf,
	str
} = require('./parser');

const numberParser = digits.map(x => ({
	type: 'number',
	value: Number(x)
}));

const operatorParser = choice([
	str('+'),
	str('-'),
	str('*'),
	str('/'),
]);

const betweenBrackets = between(str('('), str(')'));
const spaceParser = str(' ');

const expr = lazy(() => choice([
	numberParser,
	operationParser
]));

const operationParser = betweenBrackets(sequenceOf([
	operatorParser,
	spaceParser,
	expr,
	spaceParser,
	expr
])).map(results => ({
	type: 'operation',
	value: {
		op: results[0],
		a: results[2],
		b: results[4]
	}
}));

const evaluate = node => {
	if (node.type === 'number') {
		return node.value;
	} else if (node.type === 'operation') {
		switch (node.value.op) {
			case '+': return evaluate(node.value.a) + evaluate(node.value.b);
			case '-': return evaluate(node.value.a) - evaluate(node.value.b);
			case '*': return evaluate(node.value.a) * evaluate(node.value.b);
			case '/': return evaluate(node.value.a) / evaluate(node.value.b);
			default:
				throw new Error(`evaluate: Unexpected operation ${node.value.op}`);
		}
	} else {
		throw new Error(`evaluate: Unexpected node type ${node.type}`)
	}
}

const interpreter = program => {
	const parsedProgram = expr.run(program);
	if (parsedProgram.isError) {
		throw new Error(`interpreter: Invalid program`);
	}
	return evaluate(parsedProgram.result);
}

const program = '(+ (* 10 2) (- (/ 50 3) 2))';
console.log(interpreter(program))
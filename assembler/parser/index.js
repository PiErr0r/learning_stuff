const { inspect } = require('util');
const A = require('arcsecond');

const deepLog = x => console.log(inspect(x, { depth: Infinity, colors: true }));

const asType = type => value => ({ type, value });
const mapJoin = parser => parser.map(items => items.join(''));
const peek = A.lookAhead(A.regex(/^./));

const upperLowerStr = s => A.choice([
	A.str(s.toLowerCase()),
	A.str(s.toUpperCase()),
]);

const register = A.choice([
	upperLowerStr('r1'),
	upperLowerStr('r2'),
	upperLowerStr('r3'),
	upperLowerStr('r4'),
	upperLowerStr('r5'),
	upperLowerStr('r6'),
	upperLowerStr('r7'),
	upperLowerStr('r8'),
	upperLowerStr('sp'),
	upperLowerStr('fp'),
	upperLowerStr('ip'),
	upperLowerStr('acc'),
]).map(asType('REGISTER'));

const hexDigit = A.regex(/^[0-9a-fA-F]/);
const hexLiteral = A.char('$')
	.chain(() => mapJoin(A.many1(hexDigit)))
	.map(asType('HEX_LITERAL'));

const operator = A.choice([
	A.char('+').map(asType('OP_ADD')),
	A.char('-').map(asType('OP_SUB')),
	A.char('*').map(asType('OP_MUL')),
]);

const validIdentifier = mapJoin(A.sequenceOf([
	A.regex(/^[A-Za-z_]/),
	A.regex(/^[A-Za-z_]+/).map(x => x === null ? '' : x),
]));

const variable = A.char('!')
	.chain(() => validIdentifier)
	.map(asType('VARIABLE'));


const squareBracketExpr = A.coroutine(function* () {
	yield A.char('[');
	yield A.optionalWhitespace;

	const expr = [];
	const states = {
		EXPECT_ELEMENT: 0,
		EXPECT_OPERATOR: 1
	};

	let state = EXPECT_ELEMENT;
	while (true) {
		if (state === states.EXPECT_ELEMENT) {
			const result = A.choice([
				bracketedExpr,
				hexLiteral,
				variable
			]);
			expr.push(result);
			state = states.EXPECT_OPERATOR;
			yield A.optionalWhitespace;
		} else if (state === states.EXPECT_OPERATOR) {
			const nextChar = yield peek;
			if (nextChar === ']') {
				yield A.char(']');
				yield A.optionalWhitespace;
				break;
			}
			const result = yield operator;
			expr.push(result);
			state = states.EXPECT_ELEMENT;
			yield A.optionalWhitespace;
		}
	}

	return asType('SQUARE_BRACKET_EXPRESSION')(expr);
});

const movLitToReg = A.coroutine(function* () {
	yield upperLowerStr('mov');
	yield A.whitespace;

	const arg1 = yield A.choice([
		hexLiteral,
		squareBracketExpr
	]);

	yield A.optionalWhitespace;
	yield A.char(',');
	yield A.optionalWhitespace;

	const arg2 = yield register;
	yield A.optionalWhitespace;

	return asType('INSTRUCTION') ({
		instruction: 'MOV_LIT_REG',
		args: [arg1, arg2]
	});
});

const res = movLitToReg.run('mov $42, r4');
deepLog(res);
const A = require('arcsecond');
const T = require('./types');
const { mapJoin } = require('./util');

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
]).map(T.register);

const hexDigit = A.regex(/^[0-9a-fA-F]/);
const hexLiteral = A.char('$')
	.chain(() => mapJoin(A.many1(hexDigit)))
	.map(T.hexLiteral);

const address = A.char('&')
	.chain(() => mapJoin(A.many1(hexDigit)))
	.map(T.hexLiteral);


const validIdentifier = mapJoin(A.sequenceOf([
	A.regex(/^[A-Za-z_]/),
	A.regex(/^[A-Za-z_]+/).map(x => x === null ? '' : x),
]));

const variable = A.char('!')
	.chain(() => validIdentifier)
	.map(T.variable);

const operator = A.choice([
	A.char('+').map(T.opAdd),
	A.char('-').map(T.opSub),
	A.char('*').map(T.opMul),
]);

const peek = A.lookAhead(A.regex(/^./));

module.exports = {
	upperLowerStr,
	register,
	hexLiteral,
	address,
	validIdentifier,
	variable,
	operator,
	peek,
}
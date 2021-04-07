const A = require('arcsecond');
const T = require('./types');
const R = require('../../registers');
const { mapJoin } = require('./util');

const upperLowerStr = s => A.choice([
	A.str(s.toLowerCase()),
	A.str(s.toUpperCase()),
]);

const register = A.choice(
	R.map(r => upperLowerStr(r))
).map(T.register);

const hexDigit = A.regex(/^[0-9a-fA-F]/);
const hexLiteral = A.char('$')
	.chain(() => mapJoin(A.many1(hexDigit)))
	.map(T.hexLiteral);

const address = A.char('&')
	.chain(() => mapJoin(A.many1(hexDigit)))
	.map(T.hexLiteral);

const validIdentifier = mapJoin(A.sequenceOf([
	A.regex(/^[A-Za-z_]/),
	A.regex(/^[A-Za-z0-9_]+/).map(x => x === null ? '' : x),
]));

const variable = A.char('!')
	.chain(() => validIdentifier)
	.map(T.variable);

const label = A.sequenceOf([
	A.optionalWhitespace,
	validIdentifier,
	A.char(':'),
	A.optionalWhitespace
])
.map(([_, labelName]) => labelName)
.map(T.label);

const operator = A.choice([
	A.char('+').map(T.opAdd),
	A.char('-').map(T.opSub),
	A.char('*').map(T.opMul),
]);

const peek = A.lookAhead(A.regex(/^./));

const commaSeparated = A.sepBy(optionalWhitespaceSurrounded(A.char(',')));

module.exports = {
	upperLowerStr,
	register,
	hexLiteral,
	address,
	validIdentifier,
	variable,
	label,
	operator,
	peek,
	commaSeparated,
}
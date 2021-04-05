const { inspect } = require('util');
const A = require('arcsecond');
const T = require('./types');
const {
	hexLiteral,
	register,
	upperLowerStr,
} = require('./common');
const { squareBracketExpr } = require('./expressions');

const deepLog = x => console.log(inspect(x, { depth: Infinity, colors: true }));

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

	return T.instruction({
		instruction: 'MOV_LIT_REG',
		args: [arg1, arg2]
	});
});

const simpleExpr = 'mov $42, r4';
const complexExpr = 'mov [$42 + !loc - ($05 * ($31 + !var) - $07)], r4';

const res = movLitToReg.run(complexExpr);
deepLog(res);
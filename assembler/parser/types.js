const { asType } = require('./util');

const register = asType('REGISTER');
const hexLiteral = asType('HEX_LITERAL');
const variable = asType('VARIABLE');
const label = asType('LABEL');
const address = asType('ADDRESS');
const data = asType('DATA');
const constant = asType('CONSTANT');

const opAdd = asType('OP_ADD');
const opSub = asType('OP_SUB');
const opMul = asType('OP_MUL');

const binaryOperation = asType('BINARY_OPERATION');
const bracketedExpression = asType('BRACKETED_EXPRESSION');
const squareBracketExpression = asType('SQUARE_BRACKET_EXPRESSION');

const instruction = asType('INSTRUCTION');

module.exports = {
	register,
	hexLiteral,
	variable,
	label,
	address,
	data,
	constant,
	opAdd,
	opSub,
	opMul,
	binaryOperation,
	bracketedExpression,
	squareBracketExpression,
	instruction	,
};
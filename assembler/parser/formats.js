const A = require('arcsecond');
const T = require('./types');
const {
	hexLiteral,
	address,
	register,
	upperLowerStr,
} = require('./common');
const { squareBracketExpr } = require('./expressions');

const litReg = (mnemonic, type) => A.coroutine(function* () {
	yield upperLowerStr(mnemonic);
	yield A.whitespace;

	const literal = yield A.choice([
		hexLiteral,
		squareBracketExpr
	]);

	yield A.optionalWhitespace;
	yield A.char(',');
	yield A.optionalWhitespace;

	const r = yield register;
	yield A.optionalWhitespace;

	return T.instruction({
		instruction: type,
		args: [literal, r]
	});
});

const regReg = (mnemonic, type) => A.coroutine(function* () {
	yield upperLowerStr(mnemonic);
	yield A.whitespace;

	const r1 = yield register

	yield A.optionalWhitespace;
	yield A.char(',');
	yield A.optionalWhitespace;

	const r2 = yield register;

	yield A.optionalWhitespace;

	return T.instruction({
		instruction: type,
		args: [r1, r2]
	});
});

const regMem = (mnemonic, type) => A.coroutine(function* () {
	yield upperLowerStr(mnemonic);
	yield A.whitespace;

	const r = yield register

	yield A.optionalWhitespace;
	yield A.char(',');
	yield A.optionalWhitespace;

	const addr = yield A.choice([
		address,
		A.char('&').chain(() => squareBracketExpr)
	]);

	yield A.optionalWhitespace;

	return T.instruction({
		instruction: type,
		args: [r, addr]
	});
});

const memReg = (mnemonic, type) => A.coroutine(function* () {
	yield upperLowerStr(mnemonic);
	yield A.whitespace;

	const addr = yield A.choice([
		address,
		A.char('&').chain(() => squareBracketExpr)
	]);

	yield A.optionalWhitespace;
	yield A.char(',');
	yield A.optionalWhitespace;

	const r = yield register

	yield A.optionalWhitespace;

	return T.instruction({
		instruction: type,
		args: [addr, r]
	});
});

const litMem = (mnemonic, type) => A.coroutine(function* () {
	yield upperLowerStr(mnemonic);
	yield A.whitespace;

	const literal = yield A.choice([
		hexLiteral,
		squareBracketExpr
	]);

	yield A.optionalWhitespace;
	yield A.char(',');
	yield A.optionalWhitespace;

	const addr = yield A.choice([
		address,
		A.char('&').chain(() => squareBracketExpr)
	]);

	yield A.optionalWhitespace;

	return T.instruction({
		instruction: type,
		args: [literal, addr]
	});
});

const regPtrReg = (mnemonic, type) => A.coroutine(function* () {
	yield upperLowerStr(mnemonic);
	yield A.whitespace;

	const r1 = yield A.char('&').chain(() => register);

	yield A.optionalWhitespace;
	yield A.char(',');
	yield A.optionalWhitespace;

	const r2 = yield register;

	yield A.optionalWhitespace;

	return T.instruction({
		instruction: type,
		args: [r1, r2]
	});
});

const litOffReg = (mnemonic, type) => A.coroutine(function* () {
	yield upperLowerStr(mnemonic);
	yield A.whitespace;

	const literal = yield A.choice([
		hexLiteral,
		squareBracketExpr
	]);

	yield A.optionalWhitespace;
	yield A.char(',');
	yield A.optionalWhitespace;

	const r1 = yield A.char('&').chain(() => register);

	yield A.optionalWhitespace;
	yield A.char(',');
	yield A.optionalWhitespace;

	const r2 = yield register;
	yield A.optionalWhitespace;

	return T.instruction({
		instruction: type,
		args: [literal, r1, r2]
	});
});

const noArg = (mnemonic, type) => A.coroutine(function* () {
	yield upperLowerStr(mnemonic);
	yield A.optionalWhitespace;

	return T.instruction({
		instruction: type,
		args: []
	});
});

const singleReg = (mnemonic, type) => A.coroutine(function* () {
	yield upperLowerStr(mnemonic);
	yield A.whitespace;

	const r = yield register;
	yield A.optionalWhitespace;

	return T.instruction({
		instruction: type,
		args: [r]
	});
});

const singleLit = (mnemonic, type) => A.coroutine(function* () {
	yield upperLowerStr(mnemonic);
	yield A.whitespace;

	const literal = yield A.choice([
		hexLiteral,
		squareBracketExpr
	]);

	yield A.optionalWhitespace;

	return T.instruction({
		instruction: type,
		args: [literal]
	});
});

module.exports = {
	litReg,
	regReg,
	regMem,
	memReg,
	litMem,
	regPtrReg,
	litOffReg,
	noArg,
	singleReg,
	singleLit,
};
import { Token } from "@/token";

class CSyntaxError extends Error {
	readonly name: string = "CSyntaxError";
	constructor(message: string) {
		super(message);
	}
}

class ParseError extends Error {
	readonly name: string = "ParseError";
	constructor(message: string) {
		super(message);
	}
}

class RuntimeError extends Error {
	readonly name: string = "RuntimeError";
	op: Token;
	constructor(op: Token, message: string) {
		super(message);
		this.name = 'RuntimeError';
		this.op = op;
	}
}

export {
	CSyntaxError,
	ParseError,
	RuntimeError,
}
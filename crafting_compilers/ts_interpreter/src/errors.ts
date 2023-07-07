import { Token } from "@/token";

class ParseError extends Error {
	readonly name: string = "ParseError";
	constructor(message: string) {
		super(message);
	}
}

class RuntimeError extends Error {
	op: Token;
	constructor(op: Token, message: string) {
		super(message);
		this.name = 'RuntimeError';
		this.op = op;
	}
}

export {
	ParseError,
	RuntimeError,
}
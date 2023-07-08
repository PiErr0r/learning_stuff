import { Literal, TokenType } from "@/token_type";
import { RuntimeError } from "@/errors";
import { Token } from "@/token";

class Break extends RuntimeError {
	constructor() {
		super(new Token(TokenType.BREAK, "", null, 0), "");
	}
}

class Continue extends RuntimeError {
	constructor() {
		super(new Token(TokenType.CONTINUE, "", null, 0), "");
	}
}

class Return extends RuntimeError {
	value: Literal;
	constructor(value: Literal) {
		super(new Token(TokenType.RETURN, "", null, 0), "");
		this.value = value;
	}
}

export {
	Break,
	Continue,
	Return
};
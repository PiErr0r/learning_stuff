import { Literal, TokenType } from "@/token_type";
import { RuntimeError } from "@/errors";
import { Token } from "@/token";

class Return extends RuntimeError {
	value: Literal;
	constructor(value: Literal) {
		super(new Token(TokenType.RETURN, "", null, 0), "");
		this.value = value;
	}
}

export { Return };
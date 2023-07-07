import { Literal, Type } from "@/token_type";

class Token {
	type: Type;
	lexeme: string;
	literal: Literal;
	line: number;
	constructor(type: Type, lexeme: string, literal: Literal, line: number) {
		this.type = type;
		this.lexeme = lexeme;
		this.literal = literal;
		this.line = line;
	}

	toString() {
		return `${this.type} ${this.lexeme} ${this.literal}`;
	}
}


export { Token };
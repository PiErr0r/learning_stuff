import { Literal } from "@/token_type";
import { Token } from "@/token";
import { RuntimeError } from "@/errors";

interface Values {
	[name: string]: Literal
}

class Environment {
	values: Values = {};
	enclosing: Environment | null;

	constructor(enclosing?: Environment) {
		if (!enclosing) {
			this.enclosing = null;
		} else {
			this.enclosing = enclosing;
		}
	}

	define(name: string, value: Literal) {
		this.values[name] = value;
	}

	get(name: Token): Literal | never {
		if (name.lexeme in this.values) {
			return this.values[name.lexeme];
		}

		if (this.enclosing !== null) {
			return this.enclosing.get(name);
		}

		throw new RuntimeError(name, `Undefined variable ${name.lexeme}.`);
	}

	assign(name: Token, value: Literal): void | never {
		if (name.lexeme in this.values) {
			this.values[name.lexeme] = value;
			return;
		}

		if (this.enclosing !== null) {
			this.enclosing.assign(name, value);
			return;
		}

		throw new RuntimeError(name, `Undefined variable ${name.lexeme}.`);
	}
}

export { Environment };
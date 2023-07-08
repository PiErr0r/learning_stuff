import { Literal } from "@/token_type";
import { Token } from "@/token";
import { RuntimeError } from "@/errors";

interface Values {
	[name: string]: Literal | undefined;
}

class Environment {
	private values: Values = {};
	private enclosing: Environment | null;

	constructor(enclosing?: Environment) {
		if (!enclosing) {
			this.enclosing = null;
		} else {
			this.enclosing = enclosing;
		}
	}

	define(name: string, value: Literal, isInitialized: boolean) {
		this.values[name] = isInitialized ? value : undefined;
	}

	get(name: Token): Literal | never {
		if (name.lexeme in this.values) {
			if (this.values[name.lexeme] === undefined) {
				throw new RuntimeError(name, `Uninitialized variable ${name.lexeme}`);
			}
			return this.values[name.lexeme] as Literal;
		}

		if (this.enclosing !== null) {
			return this.enclosing.get(name);
		}

		throw new RuntimeError(name, `Undefined variable ${name.lexeme}.`);
	}

	getAt(distance: number, name: Token) {
		return this.ancestor(distance).get(name);
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

	assignAt(distance: number, name: Token, value: Literal) {
		this.ancestor(distance).assign(name, value);
	}

	ancestor(distance: number): Environment {
		let env: Environment | null = this as Environment;
		for (let i = 0; i < distance; ++i) {
				if (env)
			env = env.enclosing;
		}
		if (env === null) 
			throw new Error("Undefined ancestor");
		return env;
	}
}

export { Environment };
import { Environment } from "@/environment";
import { Interpreter } from "@/interpreter";
import { Literal } from "@/token_type";
import { Return } from "@/return";
import { StmtFunction } from "@/ast/Stmt";

interface LoxCallable {
	readonly discriminator: 'LoxCallable';
	arity: () => number;
	call: (interpreter: Interpreter, args: Literal[]) => Literal;
}

class LoxFunction implements LoxCallable {
	readonly discriminator = "LoxCallable";
	private declaration: StmtFunction;
	private closure: Environment;
	constructor(declaration: StmtFunction, closure: Environment) {
		this.declaration = declaration;
		this.closure = closure;
	}

	arity(): number {
		return this.declaration.params.length;
	}

	call(interpreter: Interpreter, args: Literal[]) {
		const environment = new Environment(this.closure);
		this.declaration.params.forEach((param, i) => {
			environment.define(param.lexeme, args[i], true);
		});
		try {
			interpreter.executeBlock(this.declaration.body, environment);
		} catch (err) {
			if (err instanceof Return) {
				return (err as Return).value;
			}
			throw new Error(`Uncaught exception ${err as string}`);
		}
		return null;
	}

	toString() { return `<fn ${this.declaration.name.lexeme}>` }
}

function instanceofLoxCallable(obj: any): obj is LoxCallable {
	return obj.discriminator === "LoxCallable";
}

export {
	LoxCallable,
	LoxFunction,
	instanceofLoxCallable
};
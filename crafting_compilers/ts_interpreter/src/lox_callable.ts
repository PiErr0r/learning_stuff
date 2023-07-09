import { Environment } from "@/environment";
import { Interpreter } from "@/interpreter";
import { Literal } from "@/token_type";
import { Return } from "@/exits";
import { RuntimeError } from "@/errors";
import { StmtFunction } from "@/ast/Stmt";
import { Token } from "@/token";
import { TokenType } from "@/token_type";

interface LoxCallable {
	readonly discriminator: 'LoxCallable';
	arity: () => number;
	call: (interpreter: Interpreter, args: Literal[]) => Literal;
}

const thisToken = new Token(TokenType.IDENTIFIER, 'this', null, 0);

class LoxFunction implements LoxCallable {
	readonly discriminator = "LoxCallable";
	private declaration: StmtFunction;
	private closure: Environment;
	private isInitializer: boolean
	constructor(declaration: StmtFunction, closure: Environment, isInitializer: boolean) {
		this.declaration = declaration;
		this.closure = closure;
		this.isInitializer = isInitializer;
	}

	arity(): number {
		return this.declaration.params.length;
	}

	// use _bind instead of bind to avoid collision with built-in bind
	_bind(instance: LoxInstance): LoxFunction {
		const env = new Environment(this.closure);
		env.define("this", instance, true);
		return new LoxFunction(this.declaration, env, this.isInitializer);
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
				if (this.isInitializer) return this.closure.getAt(0, thisToken);
				return (err as Return).value;
			}
			throw err;
		}
		if (this.isInitializer) {
			return this.closure.getAt(0, thisToken);
		}
		return null;
	}

	toString() { return `<fn ${this.declaration.name.lexeme}>` }
}

class LoxInstance {
	private cls: LoxClass;
	private fields: Map<string, Literal> = new Map();
	constructor(cls: LoxClass) {
		this.cls = cls;
	}

	get(name: Token): Literal | never {
		if (this.fields.has(name.lexeme)) {
			return this.fields.get(name.lexeme)!;
		}
		const method = this.cls.findMethod(name.lexeme);
		if (method !== null) {
			return method._bind(this);
		}
		throw new RuntimeError(name, `Undefined property '${name.lexeme}.'`);
	}

	set(name: Token, value: Literal): void {
		this.fields.set(name.lexeme, value);
	}

	toString(): string {
		return `${this.cls.name} instance`;
	}
}

class LoxClass implements LoxCallable {
	readonly discriminator = "LoxCallable";
	private methods: Map<string, LoxFunction>;
	name: string;
	constructor(name: string, methods: Map<string, LoxFunction>) {
		this.name = name;
		this.methods = methods;
	}

	arity(): number {
		const initializer = this.findMethod('init');
		if (initializer === null) return 0;
		return initializer.arity();
	}

	call(interpreter: Interpreter, args: Literal[]): LoxInstance {
		const instance = new LoxInstance(this);
		const initializer = this.findMethod('init');
		if (initializer !== null) {
			initializer._bind(instance).call(interpreter, args);
		}
		return instance;
	}

	findMethod(name: string): LoxFunction | null {
		if (!this.methods.has(name)) return null;
		return this.methods.get(name)!;
	}

	toString(): string {
		return this.name;
	}
}

function instanceofLoxCallable(obj: any): obj is LoxCallable {
	return obj.discriminator === "LoxCallable";
}

export {
	LoxCallable,
	LoxClass,
	LoxFunction,
	LoxInstance,
	instanceofLoxCallable
};
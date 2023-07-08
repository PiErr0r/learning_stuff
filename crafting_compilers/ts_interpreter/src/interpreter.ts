import {
  Expr
, ExprError
, ExprVisitor
, ExprAssign
, ExprBinary
, ExprCall
, ExprGrouping
, ExprLambda
, ExprLiteral
, ExprLogical
, ExprTernary
, ExprUnary
, ExprVariable
} from '@/ast/Expr';
import {
  Stmt
, StmtError
, StmtVisitor
, StmtBlock
, StmtBreak
, StmtContinue
, StmtIf
, StmtExpression
, StmtFunction
, StmtPrint
, StmtReturn
, StmtVar
, StmtWhile
} from '@/ast/Stmt';
import { LoxCallable, LoxFunction, instanceofLoxCallable } from "@/lox_callable";
import { Literal, TokenType } from '@/token_type';
import { Token } from '@/token';
import { Environment } from '@/environment';
import { Break, Continue, Return } from "@/exits";
import { RuntimeError } from '@/errors';
import { randomString } from "@/helpers";

class Interpreter implements ExprVisitor<Literal>, StmtVisitor<void> {
	globals = new Environment();
	private environment = this.globals;
	private REPL = false;
	private inStmt = 0;

	constructor() {
		this.globals.define('clock', new class implements LoxCallable {
			readonly discriminator = "LoxCallable";
			arity() { return 0; }
			call(interpreter: Interpreter, args: Literal[]): number {
				return Date.now() / 1000;
			}
			toString() { return "<native fn>"; }
		}(), true);
	}
	
	interpret(statements: Stmt[]) {
		try {
			statements.forEach(statement => {
				this.execute(statement);
			});
		} catch (err) {
			if (err instanceof RuntimeError) {
				const { JLOX } = require('./jlox');
				const message = "Can only add numbers or strings!";
				JLOX.runtimeError(err.op, err.message);
				this.inStmt = 0;
			}
			// Unknown error -> Exit
			// throw new Error(err as string);
		}
	}

	setREPL(value: boolean) {
		this.REPL = true;
	}

	visitErrorStmt(statement: StmtError) {}
	visitBreakStmt(statement: StmtBreak) {
		throw new Break();
	}
	visitContinueStmt(statement: StmtContinue) {
		throw new Continue();
	}

	visitBlockStmt(statement: StmtBlock) {
		++this.inStmt;
		this.executeBlock(statement.statements, new Environment(this.environment));
		--this.inStmt;
	}

	visitExpressionStmt(statement: StmtExpression) {
		++this.inStmt;
		const value = this.evaluate(statement.expression)
		--this.inStmt;
		if (this.REPL && this.inStmt === 0 && !(statement.expression instanceof ExprAssign)) {
			process.stdout.write(`${value}\n`);
		}
	}

	visitFunctionStmt(statement: StmtFunction) {
		++this.inStmt;
		const fn = new LoxFunction(statement, this.environment);
		this.environment.define(statement.name.lexeme, fn, true);
		--this.inStmt;
	}

	visitIfStmt(statement: StmtIf) {
		++this.inStmt;
		if (this.isTruthy(this.evaluate(statement.condition))) {
			this.execute(statement.thenBranch);
		} else if (statement.elseBranch !== null) {
			this.execute(statement.elseBranch);
		}
		--this.inStmt;
	}

	visitPrintStmt(statement: StmtPrint) {
		++this.inStmt;
		const value = this.evaluate(statement.expression);
		process.stdout.write(this.stringify(value));
		process.stdout.write("\n");
		--this.inStmt;
	}

	visitReturnStmt(statement: StmtReturn) {
		++this.inStmt;
		const value = statement.value !== null
			? this.evaluate(statement.value)
			: null;
		throw new Return(value);
		--this.inStmt;
	}

	visitVarStmt(statement: StmtVar) {
		++this.inStmt;
		const value = this.evaluate(statement.initializer);
		this.environment.define(statement.name.lexeme, value, statement.isInitialized);
		--this.inStmt;
	}

	visitWhileStmt(statement: StmtWhile) {
		++this.inStmt;
		while (this.isTruthy(this.evaluate(statement.condition))) {
			try {
				this.execute(statement.body);
			} catch (err) {
				if (err instanceof Break) {
					break;
				}
				if (err instanceof Continue) {
					if (statement.isFor)
						this.execute((statement.body as StmtBlock).statements[1]);
					continue;
				}
				throw err;
			}
		}
		--this.inStmt;
	}

	visitErrorExpr(expr: ExprError): Literal {
		return null;
	}

	visitAssignExpr(expr: ExprAssign): Literal {
		const value = this.evaluate(expr.value);
		this.environment.assign(expr.name, value);
		return value;
	}


	visitBinaryExpr(expr: ExprBinary): Literal | never {
		const left = this.evaluate(expr.left);
		const right = this.evaluate(expr.right);

		switch (expr.operator.type) {
			case TokenType.GREATER:
				if (typeof left === 'string' && typeof right === 'string') {
					return left > right;	
				}
				return this.double(left, expr) > this.double(right, expr);
			case TokenType.GREATER_EQUAL:
				if (typeof left === 'string' && typeof right === 'string') {
					return left >= right;	
				}
				return this.double(left, expr) >= this.double(right, expr);
			case TokenType.LESS:
				if (typeof left === 'string' && typeof right === 'string') {
					return left < right;	
				}
				return this.double(left, expr) < this.double(right, expr);
			case TokenType.LESS_EQUAL:
				if (typeof left === 'string' && typeof right === 'string') {
					return left <= right;	
				}
				return this.double(left, expr) <= this.double(right, expr);
			case TokenType.SLASH: 
				const r = this.double(right, expr);
				if (r === 0) {
					throw new RuntimeError(expr.operator, "Right operand can't be 0!");
				}
				return this.double(left, expr) / r;
			case TokenType.STAR: 
				return this.double(left, expr) * this.double(right, expr);
			case TokenType.MINUS: 
				return this.double(left, expr) - this.double(right, expr);
			case TokenType.BANG_EQUAL:
				return !this.isEqual(left, right);
			case TokenType.EQUAL_EQUAL:
				return this.isEqual(left, right);
			case TokenType.PLUS: {
				if (typeof left === 'string' && typeof right === 'string') {
					return left + right;
				}
				if (typeof left === 'number' && typeof right === 'number') {
					return left + right;
				}
				if (typeof left === 'number' && typeof right === 'string') {
					return left.toString() + right;
				}
				if (typeof left === 'string' && typeof right === 'number') {
					return left + right.toString();	
				}
				throw new RuntimeError(expr.operator, "Operands must be either numbers or strings or combination.");
			}
		}
		return null;
	}

	visitCallExpr(expr: ExprCall): Literal {
		const callee = this.evaluate(expr.callee);
		const args = expr.args.map(arg => this.evaluate(arg));

		if (!instanceofLoxCallable(callee)) {
			throw new RuntimeError(expr.paren, "Can only call functions and classes.");
		}

		const fn = callee as LoxCallable;
		if (args.length !== fn.arity()) {
			throw new RuntimeError(expr.paren, `Expected ${fn.arity()} arguments but got ${args.length}.`);
		}
		return fn.call(this, args);
	}

	visitGroupingExpr(expr: ExprGrouping): Literal {
		return this.evaluate(expr.expression);
	}

	visitLambdaExpr(expr: ExprLambda): Literal {
		const name = randomString(10);
		const fn = new LoxFunction(
			new StmtFunction(
				new Token(TokenType.IDENTIFIER, name, null, 0),
				expr.params,
				expr.body
			),
			this.environment
		);
		this.environment.define(name, fn, true);
		return fn;
	}

	visitLiteralExpr(expr: ExprLiteral): Literal {
		return expr.value;
	}

	visitLogicalExpr(expr: ExprLogical): Literal {
		const left = this.evaluate(expr.left);
		if (expr.operator.type === TokenType.OR) {
			if (this.isTruthy(left)) return left;
		} else {
			if (!this.isTruthy(left)) return left;
		}
		return this.evaluate(expr.right);
	}

	visitTernaryExpr(expr: ExprTernary): Literal {
		const condition = this.evaluate(expr.condition);
		if (this.isTruthy(condition)) {
			return this.evaluate(expr.resTrue);
		} else {
			return this.evaluate(expr.resFalse)
		}
	}

	visitUnaryExpr(expr: ExprUnary): Literal {
		const right = this.evaluate(expr.right);

		switch (expr.operator.type) {
			case TokenType.BANG: return !this.isTruthy(right);
			case TokenType.MINUS: return -this.double(right, expr);
		}
		// Unreachable!
		return null;
	}

	visitVariableExpr(expr: ExprVariable): Literal {
		return this.environment.get(expr.name);
	}

	execute(statement: Stmt) {
		statement.accept(this);
	}

	 executeBlock(statements: Stmt[], environment: Environment) {
		const previous = this.environment;
		try {
			this.environment = environment;
			statements.forEach((stmt, i) => {
				this.execute(stmt);
			});
		} finally {
			this.environment = previous;
		}
	}

	 evaluate(expr: Expr): Literal {
		return expr.accept(this);
	}

	private double(n: Literal, expr: ExprBinary | ExprUnary): number {
		if (!this.isNumeric(n)) {
			throw new RuntimeError(expr.operator, "Operand must be a number!");
		}
		return parseFloat(n as string);
	}

	private isEqual(a: Literal, b: Literal): boolean {
		if (a === null && b === null) return true;
		if (a === null) return false;
		return a === b;
	}

	private isNumeric(value: Literal): boolean {
		if (value === null) return false;
        return /^-?\d+(\.\d+)?$/.test(value as string);
	}

	private isTruthy(obj: Literal ): boolean {
		if (obj === null) return false;
		if (typeof obj === 'boolean') return obj;
		return true;
	}

	private stringify(value: Literal): string {
		if (value === null) return 'nil';
		return value.toString();
	}
}

export { Interpreter };
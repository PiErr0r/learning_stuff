import {
  Expr
, ExprError
, ExprVisitor
, ExprTernary
, ExprBinary
, ExprGrouping
, ExprLiteral
, ExprUnary
} from '@/ast/Expr';
import { Literal, TokenType } from '@/token_type';
import { Token } from '@/token';

class RuntimeError extends Error {
	op: Token;
	constructor(op: Token, message: string) {
		super(message);
		this.name = 'RuntimeError';
		this.op = op;
	}
}

class Interpreter implements ExprVisitor {
	interpret(expr: Expr) {
		try {
			const value = this.evaluate(expr);
			process.stdout.write(this.stringify(value));
		} catch (err) {
			if (err instanceof RuntimeError) {
				const { JLOX } = require('./jlox');
				const message = "Can only add numbers or strings!";
				JLOX.runtimeError(err.op, err.message);
				return null;
			}
			// Unknown error -> Exit
			throw new Error(err as string);
		}
	}

	visitLiteralExpr(expr: ExprLiteral): Literal {
		return expr.value;
	}

	visitGroupingExpr(expr: ExprGrouping): Literal {
		return this.evaluate(expr.expression);
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

	visitBinaryExpr(expr: ExprBinary): Literal {
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

	visitTernaryExpr(expr: ExprTernary): Literal {
		const condition = this.evaluate(expr.condition);
		if (this.isTruthy(condition)) {
			return this.evaluate(expr.resTrue);
		} else {
			return this.evaluate(expr.resFalse)
		}
	}

	isTruthy(obj: Literal ): boolean {
		if (obj === null) return false;
		if (typeof obj === 'boolean') return obj;
		return true;
	}

	isEqual(a: Literal, b: Literal): boolean {
		if (a === null && b === null) return true;
		if (a === null) return false;
		return a === b;
	}

	evaluate(expr: Expr): Literal {
		return expr.accept(this);
	}

	double(n: Literal, expr: ExprBinary | ExprUnary): number {
		if (!this.isNumeric(n)) {
			throw new RuntimeError(expr.operator, "Operand must be a number!");
		}
		return parseFloat(n as string);
	}

	isNumeric(value: Literal): boolean {
		if (value === null) return false;
        return /^-?\d+(\.\d+)?$/.test(value as string);
	}

	stringify(value: Literal): string {
		if (value === null) return 'nil';
		return value.toString();
	}
}

export { Interpreter };
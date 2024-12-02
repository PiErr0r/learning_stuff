const Expr = require('./ast/Expr');
const { TokenType } = require('./token_type');

class RuntimeError extends Error {
	constructor(op, message) {
		super(message);
		this.name = 'RuntimeError';
		this.op = op;
	}
}

class Interpreter extends Expr.ExprVisitor {
	interpret(expr) {
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
			throw new Error(err);
		}
	}

	visitLiteralExpr(expr) {
		return expr.value;
	}

	visitGroupingExpr(expr) {
		return this.evaluate(expr.expression);
	}

	visitUnaryExpr(expr) {
		const right = this.evaluate(expr.right);

		switch (expr.operator.type) {
			case TokenType.BANG: return !this.isTruthy(right);
			case TokenType.MINUS: return -this.double(right, expr);
		}
		// Unreachable!
		return null;
	}

	visitBinaryExpr(expr) {
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
				if (typeof left === 'number' && typeof right === 'string' ||
					typeof left === 'string' && typeof right === 'number') {
					return left + right;
				}
				throw new RuntimeError(expr.operator, "Operands must be either numbers or strings or combination.");
			}
		}
	}

	visitTernaryExpr(expr) {
		const condition = this.evaluate(expr.condition);
		if (this.isTruthy(condition)) {
			return this.evaluate(expr.resTrue);
		} else {
			return this.evaluate(expr.resFalse)
		}
	}

	isTruthy(obj) {
		if (obj === null) return false;
		if (typeof obj === 'boolean') return obj;
		return true;
	}

	isEqual(a, b) {
		if (a === null && b === null) return true;
		if (a === null) return false;
		return a === b;
	}

	evaluate(expr) {
		return expr.accept(this);
	}

	double(n, expr) {
		if (!this.isNumeric(n)) {
			throw new RuntimeError(expr.operator, "Operand must be a number!");
		}
		return parseFloat(n);
	}

	isNumeric(value) {
        return /^-?\d+(\.\d+)?$/.test(value);
	}

	stringify(value) {
		if (value === null) return 'nil';
		return value.toString();
	}
}

module.exports = { Interpreter };
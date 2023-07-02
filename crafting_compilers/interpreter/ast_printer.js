const Expr = require('./ast/Expr');

class ASTPrinter extends Expr.ExprVisitor {
	print(expr) {
		return expr.accept(this);
	}

	visitTernaryExpr(expr) {
		return this.parenthesize('?:', expr.condition, expr.resTrue, expr.resFalse);
	}

	visitBinaryExpr(expr) {
		return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
	}

	visitGroupingExpr(expr) {
		return this.parenthesize("group", expr.expression);
	}

	visitLiteralExpr(expr) {
		if (expr.value === null) return 'nil';
		return expr.value.toString()
	}

	visitUnaryExpr(expr) {
		return this.parenthesize(expr.operator.lexeme, expr.right);
	}

	parenthesize(name, ...args) {
		let s = '';
		s += `(${name}`;
		args.forEach(expr => {
			s += ` ${expr.accept(this)}`;
		});
		s += ')';
		return s;
	}

	_parenthesize(name, ...args) {
		let s = '';
		args.forEach(expr => {
			s += expr.accept(this) + ' ';
		});
		s += name !== 'group' ? name + ' ' : '';
		return s;
	}
}

module.exports = { ASTPrinter };

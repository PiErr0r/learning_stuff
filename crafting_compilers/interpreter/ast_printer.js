const Expr = require('./ast/Expr');
const { TokenType } = require('./token_type');
const { Token } = require('./token');

class ASTPrinter extends Expr.ExprVisitor {
	print(expr) {
		return expr.accept(this);
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

	_parenthesize(name, ...args) {
		let s = '';
		s += `(${name}`;
		args.forEach(expr => {
			s += ` ${expr.accept(this)}`;
		});
		s += ')';
		return s;
	}

	parenthesize(name, ...args) {
		let s = '';
		args.forEach(expr => {
			s += expr.accept(this) + ' ';
		});
		s += name !== 'group' ? name + ' ' : '';
		return s;
	}
}

const main = () => {

	const expression1 = new Expr.Binary(
		new Expr.Unary(
			new Token(TokenType.MINUS, "-", null, 1),
			new Expr.Literal(123)),
		new Token(TokenType.STAR, "*", null, 1),
		new Expr.Grouping(
			new Expr.Literal(45.67)));
	const expression = new Expr.Binary(
		new Expr.Grouping(new Expr.Binary(
			new Expr.Literal(1),
			new Token(TokenType.PLUS, '+', null, 1),
			new Expr.Literal(2),
		)),
		new Token(TokenType.STAR, '*', null, 1),
		new Expr.Grouping(new Expr.Binary(
			new Expr.Literal(4),
			new Token(TokenType.MINUS, '-', null, 1),
			new Expr.Literal(3),
		))
	)
	const ast = new ASTPrinter();
	console.log(ast.print(expression))
}

main();
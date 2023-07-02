const { TokenType } = require('./token_type');
const Expr = require('./ast/Expr');

class ParseError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ParseError';
	}
}

class Parser {
	constructor(tokens) {
		this.tokens = tokens;
		this.current = 0;
	}

	parse() {
		try {
			return this.batch();
		} catch (err) {
			if (err instanceof ParseError) {
				return null;
			}
			// Unknown error -> Exit
			throw new Error(err);
		}
	}

	batch() { // batch -> expression ( (',') expression )*
		let expr = this.expression();

		while (this.match(TokenType.COMMA)) {
			expr = this.expression();
		}

		return expr;
	}

	expression() {
		let expr = this.equality();
		if (this.match(TokenType.QUERY)) {
			const exprTrue = this.expression();
			if (!this.match(TokenType.COLON)) {
				this.error(this.previous(), "Expect ternary operator!");
			}
			const exprFalse = this.expression();
			return new Expr.Ternary(expr, exprTrue, exprFalse);
		}
		return expr;
	}

	equality() {
		let expr = this.comparison();

		while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
			const operator = this.previous();
			const right = this.comparison();
			expr = new Expr.Binary(expr, operator, right);
		}

		return expr;
	}

	comparison() {
		let expr = this.term();

		while (this.match(TokenType.LESS, TokenType.LESS_EQUAL, TokenType.GREATER, TokenType.GREATER_EQUAL)) {
			const operator = this.previous();
			const right = this.term();
			expr = new Expr.Binary(expr, operator, right);
		}

		return expr;
	}

	term() {
		let expr = this.factor();

		while (this.match(TokenType.PLUS, TokenType.MINUS)) {
			const operator = this.previous();
			const right = this.factor();
			expr = new Expr.Binary(expr, operator, right);
		}

		return expr;
	}

	factor() {
		let expr = this.unary();

		while (this.match(TokenType.STAR, TokenType.SLASH)) {
			const operator = this.previous();
			const right = this.unary();
			expr = new Expr.Binary(expr, operator, right);
		}

		return expr;
	}

	unary() {
		if (this.match(TokenType.BANG, TokenType.MINUS)) {
			const operator = this.previous();
			const right = this.unary();
			return new Expr.Unary(operator, right);
		}

		return this.primary();
	}

	primary() {
		if (this.match(TokenType.FALSE)) return new Expr.Literal(false); 
		if (this.match(TokenType.TRUE)) return new Expr.Literal(true); 
		if (this.match(TokenType.NIL)) return new Expr.Literal(null);

		if (this.match(TokenType.NUMBER, TokenType.STRING)) {
			return new Expr.Literal(this.previous().literal);
		}

		if (this.match(TokenType.LEFT_PAREN)) {
			const expr = this.expression();
			this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression!");
			return new Expr.Grouping(expr);
		}

		this.error(this.peek(), 'Expect expression!');
	}

	match(...types) {
		for (let i = 0; i < types.length; ++i) {
			if (this.check(types[i])) {
				this.advance();
				return true;
			}
		}
		return false;
	}

	consume(type, message) {
		if (this.check(type)) return this.advance();
		this.error(this.peek(), message);
	}

	check(type) {
		if (this.isAtEnd()) return false;
		return this.peek().type === type;
	}

	advance() {
		if (!this.isAtEnd()) ++this.current;
		return this.previous();
	}

	isAtEnd() {
		return this.peek().type === TokenType.EOF;
	}

	peek() {
		return this.tokens[ this.current ];
	}

	previous() {
		return this.tokens[ this.current - 1 ];
	}

	error(token, message) {
		const { JLOX } = require('./jlox');
		JLOX.error(token, message);
		throw new ParseError(message);
	}

	synchronize() {
		this.advance();

		while (!this.isAtEnd()) {
			if (this.previous().type === TokenType.SEMICOLON) return;
			switch (this.peek().type) {
				case TokenType.CLASS:
				case TokenType.FUN:
				case TokenType.VAR:
				case TokenType.FOR:
				case TokenType.IF:
				case TokenType.WHILE:
				case TokenType.PRINT:
				case TokenType.RETURN:
					return;
			}
		}

		this.advance();
	}
}

module.exports = { Parser };
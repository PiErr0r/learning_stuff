import { Token } from '@/token';
import { Type, TokenType } from '@/token_type';
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

class ParseError extends Error {
	readonly name: string = "ParseError";
	constructor(message: string) {
		super(message);
	}
}

class Parser {
	current = 0;
	tokens: Token[];
	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	parse(): Expr | null {
		try {
			return this.batch();
		} catch (err) {
			if (err instanceof ParseError) {
				return null;
			}
			// Unknown error -> Exit
			throw new Error(err as string);
		}
	}

	batch(): Expr { // batch -> expression ( (',') expression )*
		let expr = this.expression();

		while (this.match(TokenType.COMMA)) {
			expr = this.expression();
		}

		return expr;
	}

	expression(): Expr {
		let expr = this.equality();
		if (this.match(TokenType.QUERY)) {
			const exprTrue = this.expression();
			if (!this.match(TokenType.COLON)) {
				this.error(this.previous(), "Expect ternary operator!");
			}
			const exprFalse = this.expression();
			return new ExprTernary(expr, exprTrue, exprFalse);
		}
		return expr;
	}

	equality(): Expr {
		let expr = this.comparison();

		while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
			const operator = this.previous();
			const right = this.comparison();
			expr = new ExprBinary(expr, operator, right);
		}

		return expr;
	}

	comparison(): Expr {
		let expr = this.term();

		while (this.match(TokenType.LESS, TokenType.LESS_EQUAL, TokenType.GREATER, TokenType.GREATER_EQUAL)) {
			const operator = this.previous();
			const right = this.term();
			expr = new ExprBinary(expr, operator, right);
		}

		return expr;
	}

	term(): Expr {
		let expr = this.factor();

		while (this.match(TokenType.PLUS, TokenType.MINUS)) {
			const operator = this.previous();
			const right = this.factor();
			expr = new ExprBinary(expr, operator, right);
		}

		return expr;
	}

	factor(): Expr {
		let expr = this.unary();

		while (this.match(TokenType.STAR, TokenType.SLASH)) {
			const operator = this.previous();
			const right = this.unary();
			expr = new ExprBinary(expr, operator, right);
		}

		return expr;
	}

	unary(): Expr {
		if (this.match(TokenType.BANG, TokenType.MINUS)) {
			const operator = this.previous();
			const right = this.unary();
			return new ExprUnary(operator, right);
		}

		return this.primary();
	}

	primary(): Expr {
		if (this.match(TokenType.FALSE)) return new ExprLiteral(false); 
		if (this.match(TokenType.TRUE)) return new ExprLiteral(true); 
		if (this.match(TokenType.NIL)) return new ExprLiteral(null);

		if (this.match(TokenType.NUMBER, TokenType.STRING)) {
			return new ExprLiteral(this.previous().literal);
		}

		if (this.match(TokenType.LEFT_PAREN)) {
			const expr = this.expression();
			this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression!");
			return new ExprGrouping(expr);
		}

		this.error(this.peek(), 'Expect expression!');
		return new ExprError();
	}

	match(...types: Type[]): boolean {
		for (let i = 0; i < types.length; ++i) {
			if (this.check(types[i])) {
				this.advance();
				return true;
			}
		}
		return false;
	}

	consume(type: Type, message: string): Token | null {
		if (this.check(type)) return this.advance();
		this.error(this.peek(), message);
		return null;
	}

	check(type: Type): boolean {
		if (this.isAtEnd()) return false;
		return this.peek().type === type;
	}

	advance(): Token {
		if (!this.isAtEnd()) ++this.current;
		return this.previous();
	}

	isAtEnd(): boolean {
		return this.peek().type === TokenType.EOF;
	}

	peek(): Token {
		return this.tokens[ this.current ];
	}

	previous(): Token {
		return this.tokens[ this.current - 1 ];
	}

	error(token: Token, message: string) {
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

export { Parser }
import { Token } from '@/token';
import { Type, TokenType } from '@/token_type';
import {
  Expr
, ExprError
, ExprVisitor
, ExprAssign
, ExprBinary
, ExprGrouping
, ExprLiteral
, ExprTernary
, ExprUnary
, ExprVariable
} from '@/ast/Expr';
import {
  Stmt
, StmtError
, StmtVisitor
, StmtBlock
, StmtExpression
, StmtPrint
, StmtVar
} from '@/ast/Stmt';
import { ParseError } from "@/errors";

class Parser {
	current = 0;
	tokens: Token[];
	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	parse(): Stmt[] {
		const statements: Stmt[] = [];
		while (!this.isAtEnd()) {
			statements.push(this.declaration());
		}
		return statements;
	}

	declaration(): Stmt | never {
		try {
			if (this.match(TokenType.VAR)) {
				return this.varDeclaration();
			}
			return this.statement();
		} catch (err) {
			if (err instanceof ParseError) {
				this.synchronize();
			}
			return new StmtError();
		}	
	}

	varDeclaration(): Stmt {
		const name = this.consume(TokenType.IDENTIFIER, "Expect variable name");
		const hasInit = this.match(TokenType.EQUAL);
		const initializer = hasInit
			? this.batch()
			: new ExprLiteral(null);
		this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration");
		return new StmtVar(name, initializer, hasInit)
	}

	statement(): Stmt {
		if (this.match(TokenType.PRINT)) return this.printStatement();
		if (this.match(TokenType.LEFT_BRACE)) return new StmtBlock(this.block());

		return this.expressionStatement();
	}

	block(): Stmt[] {
		const statements: Stmt[] = [];

		while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
			statements.push(this.declaration());
		}

		this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.")

		return statements;
	}

	printStatement() {
		const value = this.batch();
		this.consume(TokenType.SEMICOLON, "Expect ';'' after value;");
		return new StmtPrint(value);
	}

	expressionStatement() {
		const expr = this.batch();
		this.consume(TokenType.SEMICOLON, "Expect ';'' after expression;");
		return new StmtExpression(expr);		
	}

	batch(): Expr { // batch -> expression ( (',') expression )*
		let expr = this.expression();

		while (this.match(TokenType.COMMA)) {
			expr = this.expression();
		}

		return expr;
	}

	expression(): Expr | never {
		let expr = this.equality();

		if (this.match(TokenType.EQUAL)) {
			const equals = this.previous();
			const value = this.expression();

			if (expr instanceof ExprVariable) {
				const name = expr.name;
				return new ExprAssign(name, value);
			}

			this.error(equals, "Invalid assignment target.");
		}

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

		if (this.match(TokenType.IDENTIFIER)) {
			return new ExprVariable(this.previous());
		}

		if (this.match(TokenType.LEFT_PAREN)) {
			const expr = this.expression();
			this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression!");
			return new ExprGrouping(expr);
		}

		// console.log(this.peek());

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

	consume(type: Type, message: string): Token | never {
		if (this.check(type)) return this.advance();
		this.error(this.peek(), message);
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

	error(token: Token, message: string): never {
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
			this.advance();
		}

	}
}

export { Parser }
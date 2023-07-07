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
, StmtPrint
, StmtVar
, StmtWhile
} from '@/ast/Stmt';
import { ParseError, CSyntaxError } from "@/errors";

class Parser {
	current = 0;
	tokens: Token[];
	private inBlock = 0;
	private inLoop = 0;
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
			} else if (err instanceof CSyntaxError) {
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
		if (this.match(TokenType.BREAK)) return this.breakStatement();
		if (this.match(TokenType.CONTINUE)) return this.continueStatement();
		if (this.match(TokenType.FOR)) return this.forStatement();
		if (this.match(TokenType.IF)) return this.ifStatement();
		if (this.match(TokenType.PRINT)) return this.printStatement();
		if (this.match(TokenType.WHILE)) return this.whileStatement();
		if (this.match(TokenType.LEFT_BRACE)) return new StmtBlock(this.block());

		return this.expressionStatement();
	}

	block(): Stmt[] {
		++this.inBlock;
		const statements: Stmt[] = [];

		while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
			statements.push(this.declaration());
		}

		this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.")

		--this.inBlock;
		return statements;
	}

	breakStatement(): Stmt {
		if (this.inLoop === 0) {
			this.syntaxError(this.previous(), "break used outside of loop body.");			
		}
		this.consume(TokenType.SEMICOLON, "Expect ';' after break.");
		return new StmtBreak();
	}

	continueStatement(): Stmt {
		this.consume(TokenType.SEMICOLON, "Expect ';' after continue.");
		return new StmtContinue();
	}

	forStatement(): Stmt {
		++this.inLoop;
		this.consume(TokenType.LEFT_PAREN, "Expect ')' after for.");
		let initializer: Stmt | null = null;
		if (this.match(TokenType.SEMICOLON)) {
			initializer = null;
		} else if (this.match(TokenType.VAR)) {
			initializer = this.varDeclaration();
		} else {
			initializer = this.expressionStatement();
		}

		let condition: Expr | null = null;
		if (!this.check(TokenType.SEMICOLON)) {
			condition = this.batch();
		}
		this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

		let increment: Expr | null = null;
		if (!this.check(TokenType.RIGHT_PAREN)) {
			increment = this.batch();
		}
		this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");

		let body = this.statement();

		if (increment !== null) {
			body = new StmtBlock([body, new StmtExpression(increment)]);
		}
		if (condition === null) {
			condition = new ExprLiteral(true);
		}
		body = new StmtWhile(condition, body, true);
		if (initializer !== null) {
			body = new StmtBlock([initializer, body]);
		}

		--this.inLoop;
		return body;
	}

	ifStatement(): Stmt {
		this.consume(TokenType.LEFT_PAREN, "Expect '(' after if.");
		const condition = this.expression();
		this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
		const thenBranch = this.statement();

		const elseBranch = this.match(TokenType.ELSE) ? this.statement() : null;
		return new StmtIf(condition, thenBranch, elseBranch);
	}

	printStatement(): Stmt {
		const value = this.batch();
		this.consume(TokenType.SEMICOLON, "Expect ';'' after value;");
		return new StmtPrint(value);
	}

	whileStatement(): Stmt {
		++this.inLoop;
		this.consume(TokenType.LEFT_PAREN, "Expect '(' after while.");
		const condition = this.expression();
		this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
		const body = this.statement();
		--this.inLoop;
		return new StmtWhile(condition, body);
	}

	expressionStatement(): Stmt {
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
		let expr = this.or();

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

	or(): Expr {
		let expr = this.and();

		while (this.match(TokenType.OR)) {
			const operator = this.previous();
			const right = this.and();
			expr = new ExprLogical(expr, operator, right)
		}

		return expr;
	}

	and(): Expr {
		let expr = this.equality();
		
		while (this.match(TokenType.AND)) {
			const operator = this.previous();
			const right = this.equality();
			expr = new ExprLogical(expr, operator, right)
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
		this.inBlock = 0;
		this.inLoop = 0;
		throw new ParseError(message);
	}

	syntaxError(token: Token, message: string): never {
		const { JLOX } = require('./jlox');
		JLOX.error(token, message);
		this.inBlock = 0;
		this.inLoop = 0;
		throw new CSyntaxError(message);	
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
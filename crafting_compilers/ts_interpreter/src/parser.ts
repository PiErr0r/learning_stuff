import { Token } from '@/token';
import { Type, TokenType } from '@/token_type';
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
, StmtFunction
, StmtIf
, StmtExpression
, StmtPrint
, StmtReturn
, StmtVar
, StmtWhile
} from '@/ast/Stmt';
import { ParseError, CSyntaxError } from "@/errors";

class Parser {
	private current = 0;
	private tokens: Token[];
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

	private declaration(): Stmt | never {
		try {
			if (this.match(TokenType.FUN)) return this.funDeclaration("function");
			if (this.match(TokenType.VAR)) return this.varDeclaration();
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

	private funDeclaration(kind: string): Stmt {
		const name = this.consume(TokenType.IDENTIFIER, `Expect ${kind} name.`);
		this.consume(TokenType.LEFT_PAREN, `Expect '(' after ${kind} name.`);
		const params: Token[] = []
		if (!this.check(TokenType.RIGHT_PAREN)) {
			do {
				if (params.length > 255) {
					this.error(this.peek(), "Can't have more than 255 parameters.");
				}
				params.push(this.consume(TokenType.IDENTIFIER, "Expect parameter name."));
			} while (this.match(TokenType.COMMA));
		}
		this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters");

		this.consume(TokenType.LEFT_BRACE, `Expect '{' before ${kind} body.`);
		const body = this.block();
		return new StmtFunction(name, params, body);
	}

	private varDeclaration(): Stmt {
		const name = this.consume(TokenType.IDENTIFIER, "Expect variable name");
		const hasInit = this.match(TokenType.EQUAL);
		const initializer = hasInit
			? this.batch()
			: new ExprLiteral(null);
		this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration");
		return new StmtVar(name, initializer, hasInit)
	}

	private statement(): Stmt {
		if (this.match(TokenType.BREAK)) return this.breakStatement();
		if (this.match(TokenType.CONTINUE)) return this.continueStatement();
		if (this.match(TokenType.FOR)) return this.forStatement();
		if (this.match(TokenType.IF)) return this.ifStatement();
		if (this.match(TokenType.PRINT)) return this.printStatement();
		if (this.match(TokenType.RETURN)) return this.returnStatement();
		if (this.match(TokenType.WHILE)) return this.whileStatement();
		if (this.match(TokenType.LEFT_BRACE)) return new StmtBlock(this.block());

		return this.expressionStatement();
	}

	private block(): Stmt[] {
		++this.inBlock;
		const statements: Stmt[] = [];

		while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
			statements.push(this.declaration());
		}

		this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.")

		--this.inBlock;
		return statements;
	}

	private breakStatement(): Stmt {
		if (this.inLoop === 0) {
			this.syntaxError(this.previous(), "break used outside of loop body.");			
		}
		this.consume(TokenType.SEMICOLON, "Expect ';' after break.");
		return new StmtBreak();
	}

	private continueStatement(): Stmt {
		this.consume(TokenType.SEMICOLON, "Expect ';' after continue.");
		return new StmtContinue();
	}

	private forStatement(): Stmt {
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

	private ifStatement(): Stmt {
		this.consume(TokenType.LEFT_PAREN, "Expect '(' after if.");
		const condition = this.expression();
		this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
		const thenBranch = this.statement();

		const elseBranch = this.match(TokenType.ELSE) ? this.statement() : null;
		return new StmtIf(condition, thenBranch, elseBranch);
	}

	private printStatement(): Stmt {
		const value = this.batch();
		this.consume(TokenType.SEMICOLON, "Expect ';'' after value;");
		return new StmtPrint(value);
	}

	private returnStatement(): Stmt {
		const keyword = this.previous();
		const value = this.check(TokenType.SEMICOLON)
			? null
			: this.expression();
		this.consume(TokenType.SEMICOLON, "Expect ';' after return statement.");
		return new StmtReturn(keyword, value);
	}

	private whileStatement(): Stmt {
		++this.inLoop;
		this.consume(TokenType.LEFT_PAREN, "Expect '(' after while.");
		const condition = this.expression();
		this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
		const body = this.statement();
		--this.inLoop;
		return new StmtWhile(condition, body);
	}

	private expressionStatement(): Stmt {
		const expr = this.batch();
		this.consume(TokenType.SEMICOLON, "Expect ';'' after expression;");
		return new StmtExpression(expr);		
	}

	private batch(): Expr { // batch -> expression ( (',') expression )*
		let expr = this.expression();

		while (this.match(TokenType.COMMA)) {
			expr = this.expression();
		}

		return expr;
	}

	private expression(): Expr | never {
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

	private lambdaExpression(): Expr {
		this.consume(TokenType.LEFT_PAREN, `Expect '(' after fun.`);
		const params: Token[] = []
		if (!this.check(TokenType.RIGHT_PAREN)) {
			do {
				if (params.length > 255) {
					this.error(this.peek(), "Can't have more than 255 parameters.");
				}
				params.push(this.consume(TokenType.IDENTIFIER, "Expect parameter name."));
			} while (this.match(TokenType.COMMA));
		}
		this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters");

		this.consume(TokenType.LEFT_BRACE, `Expect '{' before lambda body.`);
		const body = this.block();
		return new ExprLambda(params, body);	
	}

	private or(): Expr {
		let expr = this.and();

		while (this.match(TokenType.OR)) {
			const operator = this.previous();
			const right = this.and();
			expr = new ExprLogical(expr, operator, right)
		}

		return expr;
	}

	private and(): Expr {
		let expr = this.equality();
		
		while (this.match(TokenType.AND)) {
			const operator = this.previous();
			const right = this.equality();
			expr = new ExprLogical(expr, operator, right)
		}

		return expr;
	}

	private equality(): Expr {
		let expr = this.comparison();

		while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
			const operator = this.previous();
			const right = this.comparison();
			expr = new ExprBinary(expr, operator, right);
		}

		return expr;
	}

	private comparison(): Expr {
		let expr = this.term();

		while (this.match(TokenType.LESS, TokenType.LESS_EQUAL, TokenType.GREATER, TokenType.GREATER_EQUAL)) {
			const operator = this.previous();
			const right = this.term();
			expr = new ExprBinary(expr, operator, right);
		}

		return expr;
	}

	private term(): Expr {
		let expr = this.factor();

		while (this.match(TokenType.PLUS, TokenType.MINUS)) {
			const operator = this.previous();
			const right = this.factor();
			expr = new ExprBinary(expr, operator, right);
		}

		return expr;
	}

	private factor(): Expr {
		let expr = this.unary();

		while (this.match(TokenType.STAR, TokenType.SLASH)) {
			const operator = this.previous();
			const right = this.unary();
			expr = new ExprBinary(expr, operator, right);
		}

		return expr;
	}

	private unary(): Expr {
		if (this.match(TokenType.BANG, TokenType.MINUS)) {
			const operator = this.previous();
			const right = this.unary();
			return new ExprUnary(operator, right);
		}

		return this.call();
	}

	private call(): Expr {
		let expr = this.primary();

		while (true) {
			if (this.match(TokenType.LEFT_PAREN)) {
				expr = this.finishCall(expr);
			} else {
				break;
			}
		}

		return expr;
	}

	private finishCall(callee: Expr): Expr {
		const args: Expr[] = [];
		if (!this.check(TokenType.RIGHT_PAREN)) {
			do {
				if (args.length >= 255) {
					this.error(this.peek(), "Can't have more than 255 arguments");
				}
				args.push(this.expression());
			} while (this.match(TokenType.COMMA));
		}
		const paren = this.consume(TokenType.RIGHT_PAREN, "Expect ')' after function arguments.");

		return new ExprCall(callee, paren, args);
	}

	private primary(): Expr {
		if (this.match(TokenType.FUN)) return this.lambdaExpression();
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

	private match(...types: Type[]): boolean {
		for (let i = 0; i < types.length; ++i) {
			if (this.check(types[i])) {
				this.advance();
				return true;
			}
		}
		return false;
	}

	private consume(type: Type, message: string): Token | never {
		if (this.check(type)) return this.advance();
		this.error(this.peek(), message);
	}

	private check(type: Type): boolean {
		if (this.isAtEnd()) return false;
		return this.peek().type === type;
	}

	private advance(): Token {
		if (!this.isAtEnd()) ++this.current;
		return this.previous();
	}

	private isAtEnd(): boolean {
		return this.peek().type === TokenType.EOF;
	}

	private peek(): Token {
		return this.tokens[ this.current ];
	}

	private previous(): Token {
		return this.tokens[ this.current - 1 ];
	}

	private error(token: Token, message: string): never {
		const { JLOX } = require('./jlox');
		JLOX.error(token, message);
		this.inBlock = 0;
		this.inLoop = 0;
		throw new ParseError(message);
	}

	private syntaxError(token: Token, message: string): never {
		const { JLOX } = require('./jlox');
		JLOX.error(token, message);
		this.inBlock = 0;
		this.inLoop = 0;
		throw new CSyntaxError(message);	
	}

	private synchronize() {
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
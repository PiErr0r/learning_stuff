import {
  Expr
, ExprError
, ExprVisitor
, ExprAssign
, ExprBinary
, ExprCall
, ExprGet
, ExprGrouping
, ExprLambda
, ExprLiteral
, ExprLogical
, ExprSet
, ExprTernary
, ExprThis
, ExprUnary
, ExprVariable
} from '@/ast/Expr';
import {
  Stmt
, StmtError
, StmtVisitor
, StmtBlock
, StmtBreak
, StmtClass
, StmtContinue
, StmtIf
, StmtExpression
, StmtFunction
, StmtPrint
, StmtReturn
, StmtVar
, StmtWhile
} from '@/ast/Stmt';
import { Interpreter } from "@/interpreter";
import { Stack, IMap } from "@/stack";
import { Token } from "@/token";

enum FnType {
	NONE,
	FUNCTION,
	INITIALIZER,
	METHOD
}

enum ClassType {
	NONE,
	CLASS
}

// class Interpreter implements ExprVisitor<Literal>, StmtVisitor<void> {
class Resolver implements ExprVisitor<void>, StmtVisitor<void> {
	private currentClass = ClassType.NONE;
	private currentFn = FnType.NONE;
	private interpreter: Interpreter;
	private scopes: Stack<IMap<boolean>> = new Stack();
	constructor(interpreter: Interpreter) {
		this.interpreter = interpreter;
	}

	visitBlockStmt(stmt: StmtBlock) {
		this.beginScope();
		this.resolve(stmt.statements);
		this.endScope();
	}

	visitBreakStmt(stmt: StmtBreak) {};

	visitClassStmt(stmt: StmtClass) {
		const enclosingClass = this.currentClass;
		this.currentClass = ClassType.CLASS;
		this.declare(stmt.name);
		this.define(stmt.name);
		this.beginScope();
		this.scopes.peek()['this'] = true;
		stmt.methods.forEach(method => {
			const fnType = method.name.lexeme === "init" ? FnType.INITIALIZER : FnType.METHOD;
			this.resolveFunction(method, fnType);
		});
		this.endScope();
		this.currentClass = enclosingClass;
	}

	visitContinueStmt(stmt: StmtContinue) {};
	visitErrorStmt(stmt: StmtError) {};

	visitExpressionStmt(stmt: StmtExpression) {
		this.resolve(stmt.expression);
	}

	visitFunctionStmt(stmt: StmtFunction) {
		this.declare(stmt.name);
		this.define(stmt.name);
		this.resolveFunction(stmt, FnType.FUNCTION);
	}

	visitIfStmt(stmt: StmtIf) {
		this.resolve(stmt.condition);
		this.resolve(stmt.thenBranch);
		if (stmt.elseBranch !== null) {
			this.resolve(stmt.elseBranch);
		}
	}

	visitPrintStmt(stmt: StmtPrint) {
		this.resolve(stmt.expression);
	}

	visitReturnStmt(stmt: StmtReturn) {
		if (this.currentFn === FnType.NONE) {
			const { JLOX } = require('./jlox');
			const message = "Can't return from top-level code!";
			JLOX.error(stmt.keyword, message);
		}
		if (stmt.value !== null) {
			if (this.currentFn === FnType.INITIALIZER) {
				const { JLOX } = require('./jlox');
				const message = "Can't return a value from class initializer!";
				JLOX.error(stmt.keyword, message);	
			}
			this.resolve(stmt.value);
		}
	}

	visitVarStmt(stmt: StmtVar) {
		this.declare(stmt.name);
		if (stmt.isInitialized) {
			this.resolve(stmt.initializer);
		}
		this.define(stmt.name);
	}

	visitWhileStmt(stmt: StmtWhile) {
		this.resolve(stmt.condition);
		this.resolve(stmt.body);
	}

	visitAssignExpr(expr: ExprAssign) {
		this.resolve(expr.value);
		this.resolveLocal(expr, expr.name);
	}

	visitBinaryExpr(expr: ExprBinary) {
		this.resolve(expr.left);
		this.resolve(expr.right);
	}

	visitCallExpr(expr: ExprCall) {
		this.resolve(expr.callee);
		expr.args.forEach(arg => this.resolve(arg));
	}

	visitErrorExpr(expr: ExprError) {}

	visitGetExpr(expr: ExprGet) {
		this.resolve(expr.obj);
	}

	visitGroupingExpr(expr: ExprGrouping) {
		this.resolve(expr.expression);
	}

	visitLambdaExpr(expr: ExprLambda) {
		this.resolveLambda(expr, FnType.FUNCTION);
	}

	visitLiteralExpr(expr: ExprLiteral) {}

	visitLogicalExpr(expr: ExprLogical) {
		this.resolve(expr.left);
		this.resolve(expr.right);
	}

	visitSetExpr(expr: ExprSet) {
		this.resolve(expr.value);
		this.resolve(expr.obj);
	}

	visitTernaryExpr(expr: ExprTernary) {
		this.resolve(expr.condition);
		this.resolve(expr.resTrue);
		this.resolve(expr.resFalse);
	}

	visitThisExpr(expr: ExprThis) {
		if (this.currentClass === ClassType.NONE) {
			const { JLOX } = require('./jlox');
			const message = "Can't use 'this' outside of a class!";
			JLOX.error(expr.keyword, message);
			return;
		}
		this.resolveLocal(expr, expr.keyword);
	}

	visitUnaryExpr(expr: ExprUnary) {
		this.resolve(expr.right);
	}

	visitVariableExpr(expr: ExprVariable) {
		if (!this.scopes.empty() && this.scopes.peek()[expr.name.lexeme] === false) {
			const { JLOX } = require('./jlox');
			const message = "Can't read local variable in its own initializer!";
			JLOX.error(expr.name, message);
		}

		this.resolveLocal(expr, expr.name);
	}

	resolve(stmts: Stmt[] | Stmt | Expr) {
		if (Array.isArray(stmts))
			stmts.forEach(stmt => this.resolve(stmt));
		else
			stmts.accept(this);
	}

	resolveFunction(fn: StmtFunction, fnType: FnType) {
		const enclosingFn = this.currentFn;
		this.currentFn = fnType;
		this.beginScope();
		fn.params.forEach(param => {
			this.declare(param);
			this.define(param);
		});
		this.resolve(fn.body);
		this.endScope();
		this.currentFn = enclosingFn;
	}

	resolveLambda(fn: ExprLambda, fnType: FnType) {
		const enclosingFn = this.currentFn;
		this.currentFn = fnType;
		this.beginScope();
		fn.params.forEach(param => {
			this.declare(param);
			this.define(param);
		});
		this.resolve(fn.body);
		this.endScope();
		this.currentFn = enclosingFn;
	}

	resolveLocal(expr: Expr, name: Token) {
		for (let i = this.scopes.size() - 1; i >= 0; --i) {
			if (name.lexeme in this.scopes.get(i)) {
				this.interpreter.resolve(expr, this.scopes.size() - 1 - i);
				return;
			}
		}
	}

	private beginScope() {
		this.scopes.push({} as IMap<boolean>);
	}

	private endScope() {
		this.scopes.pop();
	}

	private declare(name: Token) {
		if (this.scopes.empty()) return;

		const scope = this.scopes.peek();
		if (name.lexeme in scope) {
				const { JLOX } = require('./jlox');
				const message = "Already a variable with this name in this scope!";
				JLOX.error(name, message);
		}
		scope[name.lexeme] = false;
	}

	private define(name: Token) {
		if (this.scopes.empty()) return;

		const scope = this.scopes.peek();
		scope[name.lexeme] = true;
	}
}

export { Resolver };
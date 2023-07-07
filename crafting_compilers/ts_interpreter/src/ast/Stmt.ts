import { Expr } from "@/ast/Expr"
import { Token } from "@/token"


interface StmtVisitor<T> {
  visitBlockStmt: (stmt: StmtBlock) => T;
  visitBreakStmt: (stmt: StmtBreak) => T;
  visitContinueStmt: (stmt: StmtContinue) => T;
  visitIfStmt: (stmt: StmtIf) => T;
  visitExpressionStmt: (stmt: StmtExpression) => T;
  visitPrintStmt: (stmt: StmtPrint) => T;
  visitVarStmt: (stmt: StmtVar) => T;
  visitWhileStmt: (stmt: StmtWhile) => T;
  visitErrorStmt: (stmt: StmtError) => T;
}

abstract class Stmt {
  abstract accept<T>(visitor: StmtVisitor<T>): T;
}

class StmtBlock extends Stmt {
  statements: Stmt[];
  constructor(statements: Stmt[]) {
    super();
    this.statements = statements;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitBlockStmt(this);
  }
}


class StmtBreak extends Stmt {
  constructor() {
    super();
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitBreakStmt(this);
  }
}


class StmtContinue extends Stmt {
  constructor() {
    super();
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitContinueStmt(this);
  }
}


class StmtIf extends Stmt {
  condition: Expr;
  thenBranch: Stmt;
  elseBranch: Stmt | null;
  constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitIfStmt(this);
  }
}


class StmtExpression extends Stmt {
  expression: Expr;
  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitExpressionStmt(this);
  }
}


class StmtPrint extends Stmt {
  expression: Expr;
  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitPrintStmt(this);
  }
}


class StmtVar extends Stmt {
  name: Token;
  initializer: Expr;
  isInitialized: boolean;
  constructor(name: Token, initializer: Expr, isInitialized: boolean) {
    super();
    this.name = name;
    this.initializer = initializer;
    this.isInitialized = isInitialized;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitVarStmt(this);
  }
}


class StmtWhile extends Stmt {
  condition: Expr;
  body: Stmt;
  isFor?: boolean;
  constructor(condition: Expr, body: Stmt, isFor?: boolean) {
    super();
    this.condition = condition;
    this.body = body;
    this.isFor = isFor;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitWhileStmt(this);
  }
}


class StmtError extends Stmt {
  constructor() {
    super();
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitErrorStmt(this);
  }
}


export {
  Stmt
, StmtVisitor
, StmtBlock
, StmtBreak
, StmtContinue
, StmtIf
, StmtExpression
, StmtPrint
, StmtVar
, StmtWhile
, StmtError
};
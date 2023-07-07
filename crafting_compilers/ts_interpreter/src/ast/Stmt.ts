import { Expr } from "@/ast/Expr"
import { Token } from "@/token"


interface StmtVisitor<T> {
  visitBlockStmt: (stmt: StmtBlock) => T;
  visitExpressionStmt: (stmt: StmtExpression) => T;
  visitPrintStmt: (stmt: StmtPrint) => T;
  visitVarStmt: (stmt: StmtVar) => T;
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
, StmtExpression
, StmtPrint
, StmtVar
, StmtError
};
import { Expr } from "@/ast/Expr"
import { Token } from "@/token"


interface StmtVisitor<T> {
  visitExpressionStmt: (stmt: StmtExpression) => T;
  visitPrintStmt: (stmt: StmtPrint) => T;
  visitErrorStmt: (stmt: StmtError) => T;
}

abstract class Stmt {
  abstract accept<T>(visitor: StmtVisitor<T>): T;
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
, StmtExpression
, StmtPrint
, StmtError
};
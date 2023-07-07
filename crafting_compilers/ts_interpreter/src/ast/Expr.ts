import { Token } from "@/token"
import { Literal } from "@/token_type"


interface ExprVisitor<T> {
  visitAssignExpr: (expr: ExprAssign) => T;
  visitBinaryExpr: (expr: ExprBinary) => T;
  visitGroupingExpr: (expr: ExprGrouping) => T;
  visitLiteralExpr: (expr: ExprLiteral) => T;
  visitLogicalExpr: (expr: ExprLogical) => T;
  visitTernaryExpr: (expr: ExprTernary) => T;
  visitUnaryExpr: (expr: ExprUnary) => T;
  visitVariableExpr: (expr: ExprVariable) => T;
  visitErrorExpr: (expr: ExprError) => T;
}

abstract class Expr {
  abstract accept<T>(visitor: ExprVisitor<T>): T;
}

class ExprAssign extends Expr {
  name: Token;
  value: Expr;
  constructor(name: Token, value: Expr) {
    super();
    this.name = name;
    this.value = value;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitAssignExpr(this);
  }
}


class ExprBinary extends Expr {
  left: Expr;
  operator: Token;
  right: Expr;
  constructor(left: Expr, operator: Token, right: Expr) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}


class ExprGrouping extends Expr {
  expression: Expr;
  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitGroupingExpr(this);
  }
}


class ExprLiteral extends Expr {
  value: Literal;
  constructor(value: Literal) {
    super();
    this.value = value;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitLiteralExpr(this);
  }
}


class ExprLogical extends Expr {
  left: Expr;
  operator: Token;
  right: Expr;
  constructor(left: Expr, operator: Token, right: Expr) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitLogicalExpr(this);
  }
}


class ExprTernary extends Expr {
  condition: Expr;
  resTrue: Expr;
  resFalse: Expr;
  constructor(condition: Expr, resTrue: Expr, resFalse: Expr) {
    super();
    this.condition = condition;
    this.resTrue = resTrue;
    this.resFalse = resFalse;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitTernaryExpr(this);
  }
}


class ExprUnary extends Expr {
  operator: Token;
  right: Expr;
  constructor(operator: Token, right: Expr) {
    super();
    this.operator = operator;
    this.right = right;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
}


class ExprVariable extends Expr {
  name: Token;
  constructor(name: Token) {
    super();
    this.name = name;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitVariableExpr(this);
  }
}


class ExprError extends Expr {
  constructor() {
    super();
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitErrorExpr(this);
  }
}


export {
  Expr
, ExprVisitor
, ExprAssign
, ExprBinary
, ExprGrouping
, ExprLiteral
, ExprLogical
, ExprTernary
, ExprUnary
, ExprVariable
, ExprError
};
import { Literal } from "@/token_type"
import { Token } from "@/token"


interface ExprVisitor {
  visitTernaryExpr: (expr: ExprTernary) => Literal;
  visitBinaryExpr: (expr: ExprBinary) => Literal;
  visitGroupingExpr: (expr: ExprGrouping) => Literal;
  visitLiteralExpr: (expr: ExprLiteral) => Literal;
  visitUnaryExpr: (expr: ExprUnary) => Literal;
}

class Expr {
  accept(visitor: ExprVisitor): Literal {
console.error("Called on main class! Not implemented");
return null;
};
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
  accept(visitor: ExprVisitor): Literal {
    return visitor.visitTernaryExpr(this);
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
  accept(visitor: ExprVisitor): Literal {
    return visitor.visitBinaryExpr(this);
  }
}


class ExprGrouping extends Expr {
  expression: Expr;
  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }
  accept(visitor: ExprVisitor): Literal {
    return visitor.visitGroupingExpr(this);
  }
}


class ExprLiteral extends Expr {
  value: Literal;
  constructor(value: Literal) {
    super();
    this.value = value;
  }
  accept(visitor: ExprVisitor): Literal {
    return visitor.visitLiteralExpr(this);
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
  accept(visitor: ExprVisitor): Literal {
    return visitor.visitUnaryExpr(this);
  }
}


class ExprError extends Expr {};

export {
  Expr
, ExprVisitor
, ExprTernary
, ExprBinary
, ExprGrouping
, ExprLiteral
, ExprUnary
, ExprError
};
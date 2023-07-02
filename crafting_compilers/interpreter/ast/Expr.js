class Expr {
  accept(visitor) {console.error("Called on main class! Not implemented")};
}

class ExprVisitor {
  visitBinaryExpr(expr) {};
  visitGroupingExpr(expr) {};
  visitLiteralExpr(expr) {};
  visitUnaryExpr(expr) {};
}


class Binary extends Expr {
  constructor(/*Expr*/ left, /*Token*/ operator, /*Expr*/ right) {
    super();
    this.left = left; // Expr
    this.operator = operator; // Token
    this.right = right; // Expr
  }
  accept(visitor) {
    return visitor.visitBinaryExpr(this);
  }
}


class Grouping extends Expr {
  constructor(/*Expr*/ expression) {
    super();
    this.expression = expression; // Expr
  }
  accept(visitor) {
    return visitor.visitGroupingExpr(this);
  }
}


class Literal extends Expr {
  constructor(/*Object*/ value) {
    super();
    this.value = value; // Object
  }
  accept(visitor) {
    return visitor.visitLiteralExpr(this);
  }
}


class Unary extends Expr {
  constructor(/*Token*/ operator, /*Expr*/ right) {
    super();
    this.operator = operator; // Token
    this.right = right; // Expr
  }
  accept(visitor) {
    return visitor.visitUnaryExpr(this);
  }
}

module.exports = {
  Expr
, ExprVisitor
, Binary
, Grouping
, Literal
, Unary
};
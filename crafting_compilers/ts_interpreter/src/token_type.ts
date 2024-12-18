import { LoxCallable, LoxInstance } from "@/lox_callable";

type Literal = LoxInstance | LoxCallable | boolean | number | string | null;
type Type = number;
interface TT {
	readonly [typeName: string]: Type
}

const TokenType: TT = {
	// Single-character tokens.
	LEFT_PAREN: 100,	// (
	RIGHT_PAREN: 101,	// )
	LEFT_BRACE: 102,	// {
	RIGHT_BRACE: 103,	// }
	COMMA: 104,			// ,
	DOT: 105,			// .
	MINUS: 106,			// -
	PLUS: 107,			// +
	SEMICOLON: 108,		// ;
	SLASH: 109,			// /
	STAR: 110,			// *
	QUERY: 111,			// ?
	COLON: 112,			// :
	
	// One or two character tokens.
	BANG: 200,			// !
	BANG_EQUAL: 201,	// !=
	EQUAL: 202,			// =
	EQUAL_EQUAL: 203,	// ==
	GREATER: 204,		// >
	GREATER_EQUAL: 205,	// >=
	LESS: 206,			// <
	LESS_EQUAL: 207,	// <=
	
	// Literals.
	IDENTIFIER: 300,
	STRING: 301,
	NUMBER: 302,
	
	// Keywords.
	AND: 400,
	CLASS: 401,
	ELSE: 402,
	FALSE: 403,
	FUN: 404,
	FOR: 405,
	IF: 406,
	NIL: 407,
	OR: 408,
	PRINT: 409,
	RETURN: 410,
	SUPER: 411,
	THIS: 412,
	TRUE: 413,
	VAR: 414,
	WHILE: 415,
	BREAK: 416,
	CONTINUE: 417,

	EOF: 500,
}

export { Literal, TokenType, Type };

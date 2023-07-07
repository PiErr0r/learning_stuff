import { Token } from "@/token";
import { Literal, TokenType, Type } from "@/token_type";

interface Keywords {
	readonly [keyword: string]: Type;
}

const keywords: Keywords = {
	and: TokenType.AND,
	class: TokenType.CLASS,
	else: TokenType.ELSE,
	false: TokenType.FALSE,
	for: TokenType.FOR,
	fun: TokenType.FUN,
	if: TokenType.IF,
	nil: TokenType.NIL,
	or: TokenType.OR,
	print: TokenType.PRINT,
	return: TokenType. RETURN,
	super: TokenType.SUPER,
	this: TokenType.THIS,
	true: TokenType.TRUE,
	var: TokenType.VAR,
	while: TokenType.WHILE,
};

class Scanner {
	source: string;
	start = 0; // start of token pointer
	current = 0; // current character
	line = 1;
	tokens: Token[] = [];
	constructor(source: string) {
		this.source = source;
	}

	scanTokens(): Token[] {
		while (!this.isAtEnd()) {
			this.start = this.current;
			this.scanToken();
		}
		this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
		return this.tokens;
	}

	scanToken() {
		const c = this.advance();
		switch (c) {
			case '(': this.addToken(TokenType.LEFT_PAREN); break;
			case ')': this.addToken(TokenType.RIGHT_PAREN); break;
			case '{': this.addToken(TokenType.LEFT_BRACE); break;
			case '}': this.addToken(TokenType.RIGHT_BRACE); break;
			case ',': this.addToken(TokenType.COMMA); break;
			case '.': this.addToken(TokenType.DOT); break;
			case '-': this.addToken(TokenType.MINUS); break;
			case '+': this.addToken(TokenType.PLUS); break;
			case ';': this.addToken(TokenType.SEMICOLON); break;
			case '*': this.addToken(TokenType.STAR); break;
			case '?': this.addToken(TokenType.QUERY); break;
			case ':': this.addToken(TokenType.COLON); break;
			case '!': 
				this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
				break;
			case '=':
				this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
				break;
			case '<':
				this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
				break;
			case '>':
				this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
				break;
			case '/':
				if (this.match('/')) { // line comment
					while(this.peek() !== '\n' && !this.isAtEnd()) {
						this.advance();
					}
				} else if (this.match('*')) {
					this.blockComment();
				} else {
					this.addToken(TokenType.SLASH);
				}
			case ' ':
			case '\t':
			case '\r':
				break;
			case '\n':
				++this.line;
				break;
			case '"': this.string(); break;
			default: {
				if (this.isDigit(c)) {
					this.number();	
				} else if (this.isAlpha(c)) {
					this.identifier();
				} else {
					const { JLOX } = require('./jlox');
					JLOX.error(this.line, `Unexpected character: ${c}.`);
				}
				break;
			}
		}
	}

	isAtEnd(): boolean {
		// check if current pointer is out of file
		return this.current >= this.source.length;
	}

	isDigit(c: string): boolean {
		return c >= '0' && c <= '9';
	}

	isAlpha(c: string): boolean {
		return c === '_'
		|| c >= 'a' && c <= 'z'
		|| c >= 'A' && c <= 'Z';
	}

	isAlphaNumeric(c: string): boolean {
		return this.isDigit(c) || this.isAlpha(c);
	}

	blockComment() {
		// scan a block comment
		while (this.peek() !== '*' && this.peekNext() !== '/' && !this.isAtEnd()) {
			if (this.peek() === '\n') ++this.line;
			this.advance();
		}
		// error
		if (this.current + 1 >= this.source.length || this.peek() !== '*' || this.peekNext() !== '/') {
			const { JLOX } = require('./jlox');
			JLOX.error(this.line, "Unterminated block comment.");						
			return;
		}
		// closing * and /
		this.advance();
		this.advance();
	}

	identifier() {
		// scan identifier
		while(this.isAlphaNumeric(this.peek())) this.advance();
		const text = this.source.slice(this.start, this.current);
		// check if it really is an identifier or some keyword
		const type = keywords[text as keyof Keywords] || TokenType.IDENTIFIER;
		this.addToken(type);
	}

	number() {
		// scan number
		while (this.isDigit(this.peek())) this.advance();
		if (this.peek() === '.' && this.isDigit(this.peekNext())) {
			this.advance();
			while(this.isDigit(this.peek())) this.advance();
		}
		this._addToken(TokenType.NUMBER, parseFloat(this.source.slice(this.start, this.current)));
	}

	string() {
		// scan string
		while (this.peek() !== '"' && !this.isAtEnd()) {
			if (this.peek() === '\n') ++this.line;
			this.advance();
		}
		if (this.isAtEnd()) {
			const { JLOX } = require('./jlox');
			JLOX.error(this.line, "Unterminated string.");
			return;
		}
		this.advance(); // closing "
		const value = this.source.slice(this.start + 1, this.current - 1);
		this._addToken(TokenType.STRING, value);
	}

	peek(): string {
		// lookahead 1 character
		if (this.isAtEnd()) return '\0';
		return this.source[ this.current ];
	}

	peekNext(): string {
		// lookahead 2 characters
		if (this.current + 1 >= this.source.length) return '\0';
		return this.source[ this.current + 1 ];
	}

	match(expected: string): boolean {
		// match next character
		if (this.isAtEnd()) return false;
		if (this.source[ this.current ] !== expected)
			return false;
		++this.current;
		return true;
	}

	advance(): string {
		// move pointer one position ahead
		return this.source[this.current++];
	}

	addToken(type: Type) {
		// add token to list (single)
		this._addToken(type, null);
	}

	_addToken(type: Type, literal: Literal) {
		// add token to list with value
		const text = this.source.slice(this.start, this.current);
		this.tokens.push(new Token(type, text, literal, this.line));
	}
};

export { Scanner };
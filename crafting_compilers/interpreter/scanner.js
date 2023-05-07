const { Token } = require('./token');
const { TokenType } = require('./token_type');

const keywords = {
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
	constructor(source) {
		this.source = source;
		this.start = 0;
		this.current = 0;
		this.line = 1;
		this.tokens = [];
	}

	isAtEnd() {
		return this.current >= this.source.length;
	}

	scanTokens() {
		while (!this.isAtEnd()) {
			this.start = this.current;
			this.scanToken();
		}
		this.tokens.push(new Token(TokenType.EOF, null, "", this.line));
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
				if (this.match('/')) {
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

	isDigit(c) {
		return c >= '0' && c <= '9';
	}

	isAlpha(c) {
		return c === '_'
		|| c >= 'a' && c <= 'z'
		|| c >= 'A' && c <= 'Z';
	}

	isAlphaNumeric(c) {
		return this.isDigit(c) || this.isAlpha(c);
	}

	blockComment() {
		while (this.peek() !== '*' && this.peekNext() !== '/' && !this.isAtEnd()) {
			if (this.peek() === '\n') ++this.line;
			this.advance();
		}
		// console.log(this.peek())
		if (this.current + 1 >= this.source.length || this.peek() !== '*' || this.peekNext() !== '/') {
			const { JLOX } = require('./jlox');
			JLOX.error(this.line, "Unterminated block comment.");						
			return;
		}
		this.advance();
		this.advance();
	}

	identifier() {
		while(this.isAlphaNumeric(this.peek())) this.advance();

		const text = this.source.slice(this.start, this.current);
		const type = keywords[text] || TokenType.IDENTIFIER;

		this.addToken(type);
	}

	number() {
		while (this.isDigit(this.peek())) this.advance();

		if (this.peek() === '.' && this.isDigit(this.peekNext())) {
			this.advance();
			while(this.isDigit(this.peek())) this.advance();
		}

		this._addToken(TokenType.NUMBER, parseFloat(this.source.slice(this.start, this.current)));
	}

	string() {
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

	peek() {
		if (this.isAtEnd()) return '\0';
		return this.source[ this.current ];
	}

	peekNext() {
		if (this.current + 1 >= this.source.length) return '\0';
		return this.source[ this.current + 1 ];
	}

	match(expected) {
		if (this.isAtEnd()) return false;
		if (this.source[ this.current ] !== expected)
			return false;
		++this.current;
		return true;
	}

	advance() {
		return this.source[this.current++];
	}

	addToken(type) {
		this._addToken(type, null);
	}

	_addToken(type, literal) {
		const text = this.source.slice(this.start, this.current);
		this.tokens.push(new Token(type, text, literal, this.line));
	}
}

exports.Scanner = Scanner;
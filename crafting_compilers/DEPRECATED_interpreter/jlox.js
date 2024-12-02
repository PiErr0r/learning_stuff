const fs = require('fs');
const { ASTPrinter } = require('./ast_printer');
const { Interpreter } = require('./interpreter');
const { Parser } = require('./parser');
const { Scanner } = require('./scanner');
const { Token } = require('./token');
const { TokenType } = require('./token_type');

let HAD_ERROR = false;
let HAD_RUNTIME_ERROR = false;

class JLOX {
	hadError = false;
	constructor(argv) {
		// no arguments -> REPL
		if (argv.length === 1) {
			this.runPrompt();
		// one argument -> filename
		} else if (argv.length === 2) {
			this.runFile(argv[1]);
		// error, print usage
		} else {
			process.stdout.write("Usage: node jlox [script]\n");
		}
	}

	runPrompt() {
		// create stream reader
		const readline = require('readline').createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		readline.prompt(); // show >
		readline.on('line', (line) => {
			this.run(line);
			// no error in new line in REPL
			HAD_ERROR = false;
			HAD_RUNTIME_ERROR = false;
			readline.prompt(); // show >
		});
	}

	runFile(filename) {
		try {
			const data = fs.readFileSync(filename, 'utf8');
			this.run(data);
			if (HAD_ERROR) process.exit(65);
			if (HAD_RUNTIME_ERROR) process.exit(70);
		} catch (err) { // file not found or couldn't be opened
			console.error(err);
			process.exit(1);
		}
	}

	run(data) {
		const scanner = new Scanner(data);
		const tokens = scanner.scanTokens();
		const parser = new Parser(tokens);
		let expr = parser.parse();
		if (HAD_ERROR) return;
		if (HAD_RUNTIME_ERROR) return;
		// const ast = new ASTPrinter();
		// console.log(ast.print(expr));
		const interpreter = new Interpreter();
		interpreter.interpret(expr);
		console.log()
	}

	static runtimeError(op, message) {
		process.stdout.write(`${message}\n[line ${op.line}]`);
		HAD_RUNTIME_ERROR = true;
	}

	static error(_, message) {
		if (_ instanceof Token) {
			this.errorToken(_, message);
		} else {
			this.errorLine(_, message);
		}
	}

	static errorToken(token, message) {
		if (token.type === TokenType.EOF) {
			this.report(token.line, "at end", message);
		} else {
			this.report(token.line, `at '${token.lexeme}'`, message)
		}
	}

	static errorLine(line, message) {
		this.report(line, "", message);
	}

	static report(line, where, message) {
		process.stdout.write(`[line ${line}] Error ${where}: ${message}\n`);
		HAD_ERROR = true;
	}
}

// exports.JLOX = JLOX;
module.exports = { JLOX };
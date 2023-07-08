import fs from 'fs';
// AST
import { ASTPrinter } from '@/ast_printer';
import { Expr } from "@/ast/Expr";
import { Stmt } from "@/ast/Stmt";

import { Interpreter } from '@/interpreter';
import { Parser } from '@/parser';
import { Scanner } from '@/scanner';
import { Token } from '@/token';
import { TokenType } from '@/token_type';


let HAD_ERROR = false;
let HAD_RUNTIME_ERROR = false;

class JLOX {
	private interpreter = new Interpreter();
	constructor(argv: string[]) {
		// no arguments -> REPL
		if (argv.length === 1) {
			this.interpreter.setREPL(true);
			this.runPrompt();
		// one argument -> filename
		} else if (argv.length === 2) {
			this.runFile(argv[1]);
		// error, print usage
		} else {
			process.stdout.write("Usage: node jlox [script]\n");
		}
	}

	private runPrompt() {
		// create stream reader
		const readline = require('readline').createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		readline.prompt(); // show >
		readline.on('line', (line: string) => {
			this.run(line);
			// no error in new line in REPL
			HAD_ERROR = false;
			HAD_RUNTIME_ERROR = false;
			readline.prompt(); // show >
		});
	}

	private runFile(filename: string) {
		try {
			const data = fs.readFileSync(filename, 'utf8');
			this.run(data);
			if (HAD_ERROR) process.exit(65);
			if (HAD_RUNTIME_ERROR) process.exit(70);
		} catch (err) { // file not found or couldn't be opened
			process.stderr.write(`${(err as Error).message}\n`);
			process.exit(1);
		}
	}

	private run(data: string) {
		const scanner = new Scanner(data);
		const tokens = scanner.scanTokens();
		const parser = new Parser(tokens);
		const statements = parser.parse();

		if (HAD_ERROR) return;
		if (HAD_RUNTIME_ERROR) return;

		this.interpreter.interpret(statements);
	}

	static runtimeError(op: Token, message: string) {
		process.stdout.write(`[line ${op.line}] ${message}\n`);
		HAD_RUNTIME_ERROR = true;
	}

	static error(_: Token | number, message: string) {
		if (_ instanceof Token) {
			this.errorToken(_, message);
		} else {
			this.errorLine(_, message);
		}
	}

	static errorToken(token: Token, message: string) {
		if (token.type === TokenType.EOF) {
			this.report(token.line, "at end", message);
		} else {
			this.report(token.line, `at '${token.lexeme}'`, message)
		}
	}

	static errorLine(line: number, message: string) {
		this.report(line, "", message);
	}

	static report(line: number, where: string, message: string) {
		process.stdout.write(`[line ${line}] Error ${where}: ${message}\n`);
		HAD_ERROR = true;
	}
}

export { JLOX };
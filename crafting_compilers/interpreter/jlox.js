const fs = require('fs');
const { Scanner } = require('./scanner');

let HAD_ERROR = false;

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
			readline.prompt(); // show >
		});
	}

	runFile(filename) {
		try {
			const data = fs.readFileSync(filename, 'utf8');
			this.run(data);
			if (HAD_ERROR) {
				process.exit(65);
			}
		} catch (err) { // file not found or couldn't be opened
			console.error(err);
			process.exit(1);
		}
	}

	run(data) {
		const scanner = new Scanner(data);
		const tokens = scanner.scanTokens();
		tokens.forEach(token => {
			console.log(token);
		});
	}

	static error(line, message) {
		this.report(line, "", message);
	}

	static report(line, where, message) {
		process.stdout.write(`[line ${line}] Error ${where}: ${message}\n`);
		HAD_ERROR = true;
	}
}

exports.JLOX = JLOX;
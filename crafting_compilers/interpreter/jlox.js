
const runPrompt = () => {
	process.stdout.write("> ");
}

const runFile = (filename) => {
	process.stdout.write(filename)
}

const main = (argv) => {
	if (argv.length === 1) {
		runPrompt();
	} else if (argv.length === 2) {
		runFile(argv[1]);
	} else {
		process.stdout.write("Usage: node jlox [script]");
	}
}

main(process.argv.slice(1))
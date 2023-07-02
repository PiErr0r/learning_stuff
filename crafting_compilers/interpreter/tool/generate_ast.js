const fs = require('fs');
const path = require('path');

const ensureDirectoryExistence = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    return;
  }
  fs.mkdirSync(dirname);
}

const defineType = (S, baseName, className, fields) => {
	// TODO
}

const defineAst = (outDir, baseName, types) => {
	ensureDirectoryExistence(outDir);
	const fileName = `${outDir}/${baseName}.js`;

	let S = [];
	S.push(`class ${baseName} {`);

	types.forEach(type => {
		const [className, fields] = type.split(':').map(s => s.trim());
		defineType(S, baseName, className, fields);
	})

	S.push("}");
	S.push(`module.exports = { ${baseName} }`);

	fs.writeFileSync(fileName, S.join('\n'));
}

const main = (argv) => {
	if (argv.length !== 2) {
		process.stdout.write("Usage: node generate_ast <output_directory>\n");
		process.exit(64);
	}

	const outDir = argv[1];

	defineAst(
		outDir,
		"Expr",
		[
			"Binary:   Expr left, Token operator, Expr right",
			"Grouping: Expr expression",
			"Literal:  Object value",
			"Unary:    Token operator, Expr right",
		]);
}

main(process.argv.slice(1))
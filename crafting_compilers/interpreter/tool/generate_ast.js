const fs = require('fs');
const path = require('path');

const ensureDirectoryExistence = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    return;
  }
  fs.mkdirSync(dirname);
}

const defineType = (S, baseName, className, fields) => {
	const C = [''];
	S.push(''); // newline
	S.push(`class ${className} extends ${baseName} {`);
	
	// constructor
	const Fc = [], Fb = []; // fields as parameters and fields in constructor block
	fields.forEach(f => {
		const [type, field] = f.split(' ');
		Fc.push(`/*${type}*/ ${field}`);
		Fb.push(`this.${field} = ${field}; // ${type}`);
	});
	S.push(`  constructor(${Fc.join(', ')}) {`)
	S.push('    super();')
	Fb.forEach(f => {
		S.push('    ' + f);
	});
	S.push('  }');

	// accept method
	S.push('  accept(visitor) {')
	S.push(`    return visitor.visit${className}${baseName}(this);`)
	S.push('  }')

	S.push('}');
	S.push(''); // newline
}

const defineVisitor = (S, baseName, types) => {
	S.push(''); // newline
	S.push(`class ${baseName}Visitor {`);
	// methods
	types.forEach(t => {
		const typename = t.split(':')[0];
		S.push(`  visit${typename}${baseName}(${baseName.toLowerCase()}) {};`);
	})
	S.push('}');
	S.push(''); // newline
}

const defineAst = (outDir, baseName, types) => {
	ensureDirectoryExistence(outDir);
	const fileName = `${outDir}/${baseName}.js`;

	const S = [], E = [];
	S.push(`class ${baseName} {`);
	S.push('  accept(visitor) {console.error("Called on main class! Not implemented")};');
	S.push('}');
	E.push(baseName, `${baseName}Visitor`)

	defineVisitor(S, baseName, types)

	types.forEach(type => {
		const [className, fields] = type.split(':').map(s => s.trim());
		defineType(S, baseName, className, fields.split(',').map(f => f.trim()));
		E.push(className);
	})

	S.push(`module.exports = {\n  ${E.join('\n, ')}\n};`);

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
			"Ternary:  Expr condition, Expr resTrue, Expr resFalse",
			"Binary:   Expr left, Token operator, Expr right",
			"Grouping: Expr expression",
			"Literal:  Object value",
			"Unary:    Token operator, Expr right",
		]);
}

main(process.argv.slice(1))
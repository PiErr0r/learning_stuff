const fs = require('fs');
const path = require('path');

const ensureDirectoryExistence = (dirPath: string) => {
  if (fs.existsSync(dirPath)) {
    return;
  }
  fs.mkdirSync(dirPath);
}

const defineType = (S: string[], baseName: string, className: string, fields: string[]) => {
	const C: string[] = [''];
	S.push(''); // newline
	S.push(`class ${baseName}${className} extends ${baseName} {`);
	
	// constructor
	const Fc = [], Fb = []; // fields as parameters and fields in constructor block
	fields.forEach((f: string) => {
		const [type, field] = f.split(' ');
		Fc.push(`${field}: ${type}`);
		Fb.push(`this.${field} = ${field};`);
		S.push(`  ${field}: ${type};`)
	});
	S.push(`  constructor(${Fc.join(', ')}) {`)
	S.push('    super();')
	Fb.forEach(f => {
		S.push('    ' + f);
	});
	S.push('  }');

	// accept method
	S.push(`  accept(visitor: ${baseName}Visitor): Literal {`);
	S.push(`    return visitor.visit${className}${baseName}(this);`);
	S.push('  }');

	S.push('}');
	S.push(''); // newline
}

const defineVisitor = (S: string[], baseName: string, types: string[]) => {
	S.push(''); // newline
	S.push(`interface ${baseName}Visitor {`);
	// methods
	types.forEach(t => {
		const typename = t.split(':')[0];
		S.push(`  visit${typename}${baseName}: (${baseName.toLowerCase()}: ${baseName}${typename}) => Literal;`);
	})
	S.push('}');
	S.push(''); // newline
}

const defineAst = (outDir: string, baseName: string, types: string[]) => {
	ensureDirectoryExistence(outDir);
	const fileName = `${outDir}/${baseName}.ts`;

	const S: string[] = [], E: string[] = [];
	S.push('import { Literal } from "@/token_type"');
	S.push('import { Token } from "@/token"');
	S.push(''); // newline
	defineVisitor(S, baseName, types)
	S.push(`class ${baseName} {`);
	S.push(`  accept(visitor: ${baseName}Visitor): Literal {\nconsole.error("Called on main class! Not implemented");\nreturn null;\n};`);
	S.push('}');

	E.push(baseName, `${baseName}Visitor`)

	types.forEach(type => {
		const [className, fields] = type.split(':').map(s => s.trim());
		defineType(S, baseName, className, fields.split(',').map(f => f.trim()));
		// E.push(className);
		E.push(`${baseName}${className}`);
	});

	S.push('') // newline
	S.push(`class ${baseName}Error extends ${baseName} {};`);
	S.push('') // newline
	E.push(`${baseName}Error`);

	S.push(`export {\n  ${E.join('\n, ')}\n};`);

	fs.writeFileSync(fileName, S.join('\n'));
}

const main = (argv: string[]) => {
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
			"Literal:  Literal value",
			"Unary:    Token operator, Expr right",
		]);
}

main(process.argv.slice(1))
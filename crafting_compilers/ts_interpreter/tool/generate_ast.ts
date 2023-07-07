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
	S.push(`  accept<T>(visitor: ${baseName}Visitor<T>): T {`);
	S.push(`    return visitor.visit${className}${baseName}(this);`);
	S.push('  }');

	S.push('}');
	S.push(''); // newline
}

const defineVisitor = (S: string[], baseName: string, types: string[]) => {
	S.push(''); // newline
	S.push(`interface ${baseName}Visitor<T> {`);
	// methods
	types.forEach(t => {
		const typename = t.split(':')[0];
		S.push(`  visit${typename}${baseName}: (${baseName.toLowerCase()}: ${baseName}${typename}) => T;`);
	})
	S.push('}');
	S.push(''); // newline
}

const defineAst = (outDir: string, baseName: string, types: string[], imports: string[]) => {
	ensureDirectoryExistence(outDir);
	const fileName = `${outDir}/${baseName}.ts`;

	const S: string[] = [], E: string[] = [];
	imports.forEach((i: string) => {
		const [what, from] = i.split(':')
		S.push(`import { ${what} } from "@/${from}"`);
	});
	S.push(''); // newline
	defineVisitor(S, baseName, types)
	S.push(`abstract class ${baseName} {`);
	S.push(`  abstract accept<T>(visitor: ${baseName}Visitor<T>): T;`);
	S.push('}');

	E.push(baseName, `${baseName}Visitor`)

	types.forEach(type => {
		const [className, fields] = type.split(':').map(s => s.trim());
		defineType(S, baseName, className, fields.length ? fields.split(',').map(f => f.trim()) : []);
		// E.push(className);
		E.push(`${baseName}${className}`);
	});

	S.push('') // newline
	// S.push(`class ${baseName}Error extends ${baseName} { accept<null> (visitor: ${baseName}Visitor<null>): null { return null; } };`);
	// S.push('') // newline
	// E.push(`${baseName}Error`);

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
			"Assign:   Token name, Expr value",
			"Binary:   Expr left, Token operator, Expr right",
			"Grouping: Expr expression",
			"Literal:  Literal value",
			"Ternary:  Expr condition, Expr resTrue, Expr resFalse",
			"Unary:    Token operator, Expr right",
			"Variable: Token name",
			"Error:",
		], [
			"Token:token",
			"Literal:token_type"
		]);

	defineAst(
		outDir,
		"Stmt",
		[
			"Block:       Stmt[] statements",
			"Expression:  Expr expression",
			"Print:       Expr expression",
			"Var:         Token name, Expr initializer, boolean isInitialized",
			"Error:",
		], [
			"Expr:ast/Expr",
			"Token:token"
		]);
}

main(process.argv.slice(1))
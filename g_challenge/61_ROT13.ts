import * as fs from 'fs';

const filename:string = './input';
const a:number = 'a'.charCodeAt(0);
const A:number = 'A'.charCodeAt(0);

fs.readFile(filename, 'utf8', (err, data) => {
	if (err) {
		throw new Error(`Error ${err} while reading file ${filename}`);
	}
	printCaesarSolutions(data);
})

const printCaesarSolutions = (data:string):void => {
	const rows:string[] = data.split('\n');
	if (rows.length === 0) {
		console.log("Empty input file");
		return;
	}
	const isRot:boolean = rows[0].indexOf('-r') !== -1;

	if (isRot) {
		console.log("ROT13");
		console.log(solveCaesar(rows.slice(1), 13));
	} else {
		for (let i = 1; i < 26; ++i) {
			console.log(`Caesar by ${i}`);
			console.log(solveCaesar(rows, i));
		}
	}
}

const solveCaesar = (data:string[], rotBy:number):string => {
	return data
		.filter(r => r.trim().length !== 0)
		.map(r => r.split("")
			.map(c => 
				c.trim().length === 0 ? 
					c : 
					String.fromCharCode((((c.charCodeAt(0) - ('a' <= c && c <= 'z' ? a : A)) + rotBy) % 26) + ('a' <= c && c <= 'z' ? a : A))
			).join('')
		).join("\n");
}
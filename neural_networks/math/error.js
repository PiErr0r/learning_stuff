function logName(name) {
	console.error(`[ERROR] ${name}.`);
}

function IsVectorException(txt, val) {
	logName(arguments.callee.name);
	throw new Error(`dot(a, b): ${txt} is not a vector! ${txt} = ${val}`);
}

function VectorLengthException(a, b) {
	logName(arguments.callee.name);
	throw new Error(`dot(a, b): length of a (${a.length}) doesn't match length of b (${b.length})`);
}
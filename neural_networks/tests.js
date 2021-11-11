const testData = require('./testData');
const math = require('./math');

const testMath = () => {
	const m = "math";
	logModule(m);
	Object.keys(math).forEach(k => {
		logFn(k);
		testData[m][k].forEach(({ data, result }, i) => {
			logTest(i);
			const res = math[k](...data);
			if (res === result) {
				console.log('\x1b[32m%s\x1b[0m', "Success");
			} else {
				console.log('\x1b[41m%s\x1b[0m', 'Failed!', `k(${data}) === ${res}, expected ${result}\n\n`);
				process.exit(1);
			}
		})
	})
}

function logModule(m) { process.stdout.write("#############  " + m + "  #############\n\n"); }
function logFn(f) { process.stdout.write("--- Testing " + f + ":\n"); }
function logTest(i) { process.stdout.write(`Test #${i}: `); }

const main = () => {
	testMath();
	process.stdout.write("\n\nAll tests passed successfully!\n");
}

main();
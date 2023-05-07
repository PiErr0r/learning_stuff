const { JLOX } = require('./jlox.js');


const main = () => {
	new JLOX(process.argv.slice(1))
}

main();
/*

test

*/
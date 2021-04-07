const A = require('arcsecond');
const { data8, data16 } = require('./data');
const { label } = require('./common');
const constant = require('./constant');
const instructionParser = require('./instructions');

//module.exports = A.many(instructionParser);

module.exports = A.many(A.choice([
	constant,
	data8,
	data16,
	instructionParser,
	label,
])).chain(res => A.endOfInput.map(() => res));
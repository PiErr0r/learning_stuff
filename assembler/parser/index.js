const A = require('arcsecond');
const { label } = require('./common');
const instructionParser = require('./instructions');

//module.exports = A.many(instructionParser);

module.exports = A.many(A.choice([
	label,
	instructionParser,
]));
const A = require('arcsecond');
const {
	commaSeparated,
	hexLiteral,
	validIdentifier,
} = require('./common');
const T = require('./types');

const interpretAs = A.coroutine(function* () {
  yield A.char('<');
  const structure = yield validIdentifier;
  yield A.char('>');

  yield A.optionalWhitespace;
  const symbol = yield validIdentifier;
  yield A.char('.');
  const property = yield validIdentifier;
  yield A.optionalWhitespace;

  return T.interpret_as({
    structure,
    symbol,
    property
  });
});

module.exports = interpretAs;
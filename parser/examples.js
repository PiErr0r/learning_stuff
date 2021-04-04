const betweenBrackets = between(str('('), str(')'))
const parser = betweenBrackets(letters);

const stringResult = { type: "string", value: "hello" };
const numberResult = { type: "number", value: 42 };
const dicerollResult = { type: 'diceroll', value: [2, 8] };

const stringParser = letters.map(result => ({
	type: 'string',
	value: result
}));

const numberParser = digits.map(result => ({
	type: 'number',
	value: Number(result)
}));

const dicerollParser = sequenceOf([
	digits,
	str('d'),
	digits
]).map(([n, _, s]) => ({
	type: 'diceroll',
	value: [Number(n), Number(s)]
}));

const parser = sequenceOf([ letters, str(':') ])
	.map(result => result[0])
	.chain(type => {
		if (type === 'string') 				return stringParser;
		else if (type === 'number') 	return numberParser;
		else if (type === 'diceroll') return dicerollParser;
	})

console.log(
	parser.run('diceroll:12d20')
)
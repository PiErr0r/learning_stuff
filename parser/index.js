const updateParserState = (state, index, result) => ({
	...state,
	index,
	result
});

const updateParserResult = (state, result) => ({
	...state,
	result
});

const updateParserError = (state, errorMsg) => ({
	...state,
	isError: true,
	error: errorMsg
});

class Parser {
	constructor(parserStateTransformerFn) {
		this.parserStateTransformerFn = parserStateTransformerFn;
	}

	run(targetString) {
		const initialState = {
			targetString,
			index: 0,
			result: null,
			isError: false,
			error: null
		}
		console.log(typeof this.parserStateTransformerFn)
		return this.parserStateTransformerFn(initialState);	
	}

	map(fn) {
		return new Parser(parserState => {
			const nextState = this.parserStateTransformerFn(parserState);

			if (nextState.isError) return nextState; 

			return updateParserResult(nextState, fn(nextState.result));
		});
	}

	errorMap(fn) {
		return new Parser(parserState => {
			const nextState = this.parserStateTransformerFn(parserState);
			
			if (!nextState.isError) return nextState; 

			return updateParserError(nextState, fn(nextState.error, nextState.index));
		});
	}
}

const str = s => new Parser(parserState => {
	const {
		targetString,
		index,
		isError
	} = parserState;

	if (isError) {
		return parserState;
	}

	const slicedTarget = targetString.slice(index);

	if (slicedTarget.length === 0) {
		return updateParserError(
			parserState, 
			`str: Tried to match ${s}, but got Unexpected end of input`
		);
	}

	if (slicedTarget.startsWith(s)) {
		return updateParserState(parserState, index + s.length, s);
	}

	return updateParserError(
		parserState, 
		`str: Tried to match ${s}, but got ${targetString.slice(index, index + 10)}`
	);
});

const lettersRegex = /^[A-Za-z]+/;
const letters = new Parser(parserState => {
	const {
		targetString,
		index,
		isError
	} = parserState;

	if (isError) {
		return parserState;
	}

	const slicedTarget = targetString.slice(index);

	if (slicedTarget.length === 0) {
		return updateParserError(
			parserState, 
			`letters: Got Unexpected end of input`
		);
	}

	const regexMatch = slicedTarget.match(lettersRegex);

	if (regexMatch) {
		return updateParserState(parserState, index + regexMatch[0].length, regexMatch[0]);
	}

	return updateParserError(
		parserState, 
		`letters: Couldn't match any letters at index ${index}`
	);
});

const digitsRegex = /^[0-9]+/;
const digits = new Parser(parserState => {
	const {
		targetString,
		index,
		isError
	} = parserState;

	if (isError) {
		return parserState;
	}

	const slicedTarget = targetString.slice(index);

	if (slicedTarget.length === 0) {
		return updateParserError(
			parserState, 
			`digits: Got Unexpected end of input`
		);
	}

	const regexMatch = slicedTarget.match(digitsRegex);

	if (regexMatch) {
		return updateParserState(parserState, index + regexMatch[0].length, regexMatch[0]);
	}

	return updateParserError(
		parserState, 
		`digits: Couldn't match any digits at index ${index}`
	);
});

const sequenceOf = parsers => new Parser(parserState => {
	if (parserState.isError) {
		return parserState;
	}

	const results = [];
	let nextState = parserState;

	for (let p of parsers) {
		nextState = p.parserStateTransformerFn(nextState);
		results.push(nextState.result);
	}

	return updateParserResult(nextState, results);
});

const choice = parsers => new Parser(parserState => {
	if (parserState.isError) {
		return parserState;
	}

	for (let p of parsers) {
		const nextState = p.parserStateTransformerFn(parserState);
		if (!nextState.isError) {
			return nextState;
		}
	}

	return updateParserError(
		parserState, 
		`choice: Unable to match any parser at index ${parserState.index}`
	);
});

const many = parser => new Parser(parserState => {
	if (parserState.isError) {
		return parserState;
	}

	const results = [];
	let done = false;
	let nextState = parserState;

	while (!done) {
		const tmpState = parser.parserStateTransformerFn(nextState);
		if (!tmpState.isError) {
			results.push(tmpState.result);
			nextState = tmpState;
		} else {
			done = true;
		}
	}

	return updateParserResult(nextState, results);
});

const many1 = parser => new Parser(parserState => {
	if (parserState.isError) {
		return parserState;
	}

	const results = [];
	let done = false;
	let nextState = parserState;

	while (!done) {
		nextState = parser.parserStateTransformerFn(nextState);
		if (!nextState.isError) {
			results.push(nextState.result);
		} else {
			done = true;
		}
	}

	if (results.length === 0) {
		return updateParserError(
			parserState,
			`many1: Unable to match any input using parser at index ${parserState.index}`
		);
	}

	return updateParserResult(nextState, results);
});

//const parser = sequenceOf([
//	//str('hello there!'),
////	str('goodbye there!')
//	letters,
//	digits,
//	letters
//]);

const parser = many(choice([
	letters,
	digits
]))

//const parser = str('hello').map(r => r.toUpperCase());
//const parser = letters;

//const pars = new Parser(parser);

console.log(
	parser.run('12oasd12')
)
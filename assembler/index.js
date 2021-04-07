const instructions = require('../instructions');
const parser = require('./parser');
const registerNames = require('../registers');
const { instructionTypes: I } = require('../instructions/meta');

const registerMap = registerNames.reduce((map, r, i) => Object.assign(map, { [r]: i }), {});

const program = `
constant code_constant = $C0DE

+data8 bytes = { $01, $02, $03, $04 }
data16 words = { $0506, $0708, $0809, $0A0B }

code:
	mov [!code_constant], &1234

end:
	hlt
`.trim();

const parsedOutput = parser.run(program);
console.log(parsedOutput)
const machineCode = [];
const symbolicNames = {};
let currAddress = 0;

const encodeLitOrMem = lit => {
	let hexVal;
	if (lit.type === 'VARIABLE') {
		if (!(lit.value in symbolicNames)) {
			throw new Error(`label ${lit.value} wasn't resolved`);
		}
		hexVal = symbolicNames[lit.value];
	} else {
		hexVal = parseInt(lit.value, 16);
	}
	const highByte = (hexVal & 0xff00) >> 8;
	const lowByte = (hexVal & 0x00ff);
	machineCode.push(highByte, lowByte);
}

const encodeLit8 = lit => {
	let hexVal;
	if (lit.type === 'VARIABLE') {
		if (!(lit.value in symbolicNames)) {
			throw new Error(`label ${lit.value} wasn't resolved`);
		}
		hexVal = symbolicNames[lit.value];
	} else {
		hexVal = parseInt(lit.value, 16);
	}
	const lowByte = (hexVal & 0x00ff);
	machineCode.push(lowByte);
}

const encodeReg = reg => {
	const mappedReg = registerMap[reg.value];
	machineCode.push(mappedReg);
}

const encodeData8 = node => {
	for (let byte of node.value.values) {
		const parsed = parseInt(byte.value, 16);
		machineCode.push(parsed & 0xff);
	}
}

const encodeData16 = node => {
	for (let byte of node.value.values) {
		const parsed = parseInt(byte.value, 16);
		machineCode.push((parsed & 0xff00) >> 8);
		machineCode.push(parsed & 0xff);
	}
}

parsedOutput.result.forEach(node => {
	switch (node.type) {
		case 'LABEL':
			symbolicNames[node.value] = currAddress;
			break;
		case 'DATA': {
			symbolicNames[node.value.name] = currAddress;
			const sizeOfEachValueInBytes = node.value.size === 16 ? 2 : 1;
			const totalSizeOfValuesInBytes = node.value.values.length * sizeOfEachValueInBytes;
			currAddress += totalSizeOfValuesInBytes;
			break;
		}
		case 'CONSTANT': {
			symbolicNames[node.value.name] = parseInt(node.value.value.value, 16) & 0xffff;
			break;
		}
		default:
			const metadata = instructions[node.value.instruction];
			currAddress += metadata.size;
			break;
	}
});

parsedOutput.result.forEach(node => {
	if (node.type === 'LABEL' || node.type === 'CONSTANT') {
		return;
	}

	if (node.type === 'DATA') {
		if (node.value.size === 8) {
			encodeData8(node);
		} else {
			encodeData16(node);
		}
		return;
	}

	const metadata = instructions[node.value.instruction];
	machineCode.push(metadata.opcode);

	if ([I.litReg, I.memReg].includes(metadata.type)) {
		encodeLitOrMem(node.value.args[0]);
		encodeReg(node.value.args[1]);
	}
	if ([I.regLit, I.regMem].includes(metadata.type)) {
		encodeReg(node.value.args[0]);	
		encodeLitOrMem(node.value.args[1]);
	}
	if (I.regLit8 === metadata.type) {
		encodeReg(node.value.args[0]);	
		encodeLit8(node.value.args[1]);	
	}
	if ([I.regReg, I.regPtrReg].includes(metadata.type)) {
		encodeReg(node.value.args[0]);	
		encodeReg(node.value.args[1]);	
	}
	if (I.litMem === metadata.type) {
		encodeLitOrMem(node.value.args[0]);
		encodeLitOrMem(node.value.args[1]);	
	}
	if (I.litOffReg === metadata.type) {
		encodeLitOrMem(node.value.args[0]);
		encodeReg(node.value.args[1]);	
		encodeReg(node.value.args[2]);	
	}
	if (I.singleReg === metadata.type) {
		encodeReg(node.value.args[0]);	
	}
	if (I.singleLit === metadata.type) {
		encodeLitOrMem(node.value.args[0]);
	}
})

console.log(machineCode.map(x => '0x' + x.toString(16).padStart('0', 2)).join(','));
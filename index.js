const readline = require('readline');

const CPU = require('./cpu');
const createMemory = require('./createMemory');
const createScreenDevice = require('./screenDevice');
const instructions = require('./instructions');
const MemoryMapper = require('./memoryMapper');

const MM = new MemoryMapper();

const dataViewMethods = [
	'getUint8',
	'getUint16',
	'setUint8',
	'setUint16'
];

const createBankedMemory = (n, bankSize, cpu) => {
	const bankBuffers = Array.from({ length: n }, () => new ArrayBuffer(bankSize));
	const banks = bankBuffers.map(ab => new DataView(ab));

	const forwardToDataView = name => (...args) => {
		const bankIndex = cpu.getRegister('mb') % n;
		const memoryBankToUse = banks[bankIndex];
		return memoryBankToUse[name](...args);
	}

	const interface = dataViewMethods.reduce((dvOut, fnName) => {
		dvOut[fnName] = forwardToDataView(fnName);
		return dvOut;
	}, {});

	return interface;
}

const bankSize = 0xff;
const nBanks = 8;
const cpu = new CPU(MM);

const memoryBankDevice = createBankedMemory(nBanks, bankSize, cpu);
MM.map(memoryBankDevice, 0, bankSize);

const regularMemory = createMemory(0xff00);
MM.map(regularMemory, bankSize, 0xffff, true);

console.log('write 1 to address 0');
MM.setUint16(0, 1);
console.log('reading value @ address 0:', MM.getUint16(0));

console.log('\n:::switching memory bank (0 -> 1)');
cpu.setRegister('mb', 1);
console.log('reading value @ address 0:', MM.getUint16(0));

console.log('write 42 to address 0');
MM.setUint16(0, 42);

console.log('\n:::switching memory bank (1 -> 2)');
cpu.setRegister('mb', 2);
console.log('reading value @ address 0:', MM.getUint16(0));

console.log('\n:::switching memory bank (2 -> 1)');
cpu.setRegister('mb', 1);
console.log('reading value @ address 0:', MM.getUint16(0));

console.log('\n:::switching memory bank (1 -> 0)');
cpu.setRegister('mb', 0);
console.log('reading value @ address 0:', MM.getUint16(0));

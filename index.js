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

const writeableBytes = new Uint8Array(regularMemory.buffer);
let i = 0;
[0x10,0x0,0x1,0x2,0x10,0x0,0x2,0x3,0x17,0x0,0x3,0xfd,0x0,0x3,0x10,0x0,0x1,0x4,0x26,0x4,0x0,0x3,0x34,0x4,0x2f,0xd,0x1,0x11,0x1,0xd,0xfd,0x0,0x3,0x10,0x0,0x5,0x6,0xff].forEach(x => {
	writeableBytes[i++] = x;
})

cpu.run((halt) => { cpu.debug(); cpu.viewMemoryAt(cpu.getRegister('ip')) });
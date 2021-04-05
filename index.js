const readline = require('readline');

const CPU = require('./cpu');
const createMemory = require('./createMemory');
const createScreenDevice = require('./screenDevice');
const instructions = require('./instructions');
const MemoryMapper = require('./memoryMapper');

const MM = new MemoryMapper();
const memory = createMemory(256 * 256);
MM.map(memory, 0x0, 0xffff);
MM.map(createScreenDevice(), 0x3000, 0x30ff, true);
const cpu = new CPU(MM);
const writeableBytes = new Uint8Array(memory.buffer);

const IP = 0;
const ACC = 1;
const R1 = 2;
const R2 = 3;
const R3 = 4;
const R4 = 5;
const R5 = 6;
const R6 = 7;
const R7 = 8;
const R8 = 9;
const SP = 10;
const FP = 11;

let i = 0;
let boldPos = 5;
let boldLen = 10;

const writeCharToScreen = (char, command, position) => {

	writeableBytes[i++] = instructions.MOV_LIT_REG;
	writeableBytes[i++] = command;
	writeableBytes[i++] = char.charCodeAt(0);
	writeableBytes[i++] = R1;

	writeableBytes[i++] = instructions.MOV_REG_MEM;
	writeableBytes[i++] = R1;
	writeableBytes[i++] = 0x30;
	writeableBytes[i++] = position;

}

//"Hello world!".split('').forEach((c, i) => writeCharToScreen(c, i));

//writeCharToScreen(' ', 0xff, 0);
//for (let i = 0; i <= 0xff; ++i) {
//	const command = i % 2 === 0
//		?	0x01
//		: 0xfe;
//	writeCharToScreen('*', command, i);
//}

[0x10,0x42,0x00,0x02,0x12,0x02,0x00,0x60,0x10,0x13,0x00,0x02,0x13,0x00,0x60,0x03,0x1c,0x02,0x03,0xff].forEach(x => {writeableBytes[i++] = x});

//writeableBytes[i++] = instructions.HLT.opcode;

cpu.run(true);

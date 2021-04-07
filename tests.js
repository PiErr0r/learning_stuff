const readline = require('readline');
const createMemory = require('./createMemory');
const CPU = require('./cpu');
const instructions = require('./instructions');

const memory = createMemory(256 * 256);
const cpu = new CPU(memory);
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
const START = 0x00;
const MEM1 = 0x01;
const MEM2 = 0x00

const MY_SUBROUTINE = 0x3000

writeableBytes[i++] = instructions.PSH_LIT;
writeableBytes[i++] = 0x33;
writeableBytes[i++] = 0x33;

writeableBytes[i++] = instructions.PSH_LIT;
writeableBytes[i++] = 0x22;
writeableBytes[i++] = 0x22;

writeableBytes[i++] = instructions.PSH_LIT;
writeableBytes[i++] = 0x11;
writeableBytes[i++] = 0x11;

writeableBytes[i++] = instructions.MOV_LIT_REG;
writeableBytes[i++] = 0x12;
writeableBytes[i++] = 0x34;
writeableBytes[i++] = R1;

writeableBytes[i++] = instructions.MOV_LIT_REG;
writeableBytes[i++] = 0x56;
writeableBytes[i++] = 0x78;
writeableBytes[i++] = R4;

writeableBytes[i++] = instructions.PSH_LIT;
writeableBytes[i++] = 0x00;
writeableBytes[i++] = 0x00;

writeableBytes[i++] = instructions.CAL_LIT;
writeableBytes[i++] = (MY_SUBROUTINE & 0xFF00) >> 8;
writeableBytes[i++] = (MY_SUBROUTINE & 0x00FF);

writeableBytes[i++] = instructions.PSH_LIT;
writeableBytes[i++] = 0x44;
writeableBytes[i++] = 0x44;

i = MY_SUBROUTINE;
writeableBytes[i++] = instructions.PSH_LIT;
writeableBytes[i++] = 0x01;
writeableBytes[i++] = 0x02;

writeableBytes[i++] = instructions.PSH_LIT;
writeableBytes[i++] = 0x03;
writeableBytes[i++] = 0x04;

writeableBytes[i++] = instructions.PSH_LIT;
writeableBytes[i++] = 0x05;
writeableBytes[i++] = 0x06;

writeableBytes[i++] = instructions.MOV_LIT_REG;
writeableBytes[i++] = 0x07;
writeableBytes[i++] = 0x08;
writeableBytes[i++] = R1;

writeableBytes[i++] = instructions.MOV_LIT_REG;
writeableBytes[i++] = 0x09;
writeableBytes[i++] = 0x0A;
writeableBytes[i++] = R8;

writeableBytes[i++] = instructions.RET;


cpu.debug();
cpu.viewMemoryAt(cpu.getRegister('ip'));
cpu.viewMemoryAt(0xffff - 1 - 42, 44);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('line', () => {
	cpu.step();
	cpu.debug();
	cpu.viewMemoryAt(cpu.getRegister('ip'));
	cpu.viewMemoryAt(0xffff - 1 - 42, 44);
})

/* episode 12 */

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

//[0x10,0x42,0x00,0x02,0x12,0x02,0x00,0x60,0x10,0x13,0x00,0x02,0x13,0x00,0x60,0x03,0x1c,0x02,0x03,0xff].forEach(x => {writeableBytes[i++] = x});
//[0x14,0x0,0xa,0x0,0x50,0x13,0x0,0x50,0x1,0x36,0x1,0x12,0x1,0x0,0x50,0x35,0x3,0x35,0x3,0x35,0x3,0xff].forEach(x => {writeableBytes[i++] = x});
[0x14,0x0,0xa,0x0,0x50,0x13,0x0,0x50,0x1,0x36,0x1,0x12,0x1,0x0,0x50,0x35,0x3,0x35,0x3,0x35,0x3,0x41,0x0,0x0,0x0,0x5,0xff].forEach(x => {writeableBytes[i++] = x});
//writeableBytes[i++] = instructions.HLT.opcode;

cpu.run((halt) => { halt ? cpu.debug() : cpu.viewMemoryAt(0x50); });

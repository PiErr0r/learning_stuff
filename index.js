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

let i = 0;
const START = 0x00;
const MEM1 = 0x01;
const MEM2 = 0x00

writeableBytes[i++] = instructions.MOV_MEM_REG;
writeableBytes[i++] = 0x01;
writeableBytes[i++] = 0x00;
writeableBytes[i++] = R1;

writeableBytes[i++] = instructions.MOV_LIT_REG;
writeableBytes[i++] = 0x00;
writeableBytes[i++] = 0x01;
writeableBytes[i++] = R2;

writeableBytes[i++] = instructions.ADD_REG_REG;
writeableBytes[i++] = R1;
writeableBytes[i++] = R2;

writeableBytes[i++] = instructions.MOV_REG_MEM;
writeableBytes[i++] = ACC;
writeableBytes[i++] = 0x01;
writeableBytes[i++] = 0x00;

writeableBytes[i++] = instructions.JMP_NOT_EQ;
writeableBytes[i++] = 0x00;
writeableBytes[i++] = 0x03;
writeableBytes[i++] = 0x00;
writeableBytes[i++] = 0x00;

cpu.debug();
cpu.viewMemoryAt(cpu.getRegister('ip'));
cpu.viewMemoryAt(0x0100);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('line', () => {
	cpu.step();
	cpu.debug();
	cpu.viewMemoryAt(cpu.getRegister('ip'));
	cpu.viewMemoryAt(0x0100);
})
const createMemory = require('./createMemory');
const CPU = require('./cpu');
const instructions = require('./instructions');

const memory = createMemory(256);
const cpu = new CPU(memory);
const writeableBytes = new Uint8Array(memory.buffer);

writeableBytes[0] = instructions.MOV_LIT_R1;
writeableBytes[1] = 0x12;
writeableBytes[2] = 0x34;

writeableBytes[3] = instructions.MOV_LIT_R2;
writeableBytes[4] = 0xAB;
writeableBytes[5] = 0xCD;

writeableBytes[6] = instructions.ADD_REG_REG;
writeableBytes[7] = 2;
writeableBytes[8] = 3;

cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();

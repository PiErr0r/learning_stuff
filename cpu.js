const createMemory = require('./createMemory');
const instructions = require('./instructions');

class CPU {
  constructor(memory) {
    this.memory = memory;

    this.registerNames = [
      'ip', 'acc', // instruction pointer, accumulator
      'r1', 'r2', 'r3', 'r4', // general purpose registers
      'r5', 'r6', 'r7', 'r8'
    ];

    this.registers = createMemory(this.registerNames.length * 2); // every reg is 2 byte wide
    this.registerMap = this.registerNames.reduce((map, name, i) => {
      map[name] = i * 2;
      return map;
    }, {});
  }

  debug() {
    this.registerNames.forEach(name => {
      console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`)
    });
    console.log();
  }

  getRegister(name) {
    if (!(name in this.registerMap)) {
      throw new Error(`getRegister: No register found with name: '${name}'`);
    }

    return this.registers.getUint16(this.registerMap[name]);
  }

  setRegister(name, value) {
    if (!(name in this.registerMap)) {
      throw new Error(`setRegister: No register found with name '${name}'`);
    }

    this.registers.setUint16(this.registerMap[name], value);
  }

  fetch() {
    const nextInstructionAddress = this.getRegister('ip');
    const instruction = this.memory.getUint8(nextInstructionAddress);
    this.setRegister('ip', nextInstructionAddress + 1);
    return instruction;
  }

  fetch16() {
    const nextInstructionAddress = this.getRegister('ip');
    const instruction = this.memory.getUint16(nextInstructionAddress);
    this.setRegister('ip', nextInstructionAddress + 2);
    return instruction;
  }

  execute(instruction) {
    switch (instruction) {
      case instructions.MOV_LIT_R1: { // move literal to r1
        const value = this.fetch16();
        this.setRegister('r1', value);
        return;
      }
      case instructions.MOV_LIT_R2: { // move literal to r2
        const value = this.fetch16();
        this.setRegister('r2', value);
        return;
      }
      case instructions.ADD_REG_REG: { // add register to regiister
        const r1 = this.fetch();
        const r2 = this.fetch();
        const rValue1 = this.registers.getUint16(r1 * 2);
        const rValue2 = this.registers.getUint16(r2 * 2);
        this.setRegister('acc', rValue1 + rValue2);
        return;
      }
    }
  }

  step() {
    const instruction = this.fetch();
    return this.execute(instruction);
  }

}

module.exports = CPU;

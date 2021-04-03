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

    this.halted = false;
  }

  debug() {
    this.registerNames.forEach(name => {
      console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`)
    });
    console.log();
  }

  viewMemoryAt(address) {
    const nextEightBytes = Array.from({length: 8}, (_, i) => 
      this.memory.getUint8(address + i)
    ).map(v => `0x${v.toString(16).padStart(2, '0')}`);
    console.log(`0x${address.toString(16).padStart(4, '0')}: ${nextEightBytes.join(' ')}`);
  }

  viewRegisterValue(name) {
    if (!name in this.registerMap) {
      throw new Error(`viewRegisterValue: No register found with name: '${name}'`);
    }

    const value = this.getRegister(name);
    console.log(`${name}: ${value.toString(16).padStart(4, '0')}`);
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
      case instructions.END: {
        this.halt();
        return;
      }
      case instructions.MOV_LIT_REG: { // move literal to register
        const value = this.fetch16();
        const r = (this.fetch() % this.registerNames.length) * 2;
        this.registers.setUint16(r, value);
        return;
      }
      case instructions.MOV_REG_REG: { // move register to register
        const rFrom = (this.fetch() % this.registerNames.length) * 2;
        const rTo = (this.fetch() % this.registerNames.length) * 2;
        const value = this.registers.getUint16(rFrom);
        this.registers.setUint16(rTo, value);
        return;
      }
      case instructions.MOV_REG_MEM: { // move register to memory
        const rFrom = (this.fetch() % this.registerNames.length) * 2;
        const address = this.fetch16();
        const value = this.registers.getUint16(rFrom);
        this.memory.setUint16(address, value);
        return;
      }
      case instructions.MOV_MEM_REG: { // move memory to register
        const address = this.fetch16();
        const rTo = (this.fetch() % this.registerNames.length) * 2;
        const value = this.memory.getUint16(address);
        this.registers.setUint16(rTo, value);
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
      case instructions.JMP_NOT_EQ: { // jump if not equal
        const value = this.fetch16();
        const address = this.fetch16();
        if (value !== this.getRegister('acc')) {
          this.setRegister('ip', address);
        }
        return;
      }
      default: {
        throw new Error(`execute: instruction 0x${instruction.toString(16).padStart('0', 2)} is not recognized`)
        return;
      }
    }
  }

  step() {
    const instruction = this.fetch();
    return this.execute(instruction);
  }

  halt() {
    this.halted = true;
  }
}

module.exports = CPU;

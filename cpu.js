const createMemory = require('./createMemory');
const instructions = require('./instructions');

class CPU {
  constructor(memory) {
    this.memory = memory;

    this.registerNames = [
      'ip', 'acc', // instruction pointer, accumulator
      'r1', 'r2', 'r3', 'r4', // general purpose registers
      'r5', 'r6', 'r7', 'r8',
      'sp', 'fp'
    ];

    this.registers = createMemory(this.registerNames.length * 2); // every reg is 2 byte wide
    this.registerMap = this.registerNames.reduce((map, name, i) => {
      map[name] = i * 2;
      return map;
    }, {});

    this.halted = false;
    this.setRegister('sp', 0xFFFF - 1);
    this.setRegister('fp', 0xFFFF - 1);

    this.stackFrameSize = 0;
  }

  debug() {
    this.registerNames.forEach(name => {
      console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`)
    });
    console.log();
  }

  viewMemoryAt(address, n = 8) {
    const nextNBytes = Array.from({length: n}, (_, i) => 
      (address + i) < this.memory.byteLength ?
      this.memory.getUint8(address + i)
      : 0
    ).map(v => `0x${v.toString(16).padStart(2, '0')}`);
    console.log(`0x${address.toString(16).padStart(4, '0')}: ${nextNBytes.join(' ')}`);
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

  fetchRegisterIndex() {
    return (this.fetch() % this.registerNames.length) * 2;
  }

  push(value) {
    const spAddress = this.getRegister('sp');
    this.memory.setUint16(spAddress, value);
    this.setRegister('sp', spAddress - 2);
    this.stackFrameSize += 2;
  }

  pushState() {
    for (let i = 1; i <= 8; ++i) {
      this.push(this.getRegister(`r${i}`)); // push general registers
    }
    this.push(this.getRegister('ip'));
    this.push(this.stackFrameSize + 2); // +2 because sp will increase on push
    this.setRegister('fp', this.getRegister('sp'));
    this.stackFrameSize = 0;
  }

  pop() {
    const nextSpAddress = this.getRegister('sp') + 2;
    this.setRegister('sp', nextSpAddress);
    this.stackFrameSize -= 2;
    return this.memory.getUint16(nextSpAddress);
  }

  popState() {
    const framePointerAddress = this.getRegister('fp');
    this.setRegister('sp', framePointerAddress);
    const stackFrameSize = this.pop();
    this.stackFrameSize = stackFrameSize;
    this.setRegister('ip', this.pop());
    for (let i = 8; i >= 1; --i) {
      this.setRegister(`r${i}`, this.pop());
    }

    const nArgs = this.pop();
    for (let i = 0; i < nArgs; ++i) {
      this.pop();
    }

    this.setRegister('fp', framePointerAddress + stackFrameSize);
  }

  execute(instruction) {
    switch (instruction) {
      case instructions.NOP: {
        return;
      }
      case instructions.HLT: {
        return true;
      }

      /***********************
       * memory instructions *
       **********************/
      case instructions.MOV_LIT_REG: { // move literal to register
        const value = this.fetch16();
        const r = this.fetchRegisterIndex();
        this.registers.setUint16(r, value);
        return;
      }
      case instructions.MOV_REG_REG: { // move register to register
        const rFrom = this.fetchRegisterIndex();
        const rTo = this.fetchRegisterIndex();
        this.registers.setUint16(rTo, this.registers.getUint16(rFrom));
        return;
      }
      case instructions.MOV_REG_MEM: { // move register to memory
        const rFrom = this.fetchRegisterIndex();
        const address = this.fetch16();
        this.memory.setUint16(address, this.registers.getUint16(rFrom));
        return;
      }
      case instructions.MOV_MEM_REG: { // move memory to register
        const address = this.fetch16();
        const rTo = this.fetchRegisterIndex();
        this.registers.setUint16(rTo, this.memory.getUint16(address));
        return;
      }

      /**********************
       * stack instructions *
       *********************/
      case instructions.PSH_LIT: { // push literal
        const value = this.fetch16();
        this.push(value);
        return;
      }
      case instructions.PSH_REG: { // push register
        const r = this.fetchRegisterIndex();
        this.push(this.registers.getUint16(r));
        return;
      }
      case instructions.POP_REG: { // pop register
        const r = this.fetchRegisterIndex();
        const value = this.pop();
        this.registers.setUint16(r, value);
        return;
      }

      /*************************************
       * arithmetic and logic instructions *
       *************************************/
      case instructions.ADD_LIT_REG: { // add literal to regiister
        const value = this.fetch16();
        const r = this.fetch();
        const rValue = this.registers.getUint16(r);
        this.setRegister('acc', value + rValue);
        return;
      }
      case instructions.ADD_REG_REG: { // add register to regiister
        const r1 = this.fetch();
        const r2 = this.fetch();
        const rValue1 = this.registers.getUint16(r1);
        const rValue2 = this.registers.getUint16(r2);
        this.setRegister('acc', rValue1 + rValue2);
        return;
      }

      /************************
       * control instructions *
       ***********************/
      case instructions.JMP_NOT_EQ: { // jump if not equal
        const value = this.fetch16();
        const address = this.fetch16();
        if (value !== this.getRegister('acc')) {
          this.setRegister('ip', address);
        }
        return;
      }

      /***********************
       * system instructions *
       **********************/
      case instructions.CAL_LIT: { // call literal (memory)
        const address = this.fetch16();
        this.pushState();
        this.setRegister('ip', address);
        return;
      }
      case instructions.CAL_REG: { // call register
        const r = this.fetchRegisterIndex();
        const address = this.registers.getUint16(r);
        this.pushState();
        this.setRegister('ip', address);
        return;
      }
      case instructions.RET: {
        this.popState();
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

  run() {
    const halt = this.step();
    if (!halt) {
      setImmediate(() => this.run());
    }
  }

  halt() {
    this.halted = true;
  }
}

module.exports = CPU;
